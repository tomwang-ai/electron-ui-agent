import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const client = new Client({ name: 'generic-smoke-client', version: '0.1.0' })
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [path.join(root, 'dist', 'mcp.js'), '--workspace', root]
})

await client.connect(transport)
const tools = await client.listTools()
assert.deepEqual(tools.tools.map(tool => tool.name), ['run_case'])
await client.close()
console.log(JSON.stringify({ status: 'passed', tools: tools.tools.map(tool => tool.name) }))

const fixtureRoot = path.join(root, 'artifacts', 'mcp-security')
await mkdir(fixtureRoot, { recursive: true })
const workspace = await mkdtemp(path.join(fixtureRoot, 'run-'))
await mkdir(path.join(workspace, 'source'))
await writeFile(path.join(workspace, 'adapter.cjs'), `
const fs = require('node:fs'); const path = require('node:path');
const output = process.argv[process.argv.indexOf('--output') + 1];
fs.mkdirSync(output);
console.log('synthetic-private-value');
setTimeout(() => fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify({
  conclusion: 'PASS', scanners: {
    gitleaks: { status: 'passed' }, semgrep: { status: 'passed' }, trivy: { status: 'passed' }
  }
})), 500);
`)
const config = path.join(workspace, 'security.local.json')
await writeFile(config, JSON.stringify({ python: process.execPath, adapters: { repository: './adapter.cjs' } }))
const securityClient = new Client({ name: 'generic-security-client', version: '0.1.0' })
await securityClient.connect(new StdioClientTransport({
  command: process.execPath,
  args: [path.join(root, 'dist', 'mcp.js'), '--workspace', workspace, '--security-config', config]
}))
try {
  assert.deepEqual((await securityClient.listTools()).tools.map(tool => tool.name), ['run_case', 'run_security_scan'])
  const call = args => securityClient.callTool({ name: 'run_security_scan', arguments: args })
  const results = await Promise.all([call({ mode: 'repository', target: 'source' }), call({ mode: 'repository', target: 'source' })])
  assert.equal(results.filter(result => result.isError).length, 1)
  const success = results.find(result => !result.isError)
  assert.equal(JSON.parse(success.content[0].text).conclusion, 'PASS')
  assert.ok(!JSON.stringify(results).includes('synthetic-private-value'))
  assert.equal((await call({ mode: 'repository', target: '../outside' })).isError, true)
  assert.equal((await call({ mode: 'installed-dynamic', target: 'client/demo.exe' })).isError, true)
  const schemaRejection = await call({ mode: 'repository', target: 'source', script: 'untrusted' })
  assert.equal(schemaRejection.isError, true)
} finally {
  await securityClient.close()
}
console.log(JSON.stringify({ status: 'passed', security: 'opt-in, dispatch, serialization and boundaries' }))
