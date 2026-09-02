import { mkdir, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { _electron, type ElectronApplication, type Locator, type Page } from 'playwright'
import type { RunResult, Step, StepResult, Target, TestCase } from './types.js'

function expand(value: string): string {
  return value.replace(/\$\{ENV:([A-Z0-9_]+)\}/gi, (_, name: string) => {
    const resolved = process.env[name]
    if (resolved === undefined) throw new Error(`Missing environment variable: ${name}`)
    return resolved
  })
}

function locator(page: Page, target: Target): Locator {
  if (target.role) return page.getByRole(target.role as never, target.name ? { name: target.name } : undefined)
  if (target.testId) return page.getByTestId(target.testId)
  if (target.text) return page.getByText(target.text, { exact: true })
  return page.locator(target.css as string)
}

function safeName(value: string): string {
  return value.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80) || 'artifact'
}

async function executeStep(page: Page, step: Step, outputDir: string, index: number, artifacts: string[]): Promise<void> {
  switch (step.action) {
    case 'click':
      await locator(page, step.target).click()
      break
    case 'fill':
      await locator(page, step.target).fill(expand(step.value))
      break
    case 'press':
      if (step.target) await locator(page, step.target).press(step.key)
      else await page.keyboard.press(step.key)
      break
    case 'wait':
      if (step.target) await locator(page, step.target).waitFor({ state: 'visible' })
      else await page.waitForTimeout(step.milliseconds as number)
      break
    case 'assertVisible':
      await locator(page, step.target).waitFor({ state: 'visible' })
      break
    case 'assertText':
      await locator(page, step.target).filter({ hasText: expand(step.value) }).waitFor({ state: 'visible' })
      break
    case 'assertValue': {
      const value = await locator(page, step.target).inputValue()
      if (value !== expand(step.value)) throw new Error(`Expected value ${JSON.stringify(expand(step.value))}, received ${JSON.stringify(value)}`)
      break
    }
    case 'screenshot': {
      const file = path.join(outputDir, `${String(index + 1).padStart(3, '0')}-${safeName(step.name ?? 'screenshot')}.png`)
      await page.screenshot({ path: file })
      artifacts.push(file)
      break
    }
  }
}

export async function runCase(testCase: TestCase, outputRoot = path.resolve('artifacts')): Promise<RunResult> {
  const runId = randomUUID()
  const outputDir = path.join(outputRoot, runId)
  await mkdir(outputDir, { recursive: true })
  const started = Date.now()
  const startedAt = new Date(started).toISOString()
  const artifacts: string[] = []
  const steps: StepResult[] = []
  const consoleMessages: string[] = []
  let application: ElectronApplication | undefined
  let page: Page | undefined
  let error: string | undefined

  try {
    const inheritedEnv = Object.fromEntries(Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined))
    application = await _electron.launch({
      executablePath: expand(testCase.app.executablePath),
      args: (testCase.app.args ?? []).map(expand),
      env: { ...inheritedEnv, ...Object.fromEntries(Object.entries(testCase.app.env ?? {}).map(([key, value]) => [key, expand(value)])) },
      timeout: testCase.app.timeoutMs ?? 30_000
    })
    page = await application.firstWindow()
    page.setDefaultTimeout(testCase.app.actionTimeoutMs ?? 30_000)
    page.on('console', message => consoleMessages.push(`[${message.type()}] ${message.text()}`))
    await page.context().tracing.start({ screenshots: true, snapshots: true })

    for (const [index, step] of testCase.steps.entries()) {
      const stepStarted = Date.now()
      try {
        await executeStep(page, step, outputDir, index, artifacts)
        steps.push({ index, action: step.action, status: 'passed', durationMs: Date.now() - stepStarted })
      } catch (cause) {
        error = cause instanceof Error ? cause.message : String(cause)
        steps.push({ index, action: step.action, status: 'failed', durationMs: Date.now() - stepStarted, error })
        const failureScreenshot = path.join(outputDir, `${String(index + 1).padStart(3, '0')}-failure.png`)
        await page.screenshot({ path: failureScreenshot }).catch(() => undefined)
        artifacts.push(failureScreenshot)
        break
      }
    }
  } catch (cause) {
    error = cause instanceof Error ? cause.message : String(cause)
  } finally {
    if (page) {
      const trace = path.join(outputDir, 'trace.zip')
      await page.context().tracing.stop({ path: trace }).then(() => artifacts.push(trace)).catch(() => undefined)
    }
    if (consoleMessages.length > 0) {
      const consoleFile = path.join(outputDir, 'console.log')
      await writeFile(consoleFile, `${consoleMessages.join('\n')}\n`, 'utf8')
      artifacts.push(consoleFile)
    }
    await application?.close().catch(() => undefined)
  }

  const result: RunResult = {
    runId,
    caseName: testCase.name,
    status: error ? 'failed' : 'passed',
    startedAt,
    durationMs: Date.now() - started,
    steps,
    artifacts,
    ...(error ? { error } : {})
  }
  const resultFile = path.join(outputDir, 'result.json')
  result.artifacts.push(resultFile)
  await writeFile(resultFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  return result
}
