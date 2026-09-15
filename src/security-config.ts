import { readFile, realpath, stat } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

export const securityModes = ['repository', 'package', 'installed-static', 'installed-dynamic'] as const
export type SecurityMode = typeof securityModes[number]

export const securityInput = z.object({
  mode: z.enum(securityModes),
  target: z.string().min(1),
  outputDir: z.string().min(1).default('.eui-agent-runs/security'),
  loginConfirmed: z.boolean().default(false),
  durationSeconds: z.number().int().min(5).max(3600).default(60)
}).strict()
export type SecurityInput = z.infer<typeof securityInput>

const configSchema = z.object({
  python: z.string().min(1).optional(),
  powershell: z.string().min(1).optional(),
  timeoutMs: z.number().int().min(1000).max(14_400_000).default(900_000),
  adapters: z.object({
    repository: z.string().min(1).optional(),
    package: z.string().min(1).optional(),
    'installed-static': z.string().min(1).optional(),
    'installed-dynamic': z.string().min(1).optional()
  }).strict()
}).strict()
export type SecurityConfig = z.infer<typeof configSchema>

// Only the operator supplies this file at process startup, never an MCP caller.
export async function loadSecurityConfig(file: string): Promise<SecurityConfig> {
  try {
    const config = configSchema.parse(JSON.parse((await readFile(file, 'utf8')).replace(/^\uFEFF/, '')))
    const base = path.dirname(path.resolve(file))
    if (config.python) config.python = path.resolve(base, config.python)
    if (config.powershell) config.powershell = path.resolve(base, config.powershell)
    for (const mode of securityModes) {
      if (config.adapters[mode]) config.adapters[mode] = path.resolve(base, config.adapters[mode]!)
    }
    return config
  } catch {
    throw new Error('Security configuration is unreadable or invalid')
  }
}

export function isWithin(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate)
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
}

// Resolve existing ancestors too, so a new output below a junction cannot escape.
export async function workspacePath(workspace: string, candidate: string): Promise<string> {
  const root = await realpath(workspace)
  const resolved = path.resolve(root, candidate)
  if (!isWithin(root, resolved)) throw new Error('Security paths must stay inside the configured workspace')
  let ancestor = resolved
  const suffix: string[] = []
  while (true) {
    try {
      const canonical = await realpath(ancestor)
      if (!isWithin(root, canonical)) throw new Error('Security paths must stay inside the configured workspace')
      return path.join(canonical, ...suffix)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      const parent = path.dirname(ancestor)
      if (parent === ancestor) throw new Error('Security path cannot be resolved')
      suffix.unshift(path.basename(ancestor))
      ancestor = parent
    }
  }
}

export async function regularFile(file: string | undefined): Promise<boolean> {
  return file !== undefined && await stat(file).then(value => value.isFile(), () => false)
}

export function invocation(config: SecurityConfig, input: SecurityInput, target: string, output: string) {
  const script = config.adapters[input.mode]
  if (!script) return undefined
  if (input.mode === 'repository' || input.mode === 'package') {
    return { executable: config.python, args: [script, input.mode === 'repository' ? '--repo' : '--package', target, '--output', output] }
  }
  const args = ['-NoProfile', '-NonInteractive', '-File', script]
  args.push(input.mode === 'installed-static' ? '-Target' : '-Exe', target, '-Output', output)
  if (input.mode === 'installed-dynamic') args.push('-DurationSeconds', String(input.durationSeconds))
  return { executable: config.powershell, args }
}
