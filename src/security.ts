import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { invocation, isWithin, regularFile, securityInput, workspacePath, type SecurityConfig, type SecurityMode } from './security-config.js'
import { assessSecurityReport, type SecurityAssessment } from './security-result.js'

export type SecurityResult = SecurityAssessment & {
  runId: string
  mode: SecurityMode
  startedAt: string
  durationMs: number
  exitCode: number | null
  artifacts: string[]
}

function scannerEnvironment(): NodeJS.ProcessEnv {
  const allowed = new Set(['path', 'systemroot', 'windir', 'comspec', 'pathext', 'programdata', 'programfiles', 'programfiles(x86)', 'temp', 'tmp', 'home', 'userprofile', 'localappdata', 'appdata'])
  return Object.fromEntries(Object.entries(process.env).filter(([name]) => allowed.has(name.toLowerCase())))
}

async function execute(executable: string, args: string[], cwd: string, timeoutMs: number) {
  return await new Promise<{ exitCode: number | null; reason?: string }>(resolve => {
    const child = spawn(executable, args, {
      cwd, shell: false, windowsHide: true, detached: process.platform !== 'win32',
      stdio: 'ignore', env: { ...scannerEnvironment(), SEMGREP_SEND_METRICS: 'off' }
    })
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      if (!child.pid) return
      if (process.platform === 'win32') {
        const killer = spawn(path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' })
        killer.on('error', () => child.kill())
        killer.on('exit', code => { if (code !== 0) child.kill() })
      } else {
        try { process.kill(-child.pid, 'SIGKILL') } catch { child.kill('SIGKILL') }
      }
    }, timeoutMs)
    child.on('error', () => { clearTimeout(timer); resolve({ exitCode: null, reason: 'adapter-start-failed' }) })
    child.on('exit', code => { clearTimeout(timer); resolve({ exitCode: code, ...(timedOut ? { reason: 'adapter-timeout' } : {}) }) })
  })
}

const summaryNames: Record<SecurityMode, string> = {
  repository: 'summary.json', package: 'summary.json',
  'installed-static': 'baseline-summary.json', 'installed-dynamic': 'runtime-summary.json'
}

export async function runSecurityScan(config: SecurityConfig, rawInput: unknown, workspace: string): Promise<SecurityResult> {
  const parsed = securityInput.safeParse(rawInput)
  if (!parsed.success) throw new Error('Invalid security scan request')
  const input = parsed.data
  if (input.mode === 'installed-dynamic' && !input.loginConfirmed) throw new Error('Confirm the client is running and logged in before dynamic collection')
  const target = await workspacePath(workspace, input.target)
  const targetStat = await stat(target).catch(() => undefined)
  const directoryMode = input.mode === 'repository' || input.mode === 'installed-static'
  if (!targetStat || (directoryMode ? !targetStat.isDirectory() : !targetStat.isFile())) throw new Error('Scan target is missing or has the wrong type')
  const outputRoot = await workspacePath(workspace, input.outputDir)
  const targetRoot = directoryMode ? target : path.dirname(target)
  if (isWithin(targetRoot, outputRoot) || isWithin(outputRoot, targetRoot)) throw new Error('Output and target directories must be separate and non-overlapping')
  const started = Date.now()
  const runId = randomUUID()
  await mkdir(outputRoot, { recursive: true })
  const output = path.join(outputRoot, runId)
  await mkdir(output)
  const rawOutput = path.join(output, 'evidence')
  let assessment: SecurityAssessment = { conclusion: 'INCONCLUSIVE', checks: [] }
  let exitCode: number | null = null
  const command = invocation(config, input, target, rawOutput)
  if (input.mode !== 'repository' && process.platform !== 'win32') {
    assessment.reason = 'windows-required'
  } else if (!command || !await regularFile(command.executable) || !await regularFile(config.adapters[input.mode])) {
    assessment.reason = 'adapter-or-runtime-unavailable'
  } else if (input.mode === 'installed-dynamic' && config.timeoutMs < (input.durationSeconds + 30) * 1000) {
    assessment.reason = 'timeout-shorter-than-collection'
  } else {
    const execution = await execute(command.executable!, command.args, path.resolve(workspace), config.timeoutMs)
    exitCode = execution.exitCode
    try {
      const reportPath = await workspacePath(output, path.join(rawOutput, summaryNames[input.mode]))
      const size = (await stat(reportPath)).size
      if (size > 4 * 1024 * 1024) throw new Error('Report too large')
      assessment = assessSecurityReport(JSON.parse((await readFile(reportPath, 'utf8')).replace(/^\uFEFF/, '')), exitCode, input.mode)
    } catch {
      assessment = { conclusion: 'INCONCLUSIVE', checks: [], reason: 'report-unavailable-or-invalid' }
    }
    if (execution.reason) assessment = { ...assessment, conclusion: 'INCONCLUSIVE', reason: execution.reason }
  }
  const result: SecurityResult = {
    runId, mode: input.mode, startedAt: new Date(started).toISOString(), durationMs: Date.now() - started,
    ...assessment, exitCode, artifacts: [path.join(output, 'result.json'), path.join(output, 'report.md')]
  }
  if (await stat(rawOutput).then(() => true, () => false)) result.artifacts.push(rawOutput)
  const lines = [
    '# Local security scan', '', `- Mode: ${result.mode}`, `- Conclusion: ${result.conclusion}`,
    `- Run: ${result.runId}`, `- Adapter exit: ${exitCode ?? 'unavailable'}`,
    ...(result.reason ? [`- Coverage: ${result.reason}`] : []), '',
    '| Check | Status | Findings |', '|---|---|---|',
    ...result.checks.map(check => `| ${check.name} | ${check.status} | ${check.findings ?? 'not counted'} |`), '',
    'Scanner findings require review; PASS applies only to the configured adapter scope.',
    'Evidence is local and private. Review and redact adapter files before sharing. No automatic remediation.', ''
  ]
  await writeFile(result.artifacts[0], `${JSON.stringify(result, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' })
  await writeFile(result.artifacts[1], lines.join('\n'), { encoding: 'utf8', flag: 'wx' })
  return result
}
