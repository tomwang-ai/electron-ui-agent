import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseCase } from './case-loader.js'

test('parses a minimal deterministic case', () => {
  const result = parseCase({
    name: 'opens a generic window',
    app: { executablePath: '${ENV:ELECTRON_EXECUTABLE}' },
    steps: [{ action: 'assertVisible', target: { role: 'heading', name: 'Demo' } }]
  })
  assert.equal(result.steps.length, 1)
})

test('rejects unsupported actions before execution', () => {
  assert.throws(
    () => parseCase({ name: 'unsafe', app: { executablePath: 'app' }, steps: [{ action: 'evaluate', value: 'process.exit()' }] }),
    /Unsupported action/
  )
})
