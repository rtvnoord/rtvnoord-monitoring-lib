"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalError = GlobalError;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const error_reporter_1 = require("./error-reporter");
// Next.js root error boundary — vangt React-tree crashes die de root
// layout zouden opblazen. Reëxporteert als default zodat tools 'm direct
// kunnen gebruiken in app/global-error.tsx:
//
//   export { default } from '@rtvnoord/monitoring/GlobalError'
//
// Eigen <html>/<body> omdat de root layout zelf kapot kan zijn.
function GlobalError({ error, reset, }) {
    (0, react_1.useEffect)(() => {
        (0, error_reporter_1.reportErrorClient)(error, {
            message: error.message,
            stack: error.stack || null,
            context: { source: 'global-error', digest: error.digest },
        });
    }, [error]);
    return ((0, jsx_runtime_1.jsx)("html", { lang: "nl", children: (0, jsx_runtime_1.jsx)("body", { style: {
                fontFamily: 'system-ui, -apple-system, sans-serif',
                margin: 0,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                color: '#111827',
                padding: '2rem',
            }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                    maxWidth: 560,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { fontSize: 22, marginTop: 0 }, children: "Er ging iets mis" }), (0, jsx_runtime_1.jsx)("p", { style: { color: '#4b5563' }, children: "De fout is automatisch gemeld bij het beheer. Probeer het opnieuw." }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: reset, style: {
                            marginTop: 16,
                            padding: '8px 18px',
                            borderRadius: 999,
                            border: '2px solid #134395',
                            background: '#134395',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }, children: "Probeer opnieuw" })] }) }) }));
}
exports.default = GlobalError;
