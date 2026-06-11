# @rtvnoord/monitoring

Centrale monitoring-helpers voor RTV Noord-tools.

Eén plek waar alle tools van afhangen. Update hier → bump versie → tools
krijgen het via een `npm install @rtvnoord/monitoring@x.y.z`.

## Wat zit erin

- **Tool-status + maintenance** — middleware-helper die periodiek pingt naar
  `toolbox.rtvnoord.nl/api/tool-status` (gecached 15s) en redirect naar
  `/maintenance` wanneer admin dat aanzet.
- **Error-logger** — uncaught browser/server errors worden naar
  `toolbox.rtvnoord.nl/api/errors` gestuurd. Drie lagen: window-handlers,
  React error boundary, en Next.js `onRequestError` (15+) /
  `withErrorReporter` route-wrapper (14).
- **Errors-proxy** — `/api/errors` route die het secret server-side houdt.

## Installatie

In Plesk én lokaal — env-vars die de helper leest:
```
TOOL_SLUG=<slug>
BEHEER_API_URL=https://toolbox.rtvnoord.nl
BEHEER_API_SECRET=<uit vault>
```

In een tool:
```bash
npm install github:rtvnoord/rtvnoord-monitoring-lib#v0.1.0
```

`next.config.js` — Next-build moet de TypeScript van deze package
transpileren:
```js
const nextConfig = {
  transpilePackages: ['@rtvnoord/monitoring'],
  experimental: {
    instrumentationHook: true, // alleen op Next.js 14, default aan op 15+
  },
}
```

## Gebruik

### Middleware
```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken }                  from 'next-auth/jwt'
import { withMonitoring, monitoringMatcher } from '@rtvnoord/monitoring/middleware'

function isPublicPath(p: string): boolean {
  return (
    p.startsWith('/api/auth/')   ||
    p.startsWith('/api/errors')   ||
    p === '/login'                ||
    p.startsWith('/maintenance')  ||
    p.startsWith('/_next/')       ||
    p.startsWith('/logos/')       ||
    p === '/favicon.ico'
  )
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Tool-specifieke auth check
  if (!isPublicPath(pathname)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  return withMonitoring(req)
}

export const config = monitoringMatcher
```

### Error-proxy route
```ts
// app/api/errors/route.ts
export { POST } from '@rtvnoord/monitoring/errors-route'
export const dynamic = 'force-dynamic'
```

### Client error handlers
```tsx
// app/layout.tsx
import { ErrorReporterClient } from '@rtvnoord/monitoring/ErrorReporterClient'

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <ErrorReporterClient />
        {children}
      </body>
    </html>
  )
}
```

### Global error boundary
```tsx
// app/global-error.tsx
export { default } from '@rtvnoord/monitoring/GlobalError'
```

### Instrumentation (Next.js 15+)
```ts
// instrumentation.ts
export { register, onRequestError } from '@rtvnoord/monitoring/instrumentation'
```

### Route handler wrapper (Next.js 14)
```ts
import { withErrorReporter } from '@rtvnoord/monitoring'

export const GET = withErrorReporter(async (req) => {
  // ...
})
```

### Tool-specifieke context bij een error
```ts
import { reportErrorClient } from '@rtvnoord/monitoring'

try {
  await iets()
} catch (err) {
  await reportErrorClient(err, {
    context: { userId: currentUser.id, action: 'export-csv' },
  })
}
```

## Versioning

Semver. Tools pinnen op een tag:
```
"@rtvnoord/monitoring": "github:rtvnoord/rtvnoord-monitoring-lib#v0.1.0"
```

Updaten = tag bumpen in `package.json`, `npm install`, deploy. Of laat
Dependabot/Renovate dat automatisch PRen.
