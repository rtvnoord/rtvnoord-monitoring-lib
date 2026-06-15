import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export interface MonitoringOptions {
    /** Override BEHEER_API_URL — default reads from env, falls back to toolbox.rtvnoord.nl */
    beheerUrl?: string;
    /** Skip security headers (rare — tool wil bv. iframe-embedding toestaan) */
    skipSecurityHeaders?: boolean;
    /** Extra path-prefixes die niet gepingd worden (default: api/, _next/, logos/, maintenance) */
    skipPathPrefixes?: string[];
}
/**
 * Voert de tool-status ping uit + redirect naar /maintenance indien aan.
 * Bestaand `res` wordt aangevuld met security headers. Bij maintenance
 * wordt een NextResponse.redirect teruggegeven.
 *
 * Verwacht in env:
 *   TOOL_SLUG, BEHEER_API_URL (optioneel), BEHEER_API_SECRET
 */
export declare function withMonitoring(req: NextRequest, res?: NextResponse, options?: MonitoringOptions): Promise<NextResponse>;
/** Standaard matcher die alle paths matcht behalve statische assets. */
export declare const monitoringMatcher: {
    readonly matcher: readonly ["/((?!_next/static|_next/image|favicon.ico|logos/).*)"];
};
