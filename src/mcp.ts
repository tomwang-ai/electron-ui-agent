#!/usr/bin/env node
import path from 'node:path'
import { parseArgs } from 'node:util'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { loadCase } from './case-loader.js'
import { runCase } from './runner.js'
import { loadSecurityConfig, securityInput } from './security-config.js'
import { runSecurityScan } from './security.js'

const { values } = parseArgs({
  options: {
    workspace: { type: 'string', default: process.env.ELECTRON_UI_AGENT_WORKSPACE ?? process.cwd() },
    'security-config': { type: 'string' }
  }
})
const workspace = path.resolve(values.workspace as string)

function insideWorkspace(candidate: string): string {
  const resolved = path.resolve(workspace, candidate)
  const relative = path.relative(workspace, resolved)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Path must stay inside the configured workspace')
  return resolved
}

const server = new McpServer({ name: 'electron-ui-agent', version: '0.1.0' })

server.registerTool(
  'run_case',
  {
    description: 'Run one deterministic Electron UI test case from the configured workspace.',
    inputSchema: {
      casePath: z.string().describe('Case path relative to the configured workspace'),
      outputDir: z.string().optional().describe('Artifact directory relative to the configured workspace')
    }
  },
  async ({ casePath, outputDir }) => {
    const result = await runCase(await loadCase(insideWorkspace(casePath)), insideWorkspace(outputDir ?? '.eui-agent-runs'))
    const summary = {
      runId: result.runId,
      status: result.status,
      failedStep: result.steps.find(step => step.status === 'failed')?.index,
      error: result.error,
      artifacts: result.artifacts
    }
    return { content: [{ type: 'text', text: JSON.stringify(summary) }], isError: result.status === 'failed' }
  }
)

if (values['security-config']) {
  const config = await loadSecurityConfig(values['security-config'])
  let scanning = false
  server.registerTool('run_security_scan', {
    description: 'Run a configured local security adapter. Dynamic collection requires explicit operator login confirmation. Returns a compact assessment and local artifact paths.',
    inputSchema: securityInput
  }, async input => {
    if (scanning) return { content: [{ type: 'text' as const, text: 'A security scan is already running' }], isError: true }
    scanning = true
    try {
      const result = await runSecurityScan(config, input, workspace)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }], isError: result.conclusion !== 'PASS' }
    } catch {
      return { content: [{ type: 'text' as const, text: 'Security scan rejected; check target, workspace boundary and login confirmation' }], isError: true }
    } finally {
      scanning = false
    }
  })
}

await server.connect(new StdioServerTransport())
