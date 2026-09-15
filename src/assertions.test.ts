import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assertEventually } from './assertions.js'

test('waits for an exact changed state, including zero and empty strings', async () => {
  let reads = 0
  await assertEventually(async () => ++reads < 2 ? 1 : 0, 0, 1_000, 'assertCount')
  assert.equal(reads, 2)
  await assertEventually(async () => '', '', 100, 'assertValue')
})

test('a read that never settles cannot hold an assertion open', async () => {
  await assert.rejects(assertEventually(() => new Promise<number>(() => {}), 0, 20, 'assertCount'), /assertCount: expected state/)
})

test('an equal sample delivered after the deadline is not accepted', async () => {
  await assert.rejects(assertEventually(async () => {
    const until = performance.now() + 30
    while (performance.now() < until) { /* Exercise a late read before the timer callback can run. */ }
    return 0
  }, 0, 10, 'assertCount'), /assertCount: expected state/)
})

test('read errors remain errors rather than being retried as a mismatch', async () => {
  let reads = 0
  await assert.rejects(assertEventually(async () => { reads++; throw new Error('invalid locator') }, '', 100, 'assertValue'), /invalid locator/)
  assert.equal(reads, 1)
})
