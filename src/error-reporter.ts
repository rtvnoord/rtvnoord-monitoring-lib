// Centrale error-reporter — wordt gebruikt door zowel server- als
// client-side. Server: posten direct naar toolbox.rtvnoord.nl/api/errors
// met x-beheer-secret. Client: posten naar /api/errors op de eigen origin
// (een proxy via createErrorsProxyRoute) zodat het secret nooit in de
// browser komt.

export type ReportLevel = 'error' | 'warning' | 'info'
export type ReportEnv   = 'production' | 'preview' | 'dev'

export interface ErrorReport {
  message:  string
  stack?:   string | null
  level?:   ReportLevel
  url?:     string
  ua?:      string
  release?: string | null
  context?: Record<string, unknown>
}

const DEDUP_WINDOW_MS = 60_000
const seen = new Map<string, number>()

function makeFingerprintLocal(message: string, stack: string | null): string {
  const firstFrame = (stack || '').split('\n').find((l) => l.trim().startsWith('at')) ?? ''
  return `${message.slice(0, 200)}|${firstFrame.slice(0, 200)}`
}

function isFresh(fingerprint: string): boolean {
  const now    = Date.now()
  const lastAt = seen.get(fingerprint)
  if (lastAt && now - lastAt < DEDUP_WINDOW_MS) return false
  seen.set(fingerprint, now)
  if (seen.size > 200) {
    for (const [k, t] of seen) {
      if (now - t > DEDUP_WINDOW_MS) seen.delete(k)
    }
  }
  return true
}

function inferEnv(): ReportEnv {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return 'production'
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')        return 'dev'
  return 'dev'
}

function getRelease(): string | null {
  if (typeof process === 'undefined' || !process.env) return null
  return (
    process.env.NEXT_PUBLIC_GIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    null
  )
}

function pickMessage(error: unknown): string {
  if (error instanceof Error) return error.message || error.name || 'Unknown error'
  if (typeof error === 'string') return error
  try { return JSON.stringify(error) } catch { return 'Unknown non-Error thrown' }
}

function pickStack(error: unknown): string | null {
  if (error instanceof Error && error.stack) return error.stack
  return null
}

// ─── Server-side ────────────────────────────────────────────
export async function reportErrorServer(
  error:    unknown,
  partial?: Partial<ErrorReport>,
): Promise<void> {
  const message = partial?.message || pickMessage(error)
  const stack   = partial?.stack ?? pickStack(error)

  if (!isFresh(makeFingerprintLocal(message, stack))) return

  const slug = process.env.TOOL_SLUG || ''
  if (!slug) return

  const beheerUrl = (process.env.BEHEER_API_URL || 'https://toolbox.rtvnoord.nl').replace(/\/+$/, '')
  const secret    = process.env.BEHEER_API_SECRET || ''
  if (!secret) return

  const payload = {
    slug,
    message,
    stack,
    level:   partial?.level   || 'error',
    url:     partial?.url     || '',
    ua:      partial?.ua      || '',
    release: partial?.release ?? getRelease(),
    env:     inferEnv(),
    context: partial?.context || {},
  }

  try {
    await fetch(`${beheerUrl}/api/errors`, {
      method:  'POST',
      headers: { 'content-type': 'application/json', 'x-beheer-secret': secret },
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout(2000),
    })
  } catch {
    // Toolbox niet bereikbaar — error blijft in local console.error
  }
}

// ─── Route-handler wrapper (Next.js 14) ─────────────────────
// In Next.js 14 bestaat onRequestError nog niet, dus wrap je route handlers
// expliciet. In 15+ kan deze wrapper weg.
export function withErrorReporter<TArgs extends any[], TReturn>(
  handler: (...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args)
    } catch (err) {
      const req = args[0] as { url?: string; headers?: Headers } | undefined
      await reportErrorServer(err, {
        url: req?.url || '',
        ua:  req?.headers?.get?.('user-agent') || '',
        context: { source: 'route-handler' },
      })
      throw err
    }
  }
}

// ─── Client-side ────────────────────────────────────────────
export async function reportErrorClient(
  error:    unknown,
  partial?: Partial<ErrorReport>,
): Promise<void> {
  const message = partial?.message || pickMessage(error)
  const stack   = partial?.stack ?? pickStack(error)

  if (!isFresh(makeFingerprintLocal(message, stack))) return

  const payload = {
    message,
    stack,
    level:   partial?.level   || 'error',
    url:     partial?.url     || (typeof window !== 'undefined' ? window.location.href : ''),
    ua:      partial?.ua      || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
    release: partial?.release ?? null,
    context: partial?.context || {},
  }

  try {
    await fetch('/api/errors', {
      method:  'POST',
      headers: { 'content-type': 'application/json' },
      body:    JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Eigen /api/errors-proxy onbereikbaar
  }
}
