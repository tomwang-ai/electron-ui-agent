#!/usr/bin/env node
import { parseArgs } from 'node:util'
import path from 'node:path'
import { discoverCases, loadCase } from './case-loader.js'
import { runCase } from './runner.js'

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    output: { type: 'string', short: 'o', default: 'artifacts' },
    help: { type: 'boolean', short: 'h' }
  }
})

if (values.help || positionals.length !== 1) {
  console.log('Usage: electron-ui-agent <case-file-or-directory> [--output <directory>]')
  process.exit(values.help ? 0 : 1)
}

const files = await discoverCases(path.resolve(positionals[0]))
if (files.length === 0) throw new Error('No supported case files found')

let failed = false
for (const file of files) {
  const result = await runCase(await loadCase(file), path.resolve(values.output as string))
  console.log(JSON.stringify({ runId: result.runId, caseName: result.caseName, status: result.status, error: result.error, artifacts: result.artifacts }))
  failed ||= result.status === 'failed'
}
process.exitCode = failed ? 1 : 0
