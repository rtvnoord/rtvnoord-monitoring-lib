'use client';
import { useEffect } from 'react';
import { reportErrorClient } from './error-reporter';
// Installeert window-handlers voor uncaught client-side errors. Mount één
// keer in app/layout.tsx (direct na <body>). Geen visuele output.
//
// Vangt: window.onerror (klassieke JS errors) + unhandledrejection
// (uncaught Promise rejections). React-errors gaan via GlobalError.
export function ErrorReporterClient() {
    useEffect(() => {
        function onError(event) {
            reportErrorClient(event.error || event.message, {
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
            reportErrorClient(reason, {
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
export default ErrorReporterClient;
