import { setTimeout as delay } from 'node:timers/promises'

export async function assertEventually<T>(read: (remainingMs: number) => Promise<T>, expected: T, timeoutMs: number, action: string): Promise<void> {
  const deadline = performance.now() + timeoutMs
  const failure = () => new Error(`${action}: expected state was not observed within ${timeoutMs} ms`)
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(failure()), timeoutMs) })
  const poll = async () => {
    while (true) {
      const remainingMs = deadline - performance.now()
      if (remainingMs <= 0) throw failure()
      const actual = await read(remainingMs)
      if (performance.now() >= deadline) throw failure()
      if (actual === expected) return
      await delay(Math.min(50, Math.max(0, deadline - performance.now())))
    }
  }
  try {
    await Promise.race([poll(), timeout])
  } finally {
    clearTimeout(timer!)
  }
}
