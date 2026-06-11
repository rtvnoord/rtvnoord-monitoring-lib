// Instrumentation-helper voor Next.js 15+ onRequestError-hook.
// Gebruik in elke tool:
//
//   // instrumentation.ts (project root)
//   export { register, onRequestError } from '@rtvnoord/monitoring/instrumentation'
//
// In Next.js 14 fire't onRequestError niet — gebruik daar withErrorReporter
// uit @rtvnoord/monitoring rond je route handlers in plaats hiervan.

import { reportErrorServer } from './error-reporter'

export async function register() {
  // Geen init-werk — error-reporter is stateless.
}

export async function onRequestError(
  error:   unknown,
  request: { path: string; method: string; headers: Record<string, string | undefined> },
  context: { routerKind: 'Pages Router' | 'App Router'; routePath: string; routeType: string },
) {
  await reportErrorServer(error, {
    url:     request.path,
    ua:      request.headers['user-agent'] || '',
    context: {
      method:     request.method,
      routerKind: context.routerKind,
      routePath:  context.routePath,
      routeType:  context.routeType,
    },
  })
}
