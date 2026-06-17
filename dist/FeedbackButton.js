"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackButton = FeedbackButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// Floating feedback-knop voor elke RTV Noord-tool. Drop in app/layout.tsx:
//
//   import { FeedbackButton } from '@rtvnoord/monitoring/FeedbackButton'
//   ...
//   <body>
//     <FeedbackButton />
//     {children}
//   </body>
//
// POST't naar BEHEER_API_URL/api/feedback (default toolbox.rtvnoord.nl).
// toolSlug wordt admin-side afgeleid uit pageUrl-subdomein.
//
// Self-contained styling (inline) — geen CSS van consumer-tool nodig.
const FEEDBACK_TYPES = [
    { value: 'suggestion', label: 'Suggestie' },
    { value: 'bug', label: 'Bug' },
    { value: 'question', label: 'Vraag' },
    { value: 'other', label: 'Anders' },
];
function inferBeheerUrl(override) {
    if (override)
        return override.replace(/\/+$/, '');
    const fromEnv = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BEHEER_API_URL) ||
        '';
    return (fromEnv || 'https://toolbox.rtvnoord.nl').replace(/\/+$/, '');
}
const POSITION_STYLES = {
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'top-left': { top: 20, left: 20 },
};
function FeedbackButton({ beheerUrl, position = 'bottom-right', hidden = false, userEmail = '', userName = '', } = {}) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [type, setType] = (0, react_1.useState)('suggestion');
    const [message, setMessage] = (0, react_1.useState)('');
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [statusMsg, setStatusMsg] = (0, react_1.useState)('');
    const [statusTone, setStatusTone] = (0, react_1.useState)('info');
    // ESC sluit modal
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return undefined;
        const onKey = (e) => { if (e.key === 'Escape')
            setIsOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen]);
    function close() {
        if (submitting)
            return;
        setIsOpen(false);
        setStatusMsg('');
    }
    async function submit(event) {
        event.preventDefault();
        if (submitting)
            return;
        setSubmitting(true);
        setStatusMsg('');
        try {
            const res = await fetch(`${inferBeheerUrl(beheerUrl)}/api/feedback`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    type,
                    message: message.trim(),
                    email: userEmail,
                    name: userName,
                    userAgent: navigator.userAgent,
                    pageUrl: window.location.href,
                }),
            });
            const payload = await res.json().catch(() => ({}));
            if (!res.ok || !payload?.success) {
                throw new Error(payload?.error || `Versturen mislukt (${res.status}).`);
            }
            setStatusMsg('Bedankt! Feedback ontvangen.');
            setStatusTone('success');
            setMessage('');
            setType('suggestion');
            setTimeout(() => { setIsOpen(false); setStatusMsg(''); }, 1400);
        }
        catch (err) {
            setStatusMsg(err.message);
            setStatusTone('error');
        }
        finally {
            setSubmitting(false);
        }
    }
    if (hidden)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsOpen(true), title: "Feedback geven", "aria-label": "Feedback geven", style: {
                    position: 'fixed',
                    ...POSITION_STYLES[position],
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: '#EE7203',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9998,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                }, onMouseEnter: (e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
                }, onMouseLeave: (e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                }, children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }) }) }), isOpen ? ((0, jsx_runtime_1.jsx)("div", { onClick: close, role: "presentation", style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                }, children: (0, jsx_runtime_1.jsxs)("div", { onClick: (e) => e.stopPropagation(), role: "dialog", "aria-modal": "true", "aria-labelledby": "rn-feedback-title", style: {
                        background: '#fff',
                        color: '#111827',
                        borderRadius: 12,
                        padding: '1.5rem',
                        maxWidth: 480,
                        width: '100%',
                        fontFamily: 'inherit',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                    }, children: [(0, jsx_runtime_1.jsxs)("header", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }, children: [(0, jsx_runtime_1.jsx)("h2", { id: "rn-feedback-title", style: { margin: 0, fontSize: 20, fontWeight: 700 }, children: "Feedback" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: close, "aria-label": "Sluit", disabled: submitting, style: {
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: 24,
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        color: '#6b7280',
                                        lineHeight: 1,
                                        padding: 4,
                                    }, children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: submit, children: [(0, jsx_runtime_1.jsxs)("label", { style: { display: 'block', marginBottom: 12 }, children: [(0, jsx_runtime_1.jsx)("span", { style: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }, children: "Type" }), (0, jsx_runtime_1.jsx)("select", { value: type, onChange: (e) => setType(e.target.value), disabled: submitting, style: {
                                                width: '100%',
                                                padding: '8px 10px',
                                                borderRadius: 8,
                                                border: '1px solid #d1d5db',
                                                fontSize: 14,
                                                fontFamily: 'inherit',
                                                background: '#fff',
                                            }, children: FEEDBACK_TYPES.map((opt) => ((0, jsx_runtime_1.jsx)("option", { value: opt.value, children: opt.label }, opt.value))) })] }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'block', marginBottom: 12 }, children: [(0, jsx_runtime_1.jsx)("span", { style: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }, children: "Bericht" }), (0, jsx_runtime_1.jsx)("textarea", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Wat zou je willen verbeteren of melden?", required: true, minLength: 3, maxLength: 4000, rows: 5, disabled: submitting, style: {
                                                width: '100%',
                                                padding: '8px 10px',
                                                borderRadius: 8,
                                                border: '1px solid #d1d5db',
                                                fontSize: 14,
                                                fontFamily: 'inherit',
                                                resize: 'vertical',
                                            } })] }), statusMsg ? ((0, jsx_runtime_1.jsx)("div", { style: {
                                        padding: '8px 12px',
                                        borderRadius: 8,
                                        fontSize: 13,
                                        marginBottom: 12,
                                        background: statusTone === 'success' ? 'rgba(26, 158, 57, 0.1)'
                                            : statusTone === 'error' ? 'rgba(228, 39, 41, 0.1)'
                                                : '#f3f4f6',
                                        color: statusTone === 'success' ? '#0f6a26'
                                            : statusTone === 'error' ? '#b30c0c'
                                                : '#374151',
                                        border: `1px solid ${statusTone === 'success' ? 'rgba(26, 158, 57, 0.4)'
                                            : statusTone === 'error' ? 'rgba(228, 39, 41, 0.4)'
                                                : '#e5e7eb'}`,
                                    }, children: statusMsg })) : null, (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: 8 }, children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: close, disabled: submitting, style: {
                                                padding: '8px 16px',
                                                borderRadius: 999,
                                                border: '1.5px solid #d1d5db',
                                                background: 'transparent',
                                                fontSize: 13,
                                                fontWeight: 600,
                                                cursor: submitting ? 'not-allowed' : 'pointer',
                                                color: '#374151',
                                            }, children: "Annuleren" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: submitting || message.trim().length < 3, style: {
                                                padding: '8px 18px',
                                                borderRadius: 999,
                                                border: '1.5px solid #EE7203',
                                                background: '#EE7203',
                                                color: '#fff',
                                                fontSize: 13,
                                                fontWeight: 700,
                                                cursor: (submitting || message.trim().length < 3) ? 'not-allowed' : 'pointer',
                                                opacity: (submitting || message.trim().length < 3) ? 0.6 : 1,
                                            }, children: submitting ? 'Versturen…' : 'Versturen' })] })] })] }) })) : null] }));
}
exports.default = FeedbackButton;
