'use client'

// Client login: the Contact page's look (cloud background, grain, light card,
// black module), with a password field in the black module.

import { useActionState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { LOGO_SRC_BLACK, PROCESS_ICON_SRC, LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE } from './media'
import { PageTitle } from './site-chrome'
import { cursorSvg } from './site-shell'
import { login } from '@/app/clients/actions'

const MONO = "'IBM Plex Mono', monospace"

export function ClientLogin({ from = '/clients' }) {
  const [state, action, pending] = useActionState(login, null)
  const field = useRef(null)
  useEffect(() => { field.current?.focus() }, [state])

  return (
    <main className="sv-cl relative min-h-screen overflow-hidden">
      <style>{`
        .sv-cl, .sv-cl * { cursor: url("${cursorSvg}") 16 1, auto; }
        .sv-cl button, .sv-cl input { cursor: auto; }
        .sv-cl button { cursor: pointer; }
        @keyframes sv-drift { 0%,100% { transform: scale(1.0) translate(0,0); } 50% { transform: scale(1.04) translate(-0.6%,-0.4%); } }
        .sv-cl-wordmark { height: 40px; }
        .sv-cl-icon { height: 56px; }
        .sv-cl-sub { font-size: 15px; }
        .sv-cl-intro { font-size: 13px; }
        .sv-cl-input { font: 400 18px/1.2 ${MONO}; }
        .sv-cl-btn { font: 500 14px/1 ${MONO}; }
        @media (min-width: 768px) {
          .sv-cl-wordmark { height: 56px; }
          .sv-cl-icon { height: 80px; }
          .sv-cl-sub { font-size: 24px; }
          .sv-cl-intro { font-size: 16px; }
          .sv-cl-input { font-size: 22px; }
          .sv-cl-btn { font-size: 18px; }
        }
        .sv-cl-input { width: 100%; background: transparent; color: #fff; border: 0; border-bottom: 1px solid rgba(255,255,255,0.5); padding: 8px 0; border-radius: 0; letter-spacing: 0.08em; }
        .sv-cl-input:focus { outline: none; border-bottom-color: #5683DD; }
        .sv-cl-btn { background: #fff; color: #000; border: 0; border-radius: 4px; padding: 11px 18px 10px; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; transition: background .2s, color .2s; }
        .sv-cl-btn:hover, .sv-cl-btn:focus-visible { background: #5683DD; color: #fff; outline: none; }
        .sv-cl-btn[disabled] { opacity: .6; }
      `}</style>

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden" style={{ background: 'var(--sv-ground, #D8FF00)', zIndex: 0 }}>
        <div className="absolute inset-0 hidden md:block" style={{ backgroundImage: `url(${LANDING_IMG_DESKTOP})`, filter: 'var(--sv-sky-filter, none)', backgroundSize: 'cover', backgroundPosition: 'center', animation: 'sv-drift 26s ease-in-out infinite' }} />
        <div className="absolute inset-0 block md:hidden" style={{ backgroundImage: `url(${LANDING_IMG_MOBILE})`, filter: 'var(--sv-sky-filter, none)', backgroundSize: 'cover', backgroundPosition: 'center', animation: 'sv-drift 26s ease-in-out infinite' }} />
      </div>

      {/* GRAIN */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100, mixBlendMode: 'overlay', opacity: 0.18 }}>
        <svg width="100%" height="100%">
          <filter id="sv-cl-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#sv-cl-grain)" />
        </svg>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-28 pb-36 md:py-28" style={{ zIndex: 1 }}>
        <PageTitle className="mb-10 md:mb-16">Welcome to the client space</PageTitle>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260, delay: 0.25 }}
          className="w-full max-w-[900px] rounded-md p-5 md:p-7 sv-ink"
          style={{ background: '#eeeeee', border: '1px solid rgba(0,0,0,0.45)' }}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <img src={LOGO_SRC_BLACK} alt="Studio Veritas" className="sv-cl-wordmark" style={{ width: 'auto', maxWidth: '100%', display: 'block' }} draggable={false} />
              <p className="sv-cl-sub mt-3 md:mt-4 text-black" style={{ fontFamily: MONO }}>Access your documents here.</p>
            </div>
            <img src={PROCESS_ICON_SRC} alt="" aria-hidden="true" className="sv-cl-icon hidden sm:block flex-shrink-0" style={{ width: 'auto' }} draggable={false} />
          </div>

          <form action={action} className="mt-5 md:mt-6 rounded-md px-5 md:px-7 pt-7 pb-7 md:pt-9 md:pb-9" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
            <input type="hidden" name="from" value={from} />
            <label htmlFor="sv-cl-password" className="sv-cl-intro block text-white/75 uppercase tracking-wide" style={{ fontFamily: MONO }}>
              Enter the password we shared with you
            </label>
            <div className="mt-4 flex items-end gap-4">
              <input
                ref={field}
                id="sv-cl-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="sv-cl-input"
                aria-invalid={state?.error ? 'true' : undefined}
                aria-describedby={state?.error ? 'sv-cl-error' : undefined}
              />
              <button type="submit" className="sv-cl-btn" disabled={pending}>{pending ? 'Checking…' : 'Enter'}</button>
            </div>
            <p id="sv-cl-error" role="alert" className="sv-cl-intro mt-4 min-h-[1.4em]" style={{ fontFamily: MONO, color: '#5683DD' }}>
              {state?.error || ''}
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
