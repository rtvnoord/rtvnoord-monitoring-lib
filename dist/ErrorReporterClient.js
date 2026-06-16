"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorReporterClient = ErrorReporterClient;
const react_1 = require("react");
const error_reporter_1 = require("./error-reporter");
// Installeert window-handlers voor uncaught client-side errors. Mount één
// keer in app/layout.tsx (direct na <body>). Geen visuele output.
//
// Vangt: window.onerror (klassieke JS errors) + unhandledrejection
// (uncaught Promise rejections). React-errors gaan via GlobalError.
function ErrorReporterClient() {
    (0, react_1.useEffect)(() => {
        function onError(event) {
            (0, error_reporter_1.reportErrorClient)(event.error || event.message, {
                message: event.message || (event.error instanceof Error ? event.error.message : 'Unknown error'),
                url: event.filename || window.location.href,
                context: {
                    source: 'window.onerror',
                    lineno: event.lineno,
                    colno: event.colno,
                },
            });
        }
        function onRejection(event) {
            const reason = event.reason;
            (0, error_reporter_1.reportErrorClient)(reason, {
                message: reason instanceof Error ? reason.message : String(reason),
                stack: reason instanceof Error ? reason.stack || null : null,
                url: window.location.href,
                context: { source: 'unhandledrejection' },
            });
        }
        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onRejection);
        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, []);
    return null;
}
exports.default = ErrorReporterClient;
