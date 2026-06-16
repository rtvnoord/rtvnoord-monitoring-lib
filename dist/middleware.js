"use strict";
// Middleware-helpers voor de tool-status integratie + maintenance-mode.
// Tools roepen `withMonitoring(req, res)` aan vanuit hun eigen middleware,
// na hun eigen auth-check. Levert security headers, doet de tool-status
// ping (gecached), en redirect naar /maintenance als admin dat aanzet.
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringMatcher = void 0;
exports.withMonitoring = withMonitoring;
const server_1 = require("next/server");
const MAINTENANCE_TTL_MS = 15_000;
let maintenanceCache = null;
function applySecurityHeaders(res) {
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    return res;
}
function shouldSkipPing(pathname, extra) {
    const skip = [
        '/api/',
        '/_next/',
        '/logos/',
        '/maintenance',
        ...extra,
    ];
    return skip.some((p) => pathname.startsWith(p));
}
/**
 * Voert de tool-status ping uit + redirect naar /maintenance indien aan.
 * Bestaand `res` wordt aangevuld met security headers. Bij maintenance
 * wordt een NextResponse.redirect teruggegeven.
 *
 * Verwacht in env:
 *   TOOL_SLUG, BEHEER_API_URL (optioneel), BEHEER_API_SECRET
 */
async function withMonitoring(req, res = server_1.NextResponse.next(), options = {}) {
    const { pathname } = req.nextUrl;
    if (!options.skipSecurityHeaders)
        applySecurityHeaders(res);
    const toolSlug = process.env.TOOL_SLUG || '';
    const secret = process.env.BEHEER_API_SECRET || '';
    const beheerUrl = (options.beheerUrl || process.env.BEHEER_API_URL || 'https://toolbox.rtvnoord.nl').replace(/\/+$/, '');
    if (!toolSlug || !secret)
        return res;
    if (shouldSkipPing(pathname, options.skipPathPrefixes || []))
        return res;
    // Cache-check: recent maintenance-status nog goed? Pageviews gaan door
    // (geen cache op het posten zelf).
    const now = Date.now();
    const cached = maintenanceCache && (now - maintenanceCache.at) < MAINTENANCE_TTL_MS
        ? maintenanceCache
        : null;
    if (cached?.maintenance) {
        const url = req.nextUrl.clone();
        url.pathname = '/maintenance';
        url.searchParams.set('message', cached.message);
        return server_1.NextResponse.redirect(url);
    }
    try {
        const r = await fetch(`${beheerUrl}/api/tool-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-beheer-secret': secret,
            },
            body: JSON.stringify({
                slug: toolSlug,
                path: pathname,
                referrer: req.headers.get('referer') ?? '',
                ua: req.headers.get('user-agent') ?? '',
            }),
            signal: AbortSignal.timeout(1500),
        });
        if (r.ok) {
            const data = await r.json();
            maintenanceCache = {
                at: now,
                maintenance: Boolean(data.maintenance),
                message: data.maintenanceMessage ?? '',
            };
            if (data.maintenance) {
                const url = req.nextUrl.clone();
                url.pathname = '/maintenance';
                url.searchParams.set('message', data.maintenanceMessage ?? '');
                return server_1.NextResponse.redirect(url);
            }
        }
    }
    catch {
        // toolbox.rtvnoord.nl niet bereikbaar — tool blijft werken
    }
    return res;
}
/** Standaard matcher die alle paths matcht behalve statische assets. */
exports.monitoringMatcher = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|logos/).*)'],
};
