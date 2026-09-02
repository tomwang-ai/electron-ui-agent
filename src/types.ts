export type Target = {
  role?: string
  name?: string
  text?: string
  testId?: string
  css?: string
}

export type Step =
  | { action: 'click'; target: Target }
  | { action: 'fill'; target: Target; value: string }
  | { action: 'press'; key: string; target?: Target }
  | { action: 'wait'; milliseconds?: number; target?: Target }
  | { action: 'assertVisible'; target: Target }
  | { action: 'assertText'; target: Target; value: string }
  | { action: 'assertValue'; target: Target; value: string }
  | { action: 'screenshot'; name?: string }

export type TestCase = {
  name: string
  app: {
    executablePath: string
    args?: string[]
    env?: Record<string, string>
    timeoutMs?: number
    actionTimeoutMs?: number
  }
  steps: Step[]
}

export type StepResult = {
  index: number
  action: Step['action']
  status: 'passed' | 'failed'
  durationMs: number
  error?: string
}

export type RunResult = {
  runId: string
  caseName: string
  status: 'passed' | 'failed'
  startedAt: string
  durationMs: number
  steps: StepResult[]
  artifacts: string[]
  error?: string
}
