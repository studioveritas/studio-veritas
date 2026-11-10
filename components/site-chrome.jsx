'use client'

// Site chrome shared by every page. Change it here once.
//
//   <SiteNav />                    mounted once in app/layout.tsx. The white nav bar that follows
//                                  you down the page (Ask Veritas · wordmark · menu), the menu itself,
//                                  and the eye in the bottom-left corner.
//   <SiteFooter open onClose />    the slide-up footer, opened by each page's bottom-right triangle.
//   NAV_TAGS                       the black title tag that sits in the nav bar, left of the menu, on
//                                  Team, Principles and Contact. Add a path here to give a page one.
//   <PageTag label onClose />      the larger black title tag above a page's content (Work, News).
//
// Layers: content 1 · nav, eye, bottom controls 40 · menu & pop-outs 50 · Ask panel 55 · footer 60 · grain 100.

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC_BLACK, ICON_SRC_BLACK, PROCESS_ICON_SRC } from './media'
import { MENU_ITEMS } from './site-nav'
import { toggleAskVeritas, STATE_EVENT } from './ask-veritas/open'
import { SERVICE_AREAS } from './services-data'

export const CONTACT_EMAIL = 'info@studio-veritas.com'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/team-studio-veritas'
export const ABOUT_EVENT = 'sv:about-toggle'
export const CONTACT_OPEN_EVENT = 'sv:contact-open'

// Opens the FOR COMPANIES / FOR AGENCIES panel from anywhere. With a service area id
// (components/services-data.js) the panel shows that area chosen, and the email subject names it.
export function openContactPanel(panel, area = null) {
  window.dispatchEvent(new CustomEvent(CONTACT_OPEN_EVENT, { detail: { panel, area } }))
}

const MONO = "'IBM Plex Mono', monospace"

// Pages whose black title tag lives in the nav bar.
export const NAV_TAGS = { '/team': 'Team', '/principles': 'Principles', '/services': 'Services', '/contact': 'Contact Us', '/clients/login': 'Client login' }

// X on a page tag: back to wherever the visitor came from on this site, or home.
export function leavePage() {
  const cameFromSite = document.referrer && document.referrer.startsWith(window.location.origin)
  if (cameFromSite && window.history.length > 1) window.history.back()
  else window.location.href = '/'
}

/* ------------------------------------------------------------------ nav */

export function SiteNav() {
  const pathname = usePathname() || '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const navTag = NAV_TAGS[pathname.replace(/\/$/, '') || '/']

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const on = (e) => setAskOpen(!!e.detail?.open)
    window.addEventListener(STATE_EVENT, on)
    return () => window.removeEventListener(STATE_EVENT, on)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const onEye = (e) => {
    // On the home page the eye opens the Studio Veritas intro, as the top-left icon used to.
    if (pathname === '/') {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent(ABOUT_EVENT))
    }
  }

  return (
    <>
      <style>{`
        .sv-nav {
          position: fixed; z-index: 40;
          top: var(--sv-nav-top); left: 50%; transform: translateX(-50%);
          width: var(--sv-nav-w); height: var(--sv-nav-h);
          display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center;
          padding: 0 14px; background: #fff; border-radius: 8px;
          box-shadow: 0 6px 24px -14px rgba(0,0,0,0.35);
        }
        @media (min-width: 768px) { .sv-nav { padding: 0 26px; } }
        .sv-nav-ask { justify-self: start; display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 8px; margin-left: -8px; background: none; border: 0; color: #000; font: 500 11px/1 ${MONO}; letter-spacing: 0.2em; text-transform: uppercase; transition: color .2s; }
        .sv-nav-ask svg { display: block; flex: none; transition: transform .35s cubic-bezier(0.22,1,0.36,1); }
        .sv-nav-ask[aria-expanded="true"] svg { transform: rotate(180deg); }
        /* the label only ever shows on desktop hover; on small screens it must not take space, or it pushes the wordmark off centre */
        @media (max-width: 767px) { .sv-nav-ask-label { display: none; } }
        .sv-nav-ask-label { opacity: 0; transform: translateX(-4px); transition: opacity .2s, transform .2s; white-space: nowrap; }
        .sv-nav-ask:hover, .sv-nav-ask:focus-visible, .sv-nav-ask[aria-expanded="true"] { color: #5683DD; outline: none; }
        @media (hover: hover) and (min-width: 768px) {
          .sv-nav-ask:hover .sv-nav-ask-label, .sv-nav-ask:focus-visible .sv-nav-ask-label { opacity: 1; transform: none; }
        }
        .sv-nav-logo { display: block; transition: opacity .2s; }
        .sv-nav-logo:hover, .sv-nav-logo:focus-visible { opacity: .6; outline: none; }
        .sv-nav-logo img { display: block; height: 24px; width: auto; }
        @media (min-width: 768px) { .sv-nav-logo img { height: 34px; } }
        .sv-nav-right { justify-self: end; display: flex; align-items: center; gap: 10px; min-width: 0; position: relative; }
        @media (min-width: 768px) { .sv-nav-right { gap: 22px; } }
        .sv-nav-tag { display: flex; align-items: center; background: #000; color: #fff; border-radius: 4px; white-space: nowrap; box-shadow: 0 6px 18px -10px rgba(0,0,0,.5); }
        /* phones: no room beside the wordmark, so the tag hangs just under the bar's right edge */
        .sv-nav-tag { position: absolute; top: calc(100% + 8px); right: 0; padding: 6px 24px 5px 10px; }
        .sv-nav-tag p { font: 500 15px/1 ${MONO}; letter-spacing: 0.04em; text-transform: uppercase; margin: 0; }
        .sv-nav-tag button { position: absolute; top: 0; right: 0; padding: 3px 6px 9px 9px; background: none; border: 0; color: rgba(255,255,255,.8); font: 400 10px/1 ${MONO}; transition: color .2s; }
        .sv-nav-tag button:hover, .sv-nav-tag button:focus-visible { color: #5683DD; outline: none; }
        @media (min-width: 768px) {
          .sv-nav-tag { position: relative; top: auto; right: auto; box-shadow: none; padding: 5px 22px 4px 10px; }
          .sv-nav-tag p { font-size: 16px; }
        }
        @media (min-width: 1024px) {
          .sv-nav-tag { padding: 6px 26px 5px 12px; }
          .sv-nav-tag p { font-size: 22px; }
          .sv-nav-tag button { font-size: 11px; padding: 3px 7px 10px 10px; }
        }
        .sv-nav-burger { justify-self: end; display: flex; flex-direction: column; justify-content: center; gap: 5px; width: 44px; height: 44px; align-items: flex-end; padding: 0 8px; margin-right: -8px; background: none; border: 0; }
        .sv-nav-burger span { display: block; width: 24px; height: 2px; background: #000; transition: background-color .2s, transform .25s, opacity .2s; }
        @media (min-width: 768px) { .sv-nav-burger span { width: 36px; height: 2.5px; } .sv-nav-burger { gap: 7px; width: 56px; } }
        .sv-nav-burger:hover span, .sv-nav-burger:focus-visible span, .sv-nav-burger[aria-expanded="true"] span { background: #5683DD; }
        .sv-nav-burger:focus-visible { outline: none; }
        .sv-menu {
          position: fixed; z-index: 50;
          top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 10px);
          right: calc(50% - var(--sv-nav-w) / 2);
          width: min(300px, var(--sv-nav-w));
        }
        .sv-eye { position: fixed; z-index: 40; left: max(16px, env(safe-area-inset-left)); bottom: max(16px, env(safe-area-inset-bottom)); display: block; padding: 6px; margin: -6px; transition: opacity .2s; }
        .sv-eye img { display: block; height: 30px; width: auto; }
        .sv-eye:hover, .sv-eye:focus-visible { opacity: .55; outline: none; }
        @media (min-width: 768px) {
          .sv-eye { left: max(40px, env(safe-area-inset-left)); bottom: max(28px, env(safe-area-inset-bottom)); }
          .sv-eye img { height: 46px; }
        }
        /* over a black section (the Work page), the eye and the footer triangle turn white */
        .sv-eye img { transition: filter .25s; }
        html[data-sv-dark-bottom='1'] .sv-eye img { filter: invert(1); }
        .sv-foot-trigger { color: #000; }
        html[data-sv-dark-bottom='1'] .sv-foot-trigger { color: #fff; }
      `}</style>

      <motion.header
        data-sv-intro-step="1"
        className="sv-nav"
        initial={{ opacity: 0, y: -8, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <button
          type="button"
          className="sv-nav-ask"
          aria-haspopup="dialog"
          aria-expanded={askOpen}
          aria-label={askOpen ? 'Close Ask Veritas' : 'Ask Veritas, an AI assistant'}
          onClick={() => { setMenuOpen(false); toggleAskVeritas() }}
        >
          <svg width="24" height="21" viewBox="0 0 22 19" fill="none" aria-hidden="true">
            <polygon points="11,1.6 20.4,17.4 1.6,17.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="sv-nav-ask-label" aria-hidden="true">Ask Veritas</span>
        </button>

        <a href="/" className="sv-nav-logo" aria-label="Studio Veritas, home">
          <img src={LOGO_SRC_BLACK} alt="Studio Veritas" draggable={false} data-sv-intro="logo" />
        </a>

        <div className="sv-nav-right">
        {navTag && (
          <motion.div
            key={navTag}
            className="sv-nav-tag"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300, delay: 0.2 }}
          >
            <p>{navTag}</p>
            <button type="button" onClick={leavePage} aria-label={`Close ${navTag.toLowerCase()} page`}>X</button>
          </motion.div>
        )}
        <button
          type="button"
          className="sv-nav-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            data-sv-modal="open"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="sv-menu rounded-md p-5 md:p-7 shadow-2xl"
            style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', transformOrigin: 'top right' }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav className="flex flex-col" style={{ fontFamily: MONO }} aria-label="Site menu">
              {MENU_ITEMS.map((item, i) => {
                const here = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={here ? 'page' : undefined}
                    className="text-sm md:text-base uppercase tracking-[0.15em] py-3 transition-colors text-white/95 hover:text-[#5683DD]"
                    style={{ borderBottom: i < MENU_ITEMS.length - 1 ? '1px dashed rgba(255,255,255,0.3)' : 'none', color: here ? '#5683DD' : undefined }}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="/"
        onClick={onEye}
        className="sv-eye"
        data-sv-intro-step="2"
        aria-label={pathname === '/' ? 'About Studio Veritas' : 'Studio Veritas, home'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <img src={ICON_SRC_BLACK} alt="" draggable={false} data-sv-intro="icon" />
      </motion.a>

      <ContactBar />
    </>
  )
}

/* --------------------------------------------------------- contact bar */

// FOR COMPANIES / FOR AGENCIES: black buttons, bottom centre, on every page.
// Each opens a black pop-out above it with the typed copy and a Contact Us link.
export const CONTACT_PANELS = {
  companies: {
    heading: 'For companies',
    body: 'We work directly with brand, marketing, innovation and\ndesign teams on strategic and creative projects.',
  },
  agencies: {
    heading: 'For agencies',
    body: 'We work as a freelance strategy, creative and design team\nwhen you need extra thinking, different perspectives or specialist capability.',
  },
}

export function ContactBar() {
  const pathname = usePathname() || '/'
  const [panel, setPanel] = useState(null)
  const [revealed, setRevealed] = useState(0)
  const [area, setArea] = useState(null)

  useEffect(() => { setPanel(null); setArea(null) }, [pathname])

  useEffect(() => {
    const on = (e) => {
      const next = e.detail?.panel
      if (!CONTACT_PANELS[next]) return
      setArea(e.detail?.area || null)
      setPanel(next)
    }
    window.addEventListener(CONTACT_OPEN_EVENT, on)
    return () => window.removeEventListener(CONTACT_OPEN_EVENT, on)
  }, [])

  useEffect(() => {
    if (!panel) { setRevealed(0); return }
    setRevealed(0)
    const total = CONTACT_PANELS[panel].body.length
    let current = 0
    const interval = setInterval(() => {
      current += 3
      setRevealed(Math.min(current, total))
      if (current >= total) clearInterval(interval)
    }, 12)
    return () => clearInterval(interval)
  }, [panel])

  useEffect(() => {
    if (!panel) return
    const onKey = (e) => e.key === 'Escape' && setPanel(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel])

  return (
    <>
      <style>{`
        .sv-cbar { position: fixed; z-index: 41; left: 50%; transform: translateX(-50%); bottom: max(16px, env(safe-area-inset-bottom)); display: flex; gap: 6px; }
        @media (min-width: 768px) { .sv-cbar { bottom: max(28px, env(safe-area-inset-bottom)); gap: 8px; } }
        .sv-cbar-btn { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px 0 8px; background: #000; color: #fff; border: 0; border-radius: 3px;
          font: 500 9px/1 ${MONO}; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; transition: color .2s, background .2s, box-shadow .2s; }
        @media (min-width: 768px) { .sv-cbar-btn { height: 32px; padding: 0 18px 0 13px; gap: 10px; font-size: 13px; } }
        .sv-cbar-btn svg { width: 8px; height: 8px; }
        @media (min-width: 768px) { .sv-cbar-btn svg { width: 10px; height: 10px; } }
        .sv-cbar-btn svg { flex: none; transition: transform .3s cubic-bezier(0.22,1,0.36,1); }
        .sv-cbar-btn:hover, .sv-cbar-btn:focus-visible { color: #5683DD; outline: none; }
        .sv-cbar-btn[aria-expanded="true"] { color: #5683DD; }
        .sv-cbar-btn[aria-expanded="true"] svg { transform: rotate(45deg); }
        html[data-sv-dark-bottom='1'] .sv-cbar-btn { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35); }
        @keyframes sv-cbar-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .sv-cpanel .sv-typewriter-cursor::after { content: '\\2588'; animation: sv-cbar-blink 0.8s step-end infinite; margin-left: 2px; }
        .sv-cpanel-chip { padding: 6px; margin: -6px; background: none; border: 0; color: #fff; font: 500 13px/1 ${MONO}; letter-spacing: .08em; text-transform: uppercase; transition: color .2s; }
        .sv-cpanel-chip:hover, .sv-cpanel-chip:focus-visible, .sv-cpanel-chip[aria-pressed="true"] { color: #5683DD; outline: none; }
        .sv-cpanel { position: fixed; z-index: 50; left: 50%; bottom: calc(max(16px, env(safe-area-inset-bottom)) + 38px); width: min(340px, calc(100% - 2rem)); max-height: 55%; }
        @media (min-width: 768px) { .sv-cpanel { bottom: calc(max(28px, env(safe-area-inset-bottom)) + 46px); } }
      `}</style>

      <div className="sv-cbar" data-sv-intro-step="2">
        {['companies', 'agencies'].map((key) => (
          <button
            key={key}
            type="button"
            className="sv-cbar-btn"
            aria-expanded={panel === key}
            onClick={() => { setArea(null); setPanel((v) => (v === key ? null : key)) }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2" />
            </svg>
            {key === 'companies' ? 'For companies' : 'For agencies'}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel}
            data-sv-modal="open"
            initial={{ opacity: 0, y: 20, scale: 0.98, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 20, scale: 0.98, x: '-50%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="sv-cpanel rounded-md p-5 md:p-7 overflow-y-auto shadow-2xl"
            style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <button
              onClick={() => setPanel(null)}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
              style={{ fontFamily: MONO }}
              aria-label="Close"
            >
              ✕
            </button>
            <p style={{ fontFamily: MONO, color: '#5683DD', letterSpacing: '0.2em' }} className="text-[11px] md:text-xs font-medium uppercase mb-3">{CONTACT_PANELS[panel].heading}</p>
            <p style={{ fontFamily: MONO }} className="whitespace-pre-line text-[13px] md:text-sm text-white/90 leading-relaxed pr-6">
              {CONTACT_PANELS[panel].body.slice(0, revealed)}
              {revealed < CONTACT_PANELS[panel].body.length && <span className="sv-typewriter-cursor" />}
            </p>
            {panel === 'companies' && area && (
              <div role="group" aria-label="Service area" className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 pt-4" style={{ borderTop: '1px dashed rgba(255,255,255,0.3)' }}>
                {SERVICE_AREAS.map((a, i) => (
                  <button key={a.id} type="button" className="sv-cpanel-chip" aria-pressed={area === a.id} onClick={() => setArea(a.id)}>
                    ({i + 1}) {a.title}
                  </button>
                ))}
              </div>
            )}
            <a
              href={`mailto:${CONTACT_EMAIL}${panel === 'companies' && area ? `?subject=${encodeURIComponent(`${SERVICE_AREAS.find((a) => a.id === area)?.title} enquiry`)}` : ''}`}
              style={{ fontFamily: MONO }}
              className="inline-block mt-6 text-[13px] md:text-sm text-white underline underline-offset-4 decoration-white/40 hover:decoration-white hover:text-[#5683DD] transition-colors"
            >
              Contact Us →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* --------------------------------------------------------------- footer */

export function SiteFooter({ open, onClose }) {
  return (
    <>
      <style>{`
        .sv-foot {
          position: fixed; z-index: 60; bottom: 0;
          left: max(12px, env(safe-area-inset-left)); right: max(12px, env(safe-area-inset-right));
          padding: 18px 16px max(16px, env(safe-area-inset-bottom));
          background: #eeeeee; border: 1px solid rgba(0,0,0,0.45); border-bottom: 0;
          border-radius: 6px 6px 0 0; box-shadow: 0 -18px 40px -24px rgba(0,0,0,0.45);
        }
        @media (min-width: 768px) { .sv-foot { left: max(36px, env(safe-area-inset-left)); right: max(36px, env(safe-area-inset-right)); padding: 26px 20px 22px 32px; } }
        .sv-foot-logo { display: block; height: 30px; width: auto; }
        @media (min-width: 768px) { .sv-foot-logo { height: 62px; } }
        .sv-foot-line { font: 400 13px/1.3 ${MONO}; color: #000; margin-top: 8px; }
        @media (min-width: 768px) { .sv-foot-line { font-size: 22px; margin-top: 12px; } }
        .sv-foot-eye { display: none; height: 92px; width: auto; }
        @media (min-width: 768px) { .sv-foot-eye { display: block; } }
        .sv-foot-strip { position: relative; margin-top: 14px; padding: 34px 16px 16px; background: #000; border-radius: 6px; color: #fff; font-family: ${MONO}; display: flex; flex-direction: column; gap: 14px; }
        @media (min-width: 768px) { .sv-foot-strip { margin: 20px 12px 0 -12px; padding: 38px 26px 20px 34px; flex-direction: row; justify-content: space-between; align-items: flex-end; gap: 40px; } }
        .sv-foot-about { font-size: 11.5px; line-height: 1.55; max-width: 640px; margin: 0; color: rgba(255,255,255,0.92); }
        .sv-foot-contact { font-size: 11px; line-height: 1.55; text-align: right; text-transform: uppercase; white-space: nowrap; margin: 0; font-style: normal; display: flex; flex-direction: column; align-items: flex-end; }
        @media (min-width: 768px) { .sv-foot-about { font-size: 14px; } .sv-foot-contact { font-size: 14px; } }
        .sv-foot-contact a { text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(255,255,255,0.5); transition: color .2s; }
        .sv-foot-contact a:hover, .sv-foot-contact a:focus-visible { color: #5683DD; outline: none; }
      `}</style>
      <motion.footer
        className="sv-foot"
        initial={false}
        animate={{ y: open ? '0%' : '102%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 240 }}
        aria-hidden={!open}
        inert={!open}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-5 md:right-5 p-2 touch-manipulation hover:opacity-60 transition-opacity"
          aria-label="Close footer"
        >
          <svg width="20" height="13" viewBox="0 0 18 11" fill="none" aria-hidden="true">
            <polygon points="0,0 18,0 9,11" fill="#000" />
          </svg>
        </button>

        <div className="flex items-start justify-between gap-6 pr-10 md:pr-0">
          <div className="min-w-0">
            <img src={LOGO_SRC_BLACK} alt="Studio Veritas" className="sv-foot-logo" draggable={false} />
            <p className="sv-foot-line">Strategy + Creative + Innovation</p>
          </div>
          <img src={PROCESS_ICON_SRC} alt="" aria-hidden="true" className="sv-foot-eye mt-6 mr-10" draggable={false} />
        </div>

        <div className="sv-foot-strip">
          <button
            onClick={onClose}
            className="absolute top-1.5 left-1.5 md:top-2 md:left-2 text-white/80 hover:text-white transition-colors p-2 text-sm leading-none"
            style={{ fontFamily: MONO }}
            aria-label="Close footer"
          >
            X
          </button>
          <p className="sv-foot-about">
            Studio Veritas is an agile strategy, design and innovation team. We partner to isolate the fundamental truths
            behind a brand. We deliver nimble, sharp decision-making to solve complex challenges and drive lasting
            commercial growth.
          </p>
          <address className="sv-foot-contact">
            <span>Guillaume Furminger + Ali Marmaduke</span>
            <span>studio-veritas.com</span>
            <span className="flex gap-4 mt-0.5">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">&gt;&gt;LinkedIn</a>
              <a href={`mailto:${CONTACT_EMAIL}`}>&gt;&gt;Email</a>
            </span>
          </address>
        </div>
      </motion.footer>
    </>
  )
}

/* ------------------------------------------------------------- page tag */

// tone="light": off-white with black type, for pages on black (WORK).
// tone="ink": black with warm beige type, for News + Insights.
// The plain one-line title that sits above a page's content when its tag is in the nav bar.
// It types out once, in the site's typewriter style. The full line is reserved invisibly underneath,
// so nothing below it shifts while it types; screen readers and crawlers get the whole line at once.
// `secret` (optional): { word, swap, href } — once the line has typed out, `word` becomes a hidden link.
// Rolling over it (or a first tap on touch screens) swaps it for `swap` in bold; clicking goes to `href`.
// Used on the contact page: "work" → PLAY → the Truth Invaders arcade at /play.
export function PageTitle({ children, className = '', delay = 450, speed = 55, secret = null }) {
  const text = String(children)
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setTyped(text.length); return }
    setTyped(0)
    let iv
    const t = setTimeout(() => {
      iv = setInterval(() => setTyped((n) => { if (n + 1 >= text.length) clearInterval(iv); return Math.min(n + 1, text.length) }), speed)
    }, delay)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [text, delay, speed])
  const done = typed >= text.length
  const [armed, setArmed] = useState(false)
  const at = secret ? text.indexOf(secret.word) : -1
  const showSecret = done && at >= 0
  const onSecretClick = (e) => {
    // Touch screens have no rollover: the first tap reveals PLAY, the second one follows the link.
    if (!armed && window.matchMedia?.('(hover: none)').matches) { e.preventDefault(); setArmed(true) }
  }
  return (
    <>
      <style>{`
        .sv-page-title { font-size: 17px; position: relative; width: fit-content; margin-left: auto; margin-right: auto; }
        @media (min-width: 768px) { .sv-page-title { font-size: 26px; } }
        .sv-page-title-typed { position: absolute; inset: 0; white-space: pre; }
        .sv-page-title-caret::after { content: '\\2588'; animation: sv-title-blink 0.8s step-end infinite; margin-left: 2px; }
        @keyframes sv-title-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .sv-secret { display: inline-grid; color: inherit; text-decoration: none; vertical-align: baseline; }
        .sv-secret > span { grid-area: 1 / 1; text-align: center; }
        .sv-secret-swap { visibility: hidden; font-weight: 700; letter-spacing: 0.02em; }
        .sv-secret:hover .sv-secret-word, .sv-secret:focus-visible .sv-secret-word, .sv-secret.is-armed .sv-secret-word { visibility: hidden; }
        .sv-secret:hover .sv-secret-swap, .sv-secret:focus-visible .sv-secret-swap, .sv-secret.is-armed .sv-secret-swap { visibility: visible; }
        .sv-secret:focus-visible { outline: none; }
      `}</style>
      <h1
        aria-label={showSecret ? undefined : text}
        className={`sv-page-title text-black text-center ${className}`}
        style={{ fontFamily: MONO, fontWeight: 400, lineHeight: 1.3 }}
      >
        <span aria-hidden="true" style={{ visibility: 'hidden', whiteSpace: 'pre' }}>{text}</span>
        {showSecret ? (
          <span className="sv-page-title-typed" style={{ textAlign: 'left' }}>
            {text.slice(0, at)}
            <Link
              href={secret.href}
              prefetch={false}
              onClick={onSecretClick}
              onMouseLeave={() => setArmed(false)}
              className={`sv-secret${armed ? ' is-armed' : ''}`}
            >
              <span className="sv-secret-word">{secret.word}</span>
              <span className="sv-secret-swap" aria-hidden="true">{secret.swap}</span>
            </Link>
            {text.slice(at + secret.word.length)}
          </span>
        ) : (
          <span aria-hidden="true" className="sv-page-title-typed" style={{ textAlign: 'left' }}>
            {text.slice(0, typed)}
            {!done && <span className="sv-page-title-caret" />}
          </span>
        )}
      </h1>
    </>
  )
}

export function PageTag({ label, onClose = leavePage, closeLabel, className = '', tone = 'dark', align = 'center' }) {
  const light = tone === 'light'
  const ink = tone === 'ink'
  return (
    <>
      <style>{`
        .sv-tag { min-width: 200px; }
        .sv-tag-title { font-size: 26px; }
        @media (min-width: 768px) { .sv-tag { min-width: 270px; } .sv-tag-title { font-size: 36px; } }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300, delay: 0.1 }}
        className={`sv-tag relative rounded-md shadow-2xl px-10 py-5 ${align === 'left' ? 'text-left pl-7' : 'text-center'} ${className}`}
        style={light ? { background: '#f6f4ee', color: '#000' } : { background: '#000', color: ink ? '#ddc9b8' : '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <h1
          className="sv-tag-title font-medium uppercase whitespace-nowrap"
          style={{ fontFamily: MONO, letterSpacing: '0.04em', lineHeight: 1 }}
        >
          {label}
        </h1>
        <button
          onClick={onClose}
          className={`absolute top-1 right-1.5 md:top-1.5 md:right-2 transition-colors p-2 text-sm md:text-[17px] leading-none ${light ? 'text-black/80 hover:text-[#5683DD]' : ink ? 'text-[#ddc9b8] hover:text-white' : 'text-white/80 hover:text-white'}`}
          style={{ fontFamily: MONO }}
          aria-label={closeLabel || `Close ${label.toLowerCase()} page`}
        >
          X
        </button>
      </motion.div>
    </>
  )
}
