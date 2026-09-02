import assert from 'node:assert/strict'
import electron from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runCase } from '../dist/runner.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const result = await runCase(
  {
    name: 'generic end-to-end example',
    app: { executablePath: electron, args: [path.join(root, 'examples', 'demo-app', 'main.cjs')], timeoutMs: 5_000 },
    steps: [
      { action: 'assertVisible', target: { role: 'heading', name: 'Demo' } },
      { action: 'fill', target: { role: 'textbox', name: 'Display name' }, value: 'Example User' },
      { action: 'click', target: { role: 'button', name: 'Continue' } },
      { action: 'assertVisible', target: { text: 'Completed' } },
      { action: 'screenshot', name: 'completed' }
    ]
  },
  path.join(root, 'artifacts', 'e2e')
)

assert.equal(result.status, 'passed', result.error)
assert.equal(result.steps.length, 5)

const failedResult = await runCase(
  {
    name: 'generic failure evidence example',
    app: {
      executablePath: electron,
      args: [path.join(root, 'examples', 'demo-app', 'main.cjs')],
      timeoutMs: 5_000,
      actionTimeoutMs: 500
    },
    steps: [{ action: 'assertVisible', target: { text: 'Intentionally absent text' } }]
  },
  path.join(root, 'artifacts', 'e2e')
)
assert.equal(failedResult.status, 'failed')
assert.match(failedResult.artifacts.join('\n'), /failure\.png/)
console.log(JSON.stringify({ passedRun: result.status, failedRun: failedResult.status, successSteps: result.steps.length }))
