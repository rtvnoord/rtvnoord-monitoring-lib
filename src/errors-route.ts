// Client-side proxy voor de error-logger. Gebruik in elke tool:
//
//   // app/api/errors/route.ts
//   export { POST } from '@rtvnoord/monitoring/errors-route'
//
// De browser post hierheen (eigen origin = geen CORS), en deze route
// voegt slug + shared secret toe en stuurt door naar
// toolbox.rtvnoord.nl/api/errors. Het secret blijft op de server.
//
// Public route — middleware MOET 'm doorlaten via isPublicPath.

import { NextResponse, type NextRequest } from 'next/server'
import { reportErrorServer }              from './error-reporter'

export async function POST(req: NextRequest) {
  let body: any = {}
  try { body = await req.json() } catch { /* lege body OK */ }

  const message = typeof body.message === 'string' ? body.message : ''
  if (!message) {
    return NextResponse.json({ ok: false, error: 'message required' }, { status: 400 })
  }

  await reportErrorServer(
    { message, stack: body.stack ?? null },
    {
      message,
      stack:   typeof body.stack === 'string' ? body.stack : null,
      level:   body.level,
      url:     typeof body.url === 'string' ? body.url : (req.headers.get('referer') || ''),
      ua:      typeof body.ua  === 'string' ? body.ua  : (req.headers.get('user-agent') || ''),
      release: body.release ?? null,
      context: body.context && typeof body.context === 'object' ? body.context : {},
    },
  )

  return NextResponse.json({ ok: true })
}
