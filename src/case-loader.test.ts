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

test('allows exact empty input values while rejecting missing and non-string values', () => {
  const example = (action: string, value: unknown) => ({
    name: 'clear input', app: { executablePath: 'example' },
    steps: [{ action, target: { testId: 'query' }, value }]
  })
  for (const action of ['fill', 'assertValue']) {
    assert.equal(parseCase(example(action, '')).steps.length, 1)
    assert.equal(parseCase(example(action, ' ')).steps.length, 1)
    for (const value of [undefined, null, false, 0, []]) {
      assert.throws(() => parseCase(example(action, value)), /value must be a string/)
    }
  }
  assert.throws(() => parseCase(example('assertText', '')), /non-empty string/)
})

test('requires a target and an exact non-negative integer for count assertions', () => {
  const example = (count: unknown, target: unknown = { testId: 'row' }) => ({
    name: 'filter rows', app: { executablePath: 'example' }, steps: [{ action: 'assertCount', target, count }]
  })
  for (const count of [0, 1, 12]) assert.equal(parseCase(example(count)).steps.length, 1)
  for (const count of [undefined, null, false, '1', -1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parseCase(example(count)), /non-negative safe integer/)
  }
  assert.throws(() => parseCase(example(0, null)), /must be an object/)
  assert.throws(() => parseCase({ name: 'missing target', app: { executablePath: 'example' }, steps: [{ action: 'assertCount', count: 0 }] }), /requires target/)
})
