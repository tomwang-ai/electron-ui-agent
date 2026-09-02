import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

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
