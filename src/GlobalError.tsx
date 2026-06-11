'use client'

import { useEffect } from 'react'
import { reportErrorClient } from './error-reporter'

// Next.js root error boundary — vangt React-tree crashes die de root
// layout zouden opblazen. Reëxporteert als default zodat tools 'm direct
// kunnen gebruiken in app/global-error.tsx:
//
//   export { default } from '@rtvnoord/monitoring/GlobalError'
//
// Eigen <html>/<body> omdat de root layout zelf kapot kan zijn.

export function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    reportErrorClient(error, {
      message: error.message,
      stack:   error.stack || null,
      context: { source: 'global-error', digest: error.digest },
    })
  }, [error])

  return (
    <html lang="nl">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin:     0,
          minHeight:  '100vh',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
          color:      '#111827',
          padding:    '2rem',
        }}
      >
        <div
          style={{
            maxWidth:     560,
            background:   '#fff',
            border:       '1px solid #e5e7eb',
            borderRadius: 12,
            padding:      '2rem',
            textAlign:    'center',
            boxShadow:    '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h1 style={{ fontSize: 22, marginTop: 0 }}>Er ging iets mis</h1>
          <p style={{ color: '#4b5563' }}>
            De fout is automatisch gemeld bij het beheer. Probeer het opnieuw.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop:    16,
              padding:      '8px 18px',
              borderRadius: 999,
              border:       '2px solid #134395',
              background:   '#134395',
              color:        '#fff',
              fontWeight:   600,
              cursor:       'pointer',
            }}
          >
            Probeer opnieuw
          </button>
        </div>
      </body>
    </html>
  )
}

export default GlobalError
