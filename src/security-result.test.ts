import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assessSecurityReport, securityExitCode } from './security-result.js'
import { invocation, securityInput } from './security-config.js'

const clean = () => ({ conclusion: 'PASS', scanners: {
  gitleaks: { status: 'passed', findings: 0, returncode: 0 },
  semgrep: { status: 'passed', findings: 0, returncode: 0 },
  trivy: { status: 'passed', findings: 0, returncode: 0 }
} })

test('requires all source scanners and consistent reports for PASS', () => {
  assert.equal(assessSecurityReport(clean(), 0).conclusion, 'PASS')
  for (const value of [null, {}, { conclusion: 'PASS' }, { conclusion: 'PASS', scanners: {} },
    { conclusion: 'PASS', scanners: { gitleaks: { status: 'passed' } } }]) {
    assert.equal(assessSecurityReport(value, 0).conclusion, 'INCONCLUSIVE')
  }
  assert.equal(assessSecurityReport(clean(), 1).conclusion, 'INCONCLUSIVE')
  assert.equal(assessSecurityReport(clean(), 2).conclusion, 'INCONCLUSIVE')
  assert.equal(assessSecurityReport(clean(), null).conclusion, 'INCONCLUSIVE')
})

test('findings survive incomplete coverage and never become a clean result', () => {
  const report = clean()
  report.scanners.gitleaks = { status: 'findings', findings: 2, returncode: 1 }
  assert.equal(assessSecurityReport(report, 1).conclusion, 'BLOCKED')
  report.scanners.semgrep = { status: 'error', findings: 0, returncode: 2 }
  const result = assessSecurityReport(report, 2)
  assert.equal(result.conclusion, 'INCONCLUSIVE')
  assert.equal(result.checks[0].findings, 2)
  report.scanners.semgrep = { status: 'passed', findings: 0, returncode: 1 }
  assert.equal(assessSecurityReport(report, 1).conclusion, 'INCONCLUSIVE')
  const malformed = assessSecurityReport({ ...report, scanners: { ...report.scanners, semgrep: null } }, 2)
  assert.equal(malformed.conclusion, 'INCONCLUSIVE')
  assert.equal(malformed.checks[0].findings, 2)
})

test('package malware exit code and missing extraction coverage are handled separately', () => {
  const report = { conclusion: 'BLOCKED', checks: {
    signature: { status: 'passed' }, defender: { status: 'findings', returncode: 2 },
    extraction: { status: 'passed' }, asar: { status: 'passed' }, content: { status: 'passed' }
  } }
  assert.equal(assessSecurityReport(report, 1, 'package').conclusion, 'BLOCKED')
  assert.equal(assessSecurityReport({ conclusion: 'PASS', checks: { signature: { status: 'passed' } } }, 0, 'package').conclusion, 'INCONCLUSIVE')
})

test('baseline and runtime collection are evidence, not a safety verdict', () => {
  const baseline = assessSecurityReport({ conclusion: 'BASELINE_READY', unsignedOrInvalid: 2 }, 0, 'installed-static')
  assert.equal(baseline.conclusion, 'INCONCLUSIVE')
  assert.equal(baseline.checks[0].findings, 2)
  assert.equal(assessSecurityReport({ conclusion: 'EVIDENCE_COLLECTED' }, 0, 'installed-dynamic').conclusion, 'INCONCLUSIVE')
})

test('adapter messages, unknown check names and arbitrary evidence paths never reach summaries', () => {
  const report = { ...clean(), error: 'synthetic-private-value', artifacts: ['synthetic-private-value'],
    checks: { 'synthetic-private-value': { status: 'error', error: 'synthetic-private-value' } } }
  const result = assessSecurityReport(report, 2)
  assert.ok(!JSON.stringify(result).includes('synthetic-private-value'))
  assert.equal(result.checks.at(-1)?.name, 'check-4')
  assert.deepEqual(['PASS', 'BLOCKED', 'INCONCLUSIVE'].map(value => securityExitCode(value as 'PASS')), [0, 1, 2])
})

test('requests cannot inject execution options and each mode has fixed arguments', () => {
  const config = { python: 'python', powershell: 'powershell', timeoutMs: 90_000,
    adapters: { repository: 'source.py', package: 'package.py', 'installed-static': 'static.ps1', 'installed-dynamic': 'dynamic.ps1' } }
  assert.equal(securityInput.safeParse({ mode: 'repository', target: 'target', command: 'anything' }).success, false)
  assert.equal(securityInput.safeParse({ mode: 'installed-dynamic', target: 'target', durationSeconds: 0 }).success, false)
  const target = 'synthetic target & literal'
  assert.deepEqual(invocation(config, securityInput.parse({ mode: 'repository', target }), target, 'output')?.args,
    ['source.py', '--repo', target, '--output', 'output'])
  assert.deepEqual(invocation(config, securityInput.parse({ mode: 'package', target }), target, 'output')?.args,
    ['package.py', '--package', target, '--output', 'output'])
  const args = invocation(config, securityInput.parse({ mode: 'installed-dynamic', target }), target, 'output')!.args
  assert.deepEqual(args, ['-NoProfile', '-NonInteractive', '-File', 'dynamic.ps1', '-Exe', target, '-Output', 'output', '-DurationSeconds', '60'])
  assert.ok(!invocation(config, securityInput.parse({ mode: 'installed-static', target }), target, 'output')!.args.includes('-AllowRunning'))
})
