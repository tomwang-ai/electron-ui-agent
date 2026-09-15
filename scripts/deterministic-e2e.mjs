import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { access } from 'node:fs/promises'
import electron from 'electron'
import { loadCase } from '../dist/case-loader.js'
import { runCase } from '../dist/runner.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.env.ELECTRON_EXECUTABLE = electron
process.env.DETERMINISTIC_APP_ENTRY = path.join(root, 'examples', 'deterministic-app', 'main.cjs')
const scenarios = [
  { file: 'query-reset.yaml', fault: 'reset', failedStep: 4, assertion: 'assertValue' },
  { file: 'category-filter.yaml', fault: 'filter', failedStep: 3, assertion: 'assertCount' },
  { file: 'editor-items.yaml', fault: 'items', failedStep: 15, assertion: 'assertCount' }
]
const results = []
for (const scenario of scenarios) {
  for (const fault of ['', scenario.fault]) {
    process.env.DETERMINISTIC_FAULT = fault
    const testCase = await loadCase(path.join(root, 'examples', 'deterministic-cases', scenario.file))
    const result = await runCase(testCase, path.join(root, 'artifacts', 'deterministic'))
    assert.equal(result.status, fault ? 'failed' : 'passed', result.error)
    if (fault) {
      const failure = result.steps.at(-1)
      assert.equal(failure?.index, scenario.failedStep)
      assert.equal(failure?.action, scenario.assertion)
      assert.equal(failure?.status, 'failed')
      assert.match(result.error, new RegExp(`^${scenario.assertion}: expected state`))
      assert.ok(result.artifacts.some(file => file.endsWith('-failure.png')))
    } else {
      assert.equal(result.steps.length, testCase.steps.length)
    }
    for (const artifact of result.artifacts) await access(artifact)
    results.push({ scenario: scenario.file, mode: fault || 'normal', status: result.status, runId: result.runId, artifacts: result.artifacts })
  }
}
console.log(JSON.stringify({ modelIntegration: 'none', serial: true, normalPassed: 3, injectedFaultsDetected: 3, results }))
