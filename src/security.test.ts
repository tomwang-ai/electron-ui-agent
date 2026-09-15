import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, readdir, symlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import { loadSecurityConfig, workspacePath } from './security-config.js'
import { runSecurityScan } from './security.js'

async function fixture(options: { status?: string; hold?: boolean; noReport?: boolean; child?: boolean } = {}) {
  const root = path.resolve('artifacts/security-tests')
  await mkdir(root, { recursive: true })
  const workspace = await mkdtemp(path.join(root, 'run-'))
  const target = path.join(workspace, 'synthetic target & literal')
  await mkdir(target)
  await writeFile(path.join(target, 'unchanged.txt'), 'synthetic input')
  const script = path.join(workspace, 'adapter.cjs')
  await writeFile(script, `
const fs = require('node:fs'); const path = require('node:path');
const output = process.argv[process.argv.indexOf('--output') + 1];
fs.mkdirSync(output);
if (process.env.SYNTHETIC_SCAN_SECRET) process.exit(3);
console.log('synthetic-private-value'); console.error('synthetic-private-value');
${options.child ? `require('node:child_process').spawn(process.execPath, ['-e', "setTimeout(() => require('node:fs').writeFileSync('orphan-marker', 'bad'), 3000)"], { stdio: 'ignore' });` : ''}
${options.hold ? 'setTimeout(() => {}, 30000);' : options.noReport ? 'process.exit(0);' : `
fs.writeFileSync(path.join(output, 'summary.json'), '\\uFEFF' + JSON.stringify({
  conclusion: ${JSON.stringify(options.status ?? 'PASS')}, scanners: {
    gitleaks: { status: 'passed', findings: 0 }, semgrep: { status: 'passed', findings: 0 }, trivy: { status: 'passed', findings: 0 }
  }, error: 'synthetic-private-value'
}));`}
`)
  const configFile = path.join(workspace, 'security.local.json')
  await writeFile(configFile, JSON.stringify({ python: process.execPath, timeoutMs: options.hold ? 1000 : 10_000, adapters: { repository: './adapter.cjs' } }))
  return { workspace, target, configFile, config: await loadSecurityConfig(configFile) }
}

test('runs a local adapter with fixed literal arguments, private output and immutable targets', async () => {
  const f = await fixture()
  process.env.SYNTHETIC_SCAN_SECRET = 'synthetic-private-value'
  try {
    const result = await runSecurityScan(f.config, { mode: 'repository', target: f.target }, f.workspace)
    assert.equal(result.conclusion, 'PASS')
    assert.equal(result.exitCode, 0)
    assert.equal(result.artifacts.length, 3)
    assert.ok(!JSON.stringify(result).includes('synthetic-private-value'))
    assert.ok(!(await readFile(result.artifacts[1], 'utf8')).includes('synthetic-private-value'))
    assert.equal(await readFile(path.join(f.target, 'unchanged.txt'), 'utf8'), 'synthetic input')
    const second = await runSecurityScan(f.config, { mode: 'repository', target: f.target }, f.workspace)
    assert.notEqual(result.runId, second.runId)
    assert.deepEqual(JSON.parse(await readFile(result.artifacts[0], 'utf8')), result)
  } finally { delete process.env.SYNTHETIC_SCAN_SECRET }
})

test('missing adapters and missing reports cannot pass', async () => {
  const f = await fixture({ noReport: true })
  const result = await runSecurityScan(f.config, { mode: 'repository', target: f.target }, f.workspace)
  assert.equal(result.conclusion, 'INCONCLUSIVE')
  assert.equal(result.reason, 'report-unavailable-or-invalid')
  const missing = await runSecurityScan({ ...f.config, adapters: {} }, { mode: 'repository', target: f.target }, f.workspace)
  assert.equal(missing.reason, 'adapter-or-runtime-unavailable')
})

test('rejects traversal, symlink escapes, overlapping output and unconfirmed dynamic collection', async () => {
  const f = await fixture()
  await assert.rejects(workspacePath(f.workspace, '../outside'), /inside/)
  const outside = path.dirname(f.workspace)
  const link = path.join(f.workspace, 'escape')
  await symlink(outside, link, process.platform === 'win32' ? 'junction' : 'dir')
  await assert.rejects(workspacePath(f.workspace, 'escape/new/output'), /inside/)
  for (const outputDir of [f.target, path.join(f.target, 'reports'), f.workspace]) {
    await assert.rejects(runSecurityScan(f.config, { mode: 'repository', target: f.target, outputDir }, f.workspace), /non-overlapping/)
  }
  await assert.rejects(runSecurityScan(f.config, { mode: 'installed-dynamic', target: 'anything' }, f.workspace), /logged in/)
  assert.ok(!(await readdir(f.workspace)).includes('.eui-agent-runs'))
})

test('timeouts stop the adapter process tree and return a coverage gap', async () => {
  const f = await fixture({ hold: true, child: true })
  const result = await runSecurityScan(f.config, { mode: 'repository', target: f.target }, f.workspace)
  assert.equal(result.conclusion, 'INCONCLUSIVE')
  assert.equal(result.reason, 'adapter-timeout')
  await new Promise(resolve => setTimeout(resolve, 3500))
  assert.ok(!(await readdir(f.workspace)).includes('orphan-marker'))
})

test('CLI maps assessment to exit codes and reports invalid input without private details', async () => {
  const f = await fixture()
  const cli = path.resolve('dist/security-cli.js')
  const args = [cli, 'repository', f.target, '--config', f.configFile, '--workspace', f.workspace]
  const pass = spawnSync(process.execPath, args, { encoding: 'utf8' })
  assert.equal(pass.status, 0, pass.stderr)
  assert.equal(JSON.parse(pass.stdout).conclusion, 'PASS')
  const fail = spawnSync(process.execPath, [...args, '--output', f.target], { encoding: 'utf8' })
  assert.equal(fail.status, 2)
  assert.ok(!fail.stderr.includes(f.target))
  await writeFile(f.configFile, JSON.stringify({ command: 'synthetic-private-value', adapters: {} }))
  await assert.rejects(loadSecurityConfig(f.configFile), /^Error: Security configuration is unreadable or invalid$/)
})

test('Windows PowerShell adapters receive static and confirmed dynamic arguments', { skip: process.platform !== 'win32' }, async () => {
  const f = await fixture()
  const script = path.join(f.workspace, 'adapter.ps1')
  await writeFile(script, `
param([string]$Target, [string]$Exe, [string]$Output, [int]$DurationSeconds)
$ErrorActionPreference = 'Stop'
[IO.Directory]::CreateDirectory($Output) | Out-Null
if ($Target) {
  if (-not (Test-Path -LiteralPath $Target -PathType Container)) { exit 2 }
  @{ conclusion = 'BASELINE_READY'; unsignedOrInvalid = 1 } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $Output 'baseline-summary.json') -Encoding UTF8
} else {
  if (-not (Test-Path -LiteralPath $Exe -PathType Leaf) -or $DurationSeconds -ne 5) { exit 2 }
  @{ conclusion = 'EVIDENCE_COLLECTED' } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $Output 'runtime-summary.json') -Encoding UTF8
}
`)
  const config = { ...f.config, timeoutMs: 40_000,
    powershell: path.join(process.env.SystemRoot!, 'System32/WindowsPowerShell/v1.0/powershell.exe'),
    adapters: { 'installed-static': script, 'installed-dynamic': script } }
  const baseline = await runSecurityScan(config, { mode: 'installed-static', target: f.target }, f.workspace)
  assert.equal(baseline.reason, 'evidence-requires-review-and-coverage')
  assert.equal(baseline.checks[0].findings, 1)
  const runtime = await runSecurityScan(config, { mode: 'installed-dynamic', target: path.join(f.target, 'unchanged.txt'), loginConfirmed: true, durationSeconds: 5 }, f.workspace)
  assert.equal(runtime.reason, 'evidence-requires-review-and-coverage')
  assert.notEqual(baseline.runId, runtime.runId)
})
