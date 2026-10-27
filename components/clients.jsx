'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC, ICON_SRC, ICON_SRC_BLACK, CLIENT_LOGOS, LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE } from './media'
import { SiteFooter } from './site-chrome'

const CONTACT_EMAIL = 'info@studio-veritas.com'

const CONTACT_PANELS = {
  companies: { heading: 'For companies', body: 'We work directly with brand, marketing, innovation and\ndesign teams on strategic and creative projects.' },
  agencies: { heading: 'For agencies', body: 'We work as a freelance strategy, creative and design team\nwhen you need extra thinking, different perspectives or specialist capability.' },
}


const CLIENTS = [
  { id: 'mondelez', name: 'Mondelez International', logo: CLIENT_LOGOS.mondelez },
  { id: 'philips', name: 'Philips', logo: CLIENT_LOGOS.philips },
  { id: 'puma', name: 'Puma', logo: CLIENT_LOGOS.puma },
  { id: 'jde', name: 'JACOBS DOUWE EGBERTS', logo: CLIENT_LOGOS.jde },
  { id: 'beamsuntory', name: 'Beam Suntory', logo: CLIENT_LOGOS.beamsuntory },
  { id: 'allbirds', name: 'Allbirds', logo: CLIENT_LOGOS.allbirds },
  { id: 'asics', name: 'Asics', logo: CLIENT_LOGOS.asics },
  { id: 'ppg', name: 'PPG Industries', logo: CLIENT_LOGOS.ppg },
  { id: 'cocacola', name: 'Coca-Cola', logo: CLIENT_LOGOS.cocacola },
  { id: 'nike', name: 'Nike', logo: CLIENT_LOGOS.nike },
  { id: 'subway', name: 'Subway', logo: CLIENT_LOGOS.subway },
  { id: 'ahold', name: 'Ahold', logo: CLIENT_LOGOS.ahold },
  { id: 'canyon', name: 'Canyon', logo: CLIENT_LOGOS.canyon },
  { id: 'diageo', name: 'Diageo', logo: CLIENT_LOGOS.diageo },
  { id: 'uber', name: 'Uber', logo: CLIENT_LOGOS.uber },
  { id: 'volvo', name: 'Volvo', logo: CLIENT_LOGOS.volvo },
  { id: 'adidas', name: 'Adidas', logo: CLIENT_LOGOS.adidas },
  { id: 'heineken', name: 'Heineken', logo: CLIENT_LOGOS.heineken },
  { id: 'vfcorp', name: 'VF Corporation', logo: CLIENT_LOGOS.vfcorp },
  { id: 'booking', name: 'Booking.com', logo: CLIENT_LOGOS.booking },
  { id: 'reckitt', name: 'Reckitt', logo: CLIENT_LOGOS.reckitt },
]

export function Clients() {
  const [mounted, setMounted] = useState(false)
  const [contactPanel, setContactPanel] = useState(null)
  const [contactRevealed, setContactRevealed] = useState(0)
  const [footerOpen, setFooterOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!contactPanel) { setContactRevealed(0); return }
    setContactRevealed(0)
    const total = CONTACT_PANELS[contactPanel].body.length
    let current = 0
    const interval = setInterval(() => {
      current += 3
      setContactRevealed(Math.min(current, total))
      if (current >= total) clearInterval(interval)
    }, 12)
    return () => clearInterval(interval)
  }, [contactPanel])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setContactPanel(null); setFooterOpen(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cursorSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 24' fill='none'><path d='M1 1L1 18.5L5.5 14L10 22L13 20.5L8.5 12.5L14.5 12L1 1Z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round'/></svg>"

  return (
    <main
      className="sv-clients-container relative w-full overflow-hidden text-white"
      style={{ background: '#D8FF00', cursor: `url("${cursorSvg}") 4 2, auto` }}
    >
      <style>{`
        .sv-clients-root * { cursor: url("${cursorSvg}") 4 2, auto !important; }
        .sv-clients-container { min-height: 100vh; }
        @supports (min-height: 100dvh) { .sv-clients-container { min-height: 100dvh; } }
        .sv-clients-root button, .sv-clients-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
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
        @media (max-width: 480px) {
          .sv-contact-row { flex-direction: column !important; align-items: flex-end !important; gap: 4px !important; }
        }
        @keyframes sv-drift { 0%,100% { transform: scale(1.0) translate(0,0); } 50% { transform: scale(1.04) translate(-0.6%,-0.4%); } }
        @keyframes sv-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .sv-typewriter-cursor::after { content: '\\2588'; animation: sv-blink 0.8s step-end infinite; margin-left: 2px; }
      `}</style>

      <div className="sv-clients-root relative">
        <section className="sv-sr-only">
          <h1>Studio Veritas — Clients</h1>
          <p>Client logos coming soon.</p>
        </section>

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden" style={{ background: '#D8FF00', zIndex: 0 }}>
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
            <filter id="sv-clients-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#sv-clients-grain)" />
          </svg>
        </div>

        {/* CLIENTS GRID */}
        <div className="relative min-h-screen flex items-start md:items-center justify-center px-4 pt-24 pb-36 md:py-32" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl w-full">
            {CLIENTS.map((client) => (
              <div
                key={client.id}
                className="aspect-[3/2] flex items-center justify-center rounded-sm"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(230,230,230,0.92)' }}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-[50%] max-h-[36%] object-contain"
                  style={{ filter: 'brightness(0)' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM-RIGHT: FOR COMPANIES / FOR AGENCIES + footer trigger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="sv-contact-row fixed sv-safe-bottom sv-safe-right flex flex-row items-center gap-3 md:gap-4"
          style={{ zIndex: 40 }}
        >
          {['companies', 'agencies'].map((key) => {
            const activeContact = contactPanel === key
            return (
              <button
                key={key}
                onClick={() => setContactPanel((v) => (v === key ? null : key))}
                className="text-[11px] md:text-xs font-medium tracking-[0.12em] uppercase hover:opacity-70 transition-opacity whitespace-nowrap p-2 -m-2"
                style={{ color: activeContact ? '#5683DD' : '#000000', fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {key === 'companies' ? 'FOR COMPANIES' : 'FOR AGENCIES'}
              </button>
            )
          })}
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

        {/* CONTACT PANEL */}
        <AnimatePresence>
          {contactPanel && (
            <motion.div
              key={contactPanel}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed bottom-20 right-4 md:bottom-28 md:right-10 w-[calc(100%-2rem)] max-w-[300px] max-h-[55%] rounded-md p-5 md:p-7 overflow-y-auto shadow-2xl"
              style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', zIndex: 50 }}
            >
              <button
                onClick={() => setContactPanel(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                aria-label="Close"
              >
                ✕
              </button>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#5683DD', letterSpacing: '0.2em' }} className="text-[11px] md:text-xs font-medium uppercase mb-3">{CONTACT_PANELS[contactPanel].heading}</p>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="whitespace-pre-line text-[13px] md:text-sm text-white/90 leading-relaxed pr-6">
                {CONTACT_PANELS[contactPanel].body.slice(0, contactRevealed)}
                {contactRevealed < CONTACT_PANELS[contactPanel].body.length && <span className="sv-typewriter-cursor" />}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                className="inline-block mt-6 text-[13px] md:text-sm text-white underline underline-offset-4 decoration-white/40 hover:decoration-white hover:text-[#5683DD] transition-colors"
              >
                Contact Us →
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SLIDE-UP FOOTER */}
        <SiteFooter open={footerOpen} onClose={() => setFooterOpen(false)} />
      </div>
    </main>
  )
}

export default Clients
