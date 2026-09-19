'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC, ICON_SRC, ICON_SRC_BLACK, LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE, TEAM_PHOTO_GUILLAUME, TEAM_PHOTO_ALI } from './media'

const CONTACT_EMAIL = 'gfurminger@gmail.com'

const CONTACT_PANELS = {
  companies: { heading: 'For companies', body: 'We work directly with brand, marketing, innovation and\ndesign teams on strategic and creative projects.' },
  agencies: { heading: 'For agencies', body: 'We work as a freelance strategy, creative and design team\nwhen you need extra thinking, different perspectives or specialist capability.' },
}

const MENU_ITEMS = [
  { label: 'Team', href: '/team' },
  { label: 'Principles', href: '/process' },
  { label: 'Experience', href: '/clients' },
]

const TEAM = [
  {
    id: 'guillaume',
    name: 'Guillaume Furminger',
    photo: TEAM_PHOTO_GUILLAUME,
    bio: "Born in the the UK, I'm a Amsterdam-based Senior Creative Director and Global Brand Lead, bringing over 20 years of expertise to brand transformation and creative innovation.\n\nWith deep experience across sports, lifestyle, technology, and mobility, I shape global campaigns for iconic brands including ASICS, Uber, adidas, and Volvo.\n\nA collaborative brand and commercial thinker, I'll bridge overarching brand strategy with hands-on execution to deliver impactful, purpose-led storytelling.",
    linkedin: 'https://www.linkedin.com/in/gfurminger/',
    contactEmail: 'gfurminger@gmail.com',
  },
  {
    id: 'ali',
    name: 'Ali Marmaduke',
    photo: TEAM_PHOTO_ALI,
    bio: "Born and raised in Portland, Oregon, I'm interested in how things really work, especially when they don't.\n\nI started in journalism and international development, then spent 13 years at global design, advertising and PR agencies, solving problems that rarely stayed neatly inside the brief. I dig into systems, clarify the complex, and look for what others have missed. I believe the best work starts with asking questions most people would rather avoid.\n\nStudio Veritas is my way of working with people who want to get to the heart of problems and finding real solutions, in whatever form.",
    linkedin: 'https://www.linkedin.com/in/alimarmaduke/',
    contactEmail: 'amarmaduke@gmail.com',
  },
]

export function Team() {
  const [mounted, setMounted] = useState(false)
  const [contactPanel, setContactPanel] = useState(null)
  const [contactRevealed, setContactRevealed] = useState(0)
  const [footerOpen, setFooterOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoverHamburger, setHoverHamburger] = useState(false)
  const [openIds, setOpenIds] = useState({})
  const [revealedMap, setRevealedMap] = useState({})
  const timersRef = useRef({})

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

  const toggleMember = (id) => {
    const isOpen = !!openIds[id]
    clearInterval(timersRef.current[id])
    if (isOpen) {
      setOpenIds((prev) => ({ ...prev, [id]: false }))
      return
    }
    const member = TEAM.find((m) => m.id === id)
    const total = member ? member.bio.length : 0
    setRevealedMap((prev) => ({ ...prev, [id]: 0 }))
    let current = 0
    timersRef.current[id] = setInterval(() => {
      current += 3
      setRevealedMap((prev) => ({ ...prev, [id]: Math.min(current, total) }))
      if (current >= total) clearInterval(timersRef.current[id])
    }, 12)
    setOpenIds((prev) => ({ ...prev, [id]: true }))
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setOpenIds({}); setContactPanel(null); setFooterOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cursorSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 24' fill='none'><path d='M1 1L1 18.5L5.5 14L10 22L13 20.5L8.5 12.5L14.5 12L1 1Z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round'/></svg>"

  return (
    <main
      className="sv-team-container relative w-full overflow-hidden text-white"
      style={{ background: '#0f0f3d', cursor: `url("${cursorSvg}") 4 2, auto` }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Studio Veritas — Team',
            itemListElement: TEAM.map((m, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: { '@type': 'Person', name: m.name, worksFor: 'Studio Veritas' },
            })),
          }),
        }}
      />
      <style>{`
        .sv-team-root * { cursor: url("${cursorSvg}") 4 2, auto !important; }
        .sv-team-container { min-height: 100vh; }
        @supports (min-height: 100dvh) { .sv-team-container { min-height: 100dvh; } }
        .sv-team-root button, .sv-team-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
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

      <div className="sv-team-root relative">
        {/* SEO / LLM-readable content */}
        <section className="sv-sr-only">
          <h1>Studio Veritas — Team</h1>
          {TEAM.map((m) => (
            <p key={m.id}>{m.name}: {m.bio.replace(/\n/g, ' ')}</p>
          ))}
        </section>

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden" style={{ background: '#0f0f3d', zIndex: 0 }}>
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
            <filter id="sv-team-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#sv-team-grain)" />
          </svg>
        </div>

        {/* TOP-LEFT ICON */}
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="fixed sv-safe-top sv-safe-left hover:opacity-70 transition-opacity p-2 -m-2 touch-manipulation"
          style={{ zIndex: 40 }}
          aria-label="Studio Veritas — home"
        >
          <img src={ICON_SRC_BLACK} alt="Studio Veritas" className="sv-topleft-icon" style={{ width: 'auto', display: 'block' }} draggable={false} />
        </motion.a>

        {/* TOP-RIGHT: HAMBURGER MENU */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => setMenuOpen((v) => !v)}
          onMouseEnter={() => setHoverHamburger(true)}
          onMouseLeave={() => setHoverHamburger(false)}
          className="fixed sv-safe-top sv-safe-right flex flex-col items-end justify-center gap-[5px] p-2 -m-2 touch-manipulation"
          style={{ zIndex: 40 }}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: hoverHamburger ? '#5683DD' : '#000000', transition: 'background-color .2s' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: hoverHamburger ? '#5683DD' : '#000000', transition: 'background-color .2s' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: hoverHamburger ? '#5683DD' : '#000000', transition: 'background-color .2s' }} />
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed sv-safe-top-menu sv-safe-right w-[calc(100%-2rem)] max-w-[300px] rounded-md p-5 md:p-7 shadow-2xl"
              style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', zIndex: 50 }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
                aria-label="Close menu"
              >
                ✕
              </button>
              <nav className="flex flex-col" style={{ fontFamily: "'IBM Plex Mono', monospace" }} aria-label="Site menu">
                {MENU_ITEMS.map((item, i) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm md:text-base uppercase tracking-[0.15em] py-3 transition-colors"
                    style={{
                      borderBottom: i < MENU_ITEMS.length - 1 ? '1px dashed rgba(255,255,255,0.3)' : 'none',
                      color: 'rgba(255,255,255,0.95)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#5683DD' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.95)' }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TEAM GRID — photos side by side on desktop, stacked on mobile.
            Each photo's pop-out box appears directly beneath it, wider than
            the photo itself, in the same rounded/bordered/shadowed style
            with spring entrance + typewriter reveal used everywhere else
            on the site (info popup, contact panel, process step pop-outs). */}
        <div className="relative min-h-screen flex items-start md:items-center justify-center px-4 pt-24 pb-36 md:py-32" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 max-w-[900px] w-full">
            {TEAM.map((member) => {
              const open = !!openIds[member.id]
              return (
                <div key={member.id} className="flex flex-col items-center">
                  <button
                    onClick={() => toggleMember(member.id)}
                    className="relative w-full max-w-[320px] aspect-[439/464] overflow-hidden rounded-sm"
                    aria-expanded={open}
                    aria-label={`${member.name}: view bio`}
                  >
                    <img src={member.photo} alt={member.name} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                        className="w-full max-w-[400px] mt-4"
                      >
                        <div
                          className="relative p-5 md:p-7 rounded-md shadow-2xl"
                          style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <button
                            onClick={() => toggleMember(member.id)}
                            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            aria-label="Close"
                          >
                            ✕
                          </button>
                          <p
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            className="text-sm md:text-base font-medium mb-4 pr-8"
                          >
                            {member.name}
                          </p>
                          <p
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            className="whitespace-pre-line text-[13px] md:text-sm text-white/90 leading-relaxed"
                          >
                            {member.bio.slice(0, revealedMap[member.id] || 0)}
                            {(revealedMap[member.id] || 0) < member.bio.length && <span className="sv-typewriter-cursor" />}
                          </p>
                          <div className="flex gap-6 mt-6" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                            <a href={member.linkedin} className="text-[13px] md:text-sm hover:text-[#5683DD] transition-colors" target="_blank" rel="noreferrer">
                              &gt;&gt;LINKEDIN
                            </a>
                            <a href={`mailto:${member.contactEmail}`} className="text-[13px] md:text-sm hover:text-[#5683DD] transition-colors">
                              &gt;&gt;CONTACT
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* SLIDE-UP FOOTER */}
        <motion.div
          initial={false}
          animate={{ y: footerOpen ? '0%' : '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 220 }}
          className="fixed inset-x-0 bottom-0 flex flex-col justify-between px-6 md:px-10 pt-10 pb-6 md:pb-8"
          style={{ height: '52vh', minHeight: 420, background: '#e3e3e3', zIndex: 60 }}
          aria-hidden={!footerOpen}
        >
          <button
            onClick={() => setFooterOpen(false)}
            className="absolute sv-safe-top right-4 md:right-8 p-2 -m-2 touch-manipulation hover:opacity-70 transition-opacity"
            aria-label="Close footer"
          >
            <svg width="18" height="11" viewBox="0 0 18 11" fill="none" aria-hidden="true">
              <polygon points="0,0 18,0 9,11" fill="#000" />
            </svg>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mt-6">
            <div>
              <img
                src={LOGO_SRC}
                alt="Studio Veritas"
                style={{ height: 'clamp(40px, 8vw, 90px)', width: 'auto', display: 'block', filter: 'brightness(0)' }}
                draggable={false}
              />
              <p
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                className="mt-3 text-[11px] md:text-sm font-medium tracking-wide uppercase text-black"
              >
                Freelance team for strategy + design + innovation
              </p>
            </div>
            <img
              src={ICON_SRC}
              alt=""
              aria-hidden="true"
              style={{ height: 'clamp(70px, 14vw, 150px)', width: 'auto', filter: 'brightness(0)' }}
              className="hidden sm:block"
              draggable={false}
            />
          </div>

          <div className="relative mt-6 p-5 md:p-7" style={{ background: '#000' }}>
            <button
              onClick={() => setFooterOpen(false)}
              className="absolute top-3 left-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="text-right text-white" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <p className="text-[11px] md:text-sm">GUILLAUME FURMINGER + ALI MARMADUKE</p>
              <p className="text-[11px] md:text-sm mt-1">STUDIO-VERITAS.COM</p>
              <div className="flex justify-end gap-5 mt-3">
                <a href="https://www.linkedin.com/company/team-studio-veritas" target="_blank" rel="noreferrer" className="text-[11px] md:text-sm hover:text-[#5683DD] transition-colors">&gt;&gt;LINKEDIN</a>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[11px] md:text-sm hover:text-[#5683DD] transition-colors">&gt;&gt;EMAIL</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default Team
