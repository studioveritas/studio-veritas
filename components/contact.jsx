'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC, LOGO_SRC_BLACK, ICON_SRC, ICON_SRC_BLACK, PROCESS_ICON_SRC, LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE } from './media'
import { SiteFooter, PageTag } from './site-chrome'

const CONTACT_EMAIL = 'info@studio-veritas.com'
const LINKEDIN_URL = 'https://www.linkedin.com/company/team-studio-veritas'

const CONTACT_PANELS = {
  companies: { heading: 'For companies', body: 'We work directly with brand, marketing, innovation and\ndesign teams on strategic and creative projects.' },
  agencies: { heading: 'For agencies', body: 'We work as a freelance strategy, creative and design team\nwhen you need extra thinking, different perspectives or specialist capability.' },
}



export function Contact() {
  const [mounted, setMounted] = useState(false)
  const [contactPanel, setContactPanel] = useState(null)
  const [contactRevealed, setContactRevealed] = useState(0)
  const [footerOpen, setFooterOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  // Both X buttons leave the contact page: back to wherever the visitor came
  // from on this site, or home if they arrived directly (new tab, shared link).
  const closeContact = () => {
    const cameFromSite = typeof document !== 'undefined' && document.referrer && document.referrer.startsWith(window.location.origin)
    if (cameFromSite && window.history.length > 1) window.history.back()
    else window.location.href = '/'
  }

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
      className="sv-contactpage-container relative w-full overflow-hidden text-white"
      style={{ background: '#D8FF00', cursor: `url("${cursorSvg}") 4 2, auto` }}
    >
      <style>{`
        .sv-contactpage-root * { cursor: url("${cursorSvg}") 4 2, auto !important; }
        .sv-contactpage-container { min-height: 100vh; }
        @supports (min-height: 100dvh) { .sv-contactpage-container { min-height: 100dvh; } }
        .sv-contactpage-root button, .sv-contactpage-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
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
        .sv-contact-title { font-size: 26px; }
        @media (min-width: 768px) { .sv-contact-title { font-size: 36px; } }
        .sv-contact-wordmark { height: 36px; }
        @media (min-width: 768px) { .sv-contact-wordmark { height: 58px; } }
        .sv-contact-icon { height: 56px; }
        @media (min-width: 768px) { .sv-contact-icon { height: 82px; } }
        .sv-contact-subline { font-size: 13px; line-height: 1.4; }
        @media (min-width: 768px) { .sv-contact-subline { font-size: 20px; } }
        .sv-contact-details { font-size: 12px; line-height: 1.55; }
        @media (min-width: 768px) { .sv-contact-details { font-size: 18px; line-height: 1.1; } }
        @keyframes sv-drift { 0%,100% { transform: scale(1.0) translate(0,0); } 50% { transform: scale(1.04) translate(-0.6%,-0.4%); } }
        @keyframes sv-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .sv-typewriter-cursor::after { content: '\\2588'; animation: sv-blink 0.8s step-end infinite; margin-left: 2px; }
      `}</style>

      <div className="sv-contactpage-root relative">
        <section className="sv-sr-only">
          <h2>Studio Veritas — Contact</h2>
          <p>Contact Studio Veritas: Guillaume Furminger and Ali Marmaduke. Email info@studio-veritas.com.</p>
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
            <filter id="sv-contactpage-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#sv-contactpage-grain)" />
          </svg>
        </div>

        {/* CONTACT CONTENT */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-24 pb-36 md:py-28" style={{ zIndex: 1 }}>
          {/* CONTACT US tag */}
          <PageTag label="Contact Us" onClose={closeContact} closeLabel="Close contact page" />

          {/* STUDIO VERITAS card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260, delay: 0.25 }}
            className="w-full max-w-[1400px] mt-4 md:mt-5 rounded-md p-5 md:p-7"
            style={{ background: '#eeeeee', border: '1px solid rgba(0,0,0,0.45)' }}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <img
                  src={LOGO_SRC_BLACK}
                  alt="Studio Veritas"
                  className="sv-contact-wordmark"
                  style={{ width: 'auto', maxWidth: '100%', display: 'block' }}
                  draggable={false}
                />
                <p
                  className="sv-contact-subline mt-3 md:mt-4 text-black"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Freelance team. Strategy + Creative + Innovation
                </p>
              </div>
              <img
                src={PROCESS_ICON_SRC}
                alt=""
                aria-hidden="true"
                className="sv-contact-icon hidden sm:block flex-shrink-0"
                style={{ width: 'auto' }}
                draggable={false}
              />
            </div>

            {/* Details module */}
            <div
              className="relative mt-5 md:mt-6 rounded-md px-5 md:px-7 pt-12 pb-8 md:pt-11 md:pb-9"
              style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <button
                onClick={closeContact}
                className="absolute top-2 left-2 md:top-3 md:left-3 text-white/80 hover:text-white transition-colors p-2 text-sm md:text-lg leading-none"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                aria-label="Close contact page"
              >
                X
              </button>
              <address
                className="sv-contact-details not-italic text-right text-white uppercase flex flex-col items-end"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <span>Guillaume Furminger + Ali Marmaduke</span>
                <span>studio-veritas.com</span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#5683DD] transition-colors">{CONTACT_EMAIL}</a>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-[#5683DD] transition-colors">&gt;&gt;LinkedIn</a>
              </address>
            </div>
          </motion.div>
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

export default Contact
