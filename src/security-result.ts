import { z } from 'zod'
import type { SecurityMode } from './security-config.js'

export type SecurityConclusion = 'PASS' | 'BLOCKED' | 'INCONCLUSIVE'
export type SecurityCheck = { name: string; status: 'passed' | 'findings' | 'error'; findings: number | null }
export type SecurityAssessment = { conclusion: SecurityConclusion; checks: SecurityCheck[]; reason?: string }

const checkSchema = z.object({
  status: z.enum(['passed', 'findings', 'error']),
  findings: z.number().int().nonnegative().nullable().optional(),
  returncode: z.number().int().optional()
})
const reportSchema = z.object({
  conclusion: z.enum(['PASS', 'BLOCKED', 'INCONCLUSIVE', 'BASELINE_READY', 'EVIDENCE_COLLECTED']),
  scanners: z.record(z.string(), z.unknown()).optional(),
  checks: z.record(z.string(), z.unknown()).optional(),
  unsignedOrInvalid: z.number().int().nonnegative().optional()
})
const knownNames = new Set(['gitleaks', 'semgrep', 'trivy', 'signature', 'defender', 'extraction', 'asar', 'content'])

export function assessSecurityReport(value: unknown, exitCode: number | null, mode: SecurityMode = 'repository'): SecurityAssessment {
  const parsed = reportSchema.safeParse(value)
  if (!parsed.success) return { conclusion: 'INCONCLUSIVE', checks: [], reason: 'invalid-report' }
  const report = parsed.data
  const rawEntries = [...Object.entries(report.scanners ?? {}), ...Object.entries(report.checks ?? {})]
  if (rawEntries.length > 100) return { conclusion: 'INCONCLUSIVE', checks: [], reason: 'invalid-report' }
  const entries = rawEntries.map(([name, value]) => {
    const check = checkSchema.safeParse(value)
    return [name, check.success ? check.data : { status: 'error' as const }] as const
  })
  const checks: SecurityCheck[] = entries.map(([name, check], index) => ({
    name: knownNames.has(name) ? name : `check-${index + 1}`,
    status: check.status === 'error' ? 'error' : (check.findings ?? 0) > 0 ? 'findings' : check.status,
    findings: check.findings ?? null
  }))
  if (report.unsignedOrInvalid) checks.push({ name: 'signature', status: 'findings', findings: report.unsignedOrInvalid })
  if (report.conclusion === 'BASELINE_READY' || report.conclusion === 'EVIDENCE_COLLECTED') {
    return { conclusion: 'INCONCLUSIVE', checks, reason: 'evidence-requires-review-and-coverage' }
  }
  const required = mode === 'repository' ? ['gitleaks', 'semgrep', 'trivy'] : mode === 'package' ? ['signature', 'defender', 'extraction', 'asar', 'content'] : []
  const incomplete = report.conclusion === 'INCONCLUSIVE' || checks.length === 0 ||
    required.some(name => !entries.some(([key]) => key === name)) ||
    checks.some(check => check.status === 'error') || (exitCode !== 0 && exitCode !== 1) ||
    entries.some(([name, check]) => check.returncode !== undefined &&
      (check.status === 'passed' ? check.returncode !== 0 : ![0, 1, ...(name === 'defender' ? [2] : [])].includes(check.returncode)))
  if (incomplete) return { conclusion: 'INCONCLUSIVE', checks, reason: 'incomplete-coverage' }
  if (report.conclusion === 'BLOCKED' || checks.some(check => check.status === 'findings')) return { conclusion: 'BLOCKED', checks }
  if (exitCode !== 0) return { conclusion: 'INCONCLUSIVE', checks, reason: 'inconsistent-exit-status' }
  return { conclusion: 'PASS', checks }
}

export const securityExitCode = (conclusion: SecurityConclusion) => conclusion === 'PASS' ? 0 : conclusion === 'BLOCKED' ? 1 : 2
