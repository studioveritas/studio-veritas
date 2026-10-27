'use client'

// Shared page frame for the Work and case study pages: background, grain,
// footer triangle and slide-up footer. The nav bar and the bottom-left eye are
// global (components/site-chrome.jsx).
// Unlike the older full-screen pages, the background here is fixed, because these
// pages scroll.
//
// Layers: content 1 · bottom/top controls 40 · menu & pop-outs 50 · footer 60 · grain 100.
// Ask Veritas (mounted in app/layout.tsx) sits at 45/55 alongside these.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC, ICON_SRC, ICON_SRC_BLACK, LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE } from './media'
import { SiteFooter } from './site-chrome'

export const CONTACT_EMAIL = 'info@studio-veritas.com'


export const cursorSvg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 24' fill='none'><path d='M1 1L1 18.5L5.5 14L10 22L13 20.5L8.5 12.5L14.5 12L1 1Z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round'/></svg>"

export function SiteShell({ pageKey, srOnly, children, onEscape }) {
  const [mounted, setMounted] = useState(false)
  const [footerOpen, setFooterOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (footerOpen) { setFooterOpen(false); return }
      // Ask Veritas closes itself on Escape; don't also leave the page.
      if (document.querySelector('.av-panel, [data-sv-modal="open"]')) return
      onEscape?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [footerOpen, onEscape])

  const root = `sv-${pageKey}-root`

  return (
    <main
      className={`sv-${pageKey}-container relative w-full text-white`}
      style={{ background: '#D8FF00', cursor: `url("${cursorSvg}") 4 2, auto` }}
    >
      <style>{`
        .${root} * { cursor: url("${cursorSvg}") 4 2, auto !important; }
        .sv-${pageKey}-container { min-height: 100vh; }
        @supports (min-height: 100dvh) { .sv-${pageKey}-container { min-height: 100dvh; } }
        .${root} button, .${root} a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .sv-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        .sv-safe-top { top: max(16px, env(safe-area-inset-top)); }
        .sv-safe-left { left: max(16px, env(safe-area-inset-left)); }
        .sv-safe-right { right: max(16px, env(safe-area-inset-right)); }
        .sv-safe-bottom { bottom: max(16px, env(safe-area-inset-bottom)); }
        @media (min-width: 768px) {
          .sv-safe-top { top: max(32px, env(safe-area-inset-top)); }
          .sv-safe-left { left: max(40px, env(safe-area-inset-left)); }
          .sv-safe-right { right: max(40px, env(safe-area-inset-right)); }
          .sv-safe-bottom { bottom: max(32px, env(safe-area-inset-bottom)); }
        }
        .sv-topleft-icon { height: 22px; }
        @media (min-width: 768px) { .sv-topleft-icon { height: 28px; } }
        .sv-safe-top-menu { top: max(56px, calc(env(safe-area-inset-top) + 40px)); }
        @media (min-width: 768px) { .sv-safe-top-menu { top: max(76px, calc(env(safe-area-inset-top) + 44px)); } }
        @keyframes sv-drift { 0%,100% { transform: scale(1.0) translate(0,0); } 50% { transform: scale(1.04) translate(-0.6%,-0.4%); } }
      `}</style>

      {srOnly && <section className="sv-sr-only">{srOnly}</section>}

      <div className={`${root} relative`}>
        {/* BACKGROUND (fixed: these pages scroll) */}
        <div className="fixed inset-0 overflow-hidden" style={{ background: '#D8FF00', zIndex: 0 }}>
          <div
            className="absolute inset-0 hidden md:block"
            style={{ backgroundImage: `url(${LANDING_IMG_DESKTOP})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'sv-drift 26s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-0 block md:hidden"
            style={{ backgroundImage: `url(${LANDING_IMG_MOBILE})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'sv-drift 26s ease-in-out infinite' }}
          />
        </div>

        {/* GRAIN */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100, mixBlendMode: 'overlay', opacity: 0.18 }}>
          <svg width="100%" height="100%">
            <filter id={`sv-${pageKey}-grain`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#sv-${pageKey}-grain)`} />
          </svg>
        </div>

        {/* PAGE CONTENT */}
        <div className="relative" style={{ zIndex: 1 }}>{children}</div>

        {/* BOTTOM-RIGHT: footer trigger (the design shows the triangle alone on these pages) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="fixed sv-safe-bottom sv-safe-right flex items-center"
          style={{ zIndex: 40 }}
        >
          <button
            onClick={() => setFooterOpen(true)}
            className="p-2 -m-2 touch-manipulation hover:opacity-70 transition-opacity"
            aria-label="Open footer"
            aria-expanded={footerOpen}
          >
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
              <polygon points="6.5,0 13,11 0,11" fill="#000000" />
            </svg>
          </button>
        </motion.div>

        {/* SLIDE-UP FOOTER */}
        <SiteFooter open={footerOpen} onClose={() => setFooterOpen(false)} />
      </div>
    </main>
  )
}
