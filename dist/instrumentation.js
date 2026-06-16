"use strict";
// Instrumentation-helper voor Next.js 15+ onRequestError-hook.
// Gebruik in elke tool:
//
//   // instrumentation.ts (project root)
//   export { register, onRequestError } from '@rtvnoord/monitoring/instrumentation'
//
// In Next.js 14 fire't onRequestError niet — gebruik daar withErrorReporter
// uit @rtvnoord/monitoring rond je route handlers in plaats hiervan.
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.onRequestError = onRequestError;
const error_reporter_1 = require("./error-reporter");
async function register() {
    // Geen init-werk — error-reporter is stateless.
}
async function onRequestError(error, request, context) {
    await (0, error_reporter_1.reportErrorServer)(error, {
        url: request.path,
        ua: request.headers['user-agent'] || '',
        context: {
            method: request.method,
            routerKind: context.routerKind,
            routePath: context.routePath,
            routeType: context.routeType,
        },
    });
}
