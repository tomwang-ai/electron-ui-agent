import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import YAML from 'yaml'
import type { Step, Target, TestCase } from './types.js'

const supportedExtensions = new Set(['.json', '.yaml', '.yml', '.md'])

function requireObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`)
  }
  return value as Record<string, unknown>
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string`)
  }
  return value
}

function parseTarget(value: unknown, label: string): Target {
  const target = requireObject(value, label)
  const parsed: Target = {}
  for (const key of ['role', 'name', 'text', 'testId', 'css'] as const) {
    if (target[key] !== undefined) parsed[key] = requireString(target[key], `${label}.${key}`)
  }
  if (!parsed.role && !parsed.text && !parsed.testId && !parsed.css) {
    throw new Error(`${label} needs role, text, testId, or css`)
  }
  return parsed
}

function parseStep(value: unknown, index: number): Step {
  const step = requireObject(value, `steps[${index}]`)
  const action = requireString(step.action, `steps[${index}].action`) as Step['action']
  const target = step.target === undefined ? undefined : parseTarget(step.target, `steps[${index}].target`)

  switch (action) {
    case 'click':
    case 'assertVisible':
      if (!target) throw new Error(`${action} requires target`)
      return { action, target }
    case 'fill':
    case 'assertText':
    case 'assertValue':
      if (!target) throw new Error(`${action} requires target`)
      return { action, target, value: requireString(step.value, `steps[${index}].value`) }
    case 'press':
      return { action, key: requireString(step.key, `steps[${index}].key`), target }
    case 'wait': {
      const milliseconds = step.milliseconds
      if (milliseconds !== undefined && (!Number.isFinite(milliseconds) || Number(milliseconds) < 0)) {
        throw new Error(`steps[${index}].milliseconds must be a non-negative number`)
      }
      if (milliseconds === undefined && !target) throw new Error('wait requires milliseconds or target')
      return { action, milliseconds: milliseconds === undefined ? undefined : Number(milliseconds), target }
    }
    case 'screenshot':
      return { action, name: step.name === undefined ? undefined : requireString(step.name, `steps[${index}].name`) }
    default:
      throw new Error(`Unsupported action: ${action}`)
  }
}

function parseMarkdown(text: string): unknown {
  const match = text.match(/```(?:yaml|yml|json)\s*\r?\n([\s\S]*?)```/i)
  if (!match) throw new Error('Markdown case must contain one yaml or json fenced block')
  return YAML.parse(match[1])
}

export function parseCase(input: unknown): TestCase {
  const value = requireObject(input, 'case')
  const app = requireObject(value.app, 'app')
  if (!Array.isArray(value.steps) || value.steps.length === 0) {
    throw new Error('steps must be a non-empty array')
  }

  const args = app.args
  const env = app.env
  if (args !== undefined && !Array.isArray(args)) throw new Error('app.args must be an array')
  if (app.timeoutMs !== undefined && (!Number.isFinite(app.timeoutMs) || Number(app.timeoutMs) <= 0)) {
    throw new Error('app.timeoutMs must be a positive number')
  }
  if (app.actionTimeoutMs !== undefined && (!Number.isFinite(app.actionTimeoutMs) || Number(app.actionTimeoutMs) <= 0)) {
    throw new Error('app.actionTimeoutMs must be a positive number')
  }
  return {
    name: requireString(value.name, 'name'),
    app: {
      executablePath: requireString(app.executablePath, 'app.executablePath'),
      args: args === undefined ? undefined : (args as unknown[]).map((item, index) => requireString(item, `app.args[${index}]`)),
      env:
        env === undefined
          ? undefined
          : Object.fromEntries(
              Object.entries(requireObject(env, 'app.env')).map(([key, item]) => [key, requireString(item, `app.env.${key}`)])
            ),
      timeoutMs: app.timeoutMs === undefined ? undefined : Number(app.timeoutMs),
      actionTimeoutMs: app.actionTimeoutMs === undefined ? undefined : Number(app.actionTimeoutMs)
    },
    steps: value.steps.map(parseStep)
  }
}

export async function loadCase(filePath: string): Promise<TestCase> {
  const text = await readFile(filePath, 'utf8')
  const extension = path.extname(filePath).toLowerCase()
  const raw = extension === '.md' ? parseMarkdown(text) : extension === '.json' ? JSON.parse(text) : YAML.parse(text)
  return parseCase(raw)
}

export async function discoverCases(inputPath: string): Promise<string[]> {
  const entries = await readdir(inputPath, { withFileTypes: true }).catch(() => undefined)
  if (!entries) return supportedExtensions.has(path.extname(inputPath).toLowerCase()) ? [inputPath] : []

  const discovered = await Promise.all(
    entries.map(entry => {
      const child = path.join(inputPath, entry.name)
      return entry.isDirectory() ? discoverCases(child) : Promise.resolve(supportedExtensions.has(path.extname(entry.name).toLowerCase()) ? [child] : [])
    })
  )
  return discovered.flat().sort()
}
