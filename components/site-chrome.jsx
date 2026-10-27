'use client'

// Site chrome shared by every page. Change it here once.
//
//   <SiteNav />                    mounted once in app/layout.tsx. The white nav bar that follows
//                                  you down the page (Ask Veritas · wordmark · menu), the menu itself,
//                                  and the eye in the bottom-left corner.
//   <SiteFooter open onClose />    the slide-up footer, opened by each page's bottom-right triangle.
//   <PageTag label onClose />      the black title tag above a page's content (TEAM, PRINCIPLES, CONTACT US).
//
// Layers: content 1 · nav, eye, bottom controls 40 · menu & pop-outs 50 · Ask panel 55 · footer 60 · grain 100.

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC_BLACK, ICON_SRC_BLACK, PROCESS_ICON_SRC } from './media'
import { MENU_ITEMS } from './site-nav'
import { toggleAskVeritas, STATE_EVENT } from './ask-veritas/open'

export const CONTACT_EMAIL = 'info@studio-veritas.com'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/team-studio-veritas'
export const ABOUT_EVENT = 'sv:about-toggle'

const MONO = "'IBM Plex Mono', monospace"

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
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
          padding: 0 14px; background: #fff; border-radius: 8px;
          box-shadow: 0 6px 24px -14px rgba(0,0,0,0.35);
        }
        @media (min-width: 768px) { .sv-nav { padding: 0 26px; } }
        .sv-nav-ask { justify-self: start; display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 8px; margin-left: -8px; background: none; border: 0; color: #000; font: 500 11px/1 ${MONO}; letter-spacing: 0.2em; text-transform: uppercase; transition: color .2s; }
        .sv-nav-ask svg { display: block; flex: none; transition: transform .35s cubic-bezier(0.22,1,0.36,1); }
        .sv-nav-ask[aria-expanded="true"] svg { transform: rotate(180deg); }
        .sv-nav-ask-label { opacity: 0; transform: translateX(-4px); transition: opacity .2s, transform .2s; white-space: nowrap; }
        .sv-nav-ask:hover, .sv-nav-ask:focus-visible, .sv-nav-ask[aria-expanded="true"] { color: #5683DD; outline: none; }
        @media (hover: hover) and (min-width: 768px) {
          .sv-nav-ask:hover .sv-nav-ask-label, .sv-nav-ask:focus-visible .sv-nav-ask-label { opacity: 1; transform: none; }
        }
        .sv-nav-logo { display: block; transition: opacity .2s; }
        .sv-nav-logo:hover, .sv-nav-logo:focus-visible { opacity: .6; outline: none; }
        .sv-nav-logo img { display: block; height: 24px; width: auto; }
        @media (min-width: 768px) { .sv-nav-logo img { height: 34px; } }
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
      `}</style>

      <motion.header
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
          <img src={LOGO_SRC_BLACK} alt="Studio Veritas" draggable={false} />
        </a>

        <button
          type="button"
          className="sv-nav-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
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
        aria-label={pathname === '/' ? 'About Studio Veritas' : 'Studio Veritas, home'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <img src={ICON_SRC_BLACK} alt="" draggable={false} />
      </motion.a>
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

export function PageTag({ label, onClose = leavePage, closeLabel, className = '' }) {
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
        className={`sv-tag relative rounded-md shadow-2xl px-10 py-5 text-center ${className}`}
        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <h1
          className="sv-tag-title text-white font-medium uppercase whitespace-nowrap"
          style={{ fontFamily: MONO, letterSpacing: '0.04em', lineHeight: 1 }}
        >
          {label}
        </h1>
        <button
          onClick={onClose}
          className="absolute top-1 right-1.5 md:top-1.5 md:right-2 text-white/80 hover:text-white transition-colors p-2 text-sm md:text-[17px] leading-none"
          style={{ fontFamily: MONO }}
          aria-label={closeLabel || `Close ${label.toLowerCase()} page`}
        >
          X
        </button>
      </motion.div>
    </>
  )
}
