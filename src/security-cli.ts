#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { loadSecurityConfig } from './security-config.js'
import { securityExitCode } from './security-result.js'
import { runSecurityScan } from './security.js'

try {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      config: { type: 'string' }, workspace: { type: 'string', default: process.cwd() },
      output: { type: 'string', default: '.eui-agent-runs/security' },
      'login-confirmed': { type: 'boolean', default: false }, duration: { type: 'string', default: '60' },
      help: { type: 'boolean', short: 'h' }
    }
  })
  if (values.help || positionals.length !== 2 || !values.config) {
    console.log('Usage: electron-ui-agent-security <repository|package|installed-static|installed-dynamic> <target> --config <local-config.json> [--workspace <directory>] [--output <directory>] [--login-confirmed] [--duration <seconds>]')
    process.exitCode = values.help ? 0 : 2
  } else {
    const result = await runSecurityScan(await loadSecurityConfig(values.config), {
      mode: positionals[0], target: positionals[1], outputDir: values.output,
      loginConfirmed: values['login-confirmed'], durationSeconds: Number(values.duration)
    }, values.workspace)
    console.log(JSON.stringify(result))
    process.exitCode = securityExitCode(result.conclusion)
  }
} catch {
  console.error('Security scan could not start; check configuration, target, workspace boundary and login confirmation.')
  process.exitCode = 2
}
