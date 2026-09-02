import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const ignored = new Set(['.git', 'node_modules', 'dist', 'artifacts', '.eui-agent-runs'])
const binaryExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.zip', '.ico', '.woff', '.woff2'])
const checks = [
  ['Windows user path', /[A-Z]:\\Users\\[^\\\s]+/i],
  ['POSIX user path', /\/home\/[^/\s]+/],
  ['private IPv4 address', /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/],
  ['credential-shaped token', /\b(?:ghp_[A-Za-z0-9]{20,}|glpat-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})\b/],
  ['non-example email address', /\b[A-Z0-9._%+-]+@(?!example\.(?:com|org|net)\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i]
]
const privateTerms = (process.env.REPOSITORY_HYGIENE_DENYLIST ?? '')
  .split(/\r?\n/)
  .map(term => term.trim())
  .filter(Boolean)

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries
      .filter(entry => !ignored.has(entry.name))
      .map(entry => {
        const fullPath = path.join(directory, entry.name)
        return entry.isDirectory() ? files(fullPath) : Promise.resolve(binaryExtensions.has(path.extname(entry.name).toLowerCase()) ? [] : [fullPath])
      })
  )
  return nested.flat()
}

const violations = []
for (const file of await files(root)) {
  const content = await readFile(file, 'utf8').catch(() => '')
  for (const [name, pattern] of checks) {
    if (pattern.test(content)) violations.push(`${path.relative(root, file)}: ${name}`)
  }
  if (privateTerms.some(term => content.toLocaleLowerCase().includes(term.toLocaleLowerCase()))) {
    violations.push(`${path.relative(root, file)}: configured private term`)
  }
}

if (violations.length > 0) {
  console.error(`Repository hygiene gate failed:\n${violations.join('\n')}`)
  process.exit(1)
}
console.log('Repository hygiene gate passed')
