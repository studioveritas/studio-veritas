'use client'

// The line under the Client space tag: what this page is, and Log out.

import { logout } from '@/app/clients/actions'

const MONO = "'IBM Plex Mono', monospace"

export function ClientBar({ privateCount = 0 }) {
  return (
    <div className="sv-client-bar">
      <style>{`
        .sv-client-bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin: 4px 0 22px; font-family: ${MONO}; color: rgba(255,255,255,0.75); font-size: 13px; line-height: 1.4; }
        .sv-client-bar button { font: 500 12px/1 ${MONO}; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; background: none; border: 1px solid rgba(255,255,255,0.45); border-radius: 4px; padding: 8px 12px 7px; transition: color .2s, border-color .2s; }
        .sv-client-bar button:hover, .sv-client-bar button:focus-visible { color: #5683DD; border-color: #5683DD; outline: none; }
        @media (min-width: 768px) { .sv-client-bar { font-size: 15px; margin: 8px 0 30px; } .sv-client-bar button { font-size: 13px; } }
      `}</style>
      <p>
        The full suite of case studies
        {privateCount > 0 ? `, including ${privateCount} only for clients.` : '.'}
      </p>
      <form action={logout}>
        <button type="submit">Log out</button>
      </form>
    </div>
  )
}
