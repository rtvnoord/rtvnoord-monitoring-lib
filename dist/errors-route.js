"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const error_reporter_1 = require("./error-reporter");
async function POST(req) {
    let body = {};
    try {
        body = await req.json();
    }
    catch { /* lege body OK */ }
    const message = typeof body.message === 'string' ? body.message : '';
    if (!message) {
        return server_1.NextResponse.json({ ok: false, error: 'message required' }, { status: 400 });
    }
    await (0, error_reporter_1.reportErrorServer)({ message, stack: body.stack ?? null }, {
        message,
        stack: typeof body.stack === 'string' ? body.stack : null,
        level: body.level,
        url: typeof body.url === 'string' ? body.url : (req.headers.get('referer') || ''),
        ua: typeof body.ua === 'string' ? body.ua : (req.headers.get('user-agent') || ''),
        release: body.release ?? null,
        context: body.context && typeof body.context === 'object' ? body.context : {},
    });
    return server_1.NextResponse.json({ ok: true });
}
