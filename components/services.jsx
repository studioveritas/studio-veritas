'use client'

// SERVICES (/services). Three areas in a grey card (the Contact page's card) over the cloud background.
// Clicking an area opens the site's black pop-out beneath it: its services type out in the site's
// typewriter style, then two related case-study tiles pop up (they zoom into the case study like the
// Work page tiles), then "See all … work" (the Work page, filtered) and "Start with this" (opens the
// For companies panel with that area chosen).
// Copy and pairings live in components/services-data.js.
// /services?service=strategy|world|innovation (or #brand-strategy etc.) opens with that area expanded.

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE } from './media'
import { SiteFooter, PageTitle, openContactPanel } from './site-chrome'
import { SERVICE_AREAS } from './services-data'
import { zoomToCaseStudy } from './case-zoom'

const MONO = "'IBM Plex Mono', monospace"
const TYPE_CHARS = 3 // the site's typewriter speed
const TYPE_MS = 12

const areaTotal = (a) => a.items.reduce((n, [name, body]) => n + name.length + body.length, 0)
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function Typed({ text, n, active }) {
  const k = Math.max(0, Math.min(text.length, n))
  return (
    <>
      {text.slice(0, k)}
      {active && <span className="sv-typewriter-cursor" />}
      <span className="sv-svc-ghost">{text.slice(k)}</span>
    </>
  )
}

// `work`: this area's related tiles from app/services/page.tsx (public case studies only).
function AreaPanel({ area, work, onClose }) {
  const total = areaTotal(area)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reducedMotion()) { setTyped(total); return }
    setTyped(0)
    let iv
    const t = setTimeout(() => {
      iv = setInterval(() => setTyped((c) => {
        const next = Math.min(total, c + TYPE_CHARS)
        if (next >= total) clearInterval(iv)
        return next
      }), TYPE_MS)
    }, 250)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [area.id, total])

  const done = typed >= total
  let offset = 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      className="relative rounded-md p-5 md:p-7 shadow-2xl mb-6 text-white"
      style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', fontFamily: MONO }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
        style={{ fontFamily: MONO }}
        aria-label="Close"
      >
        ✕
      </button>

      {/* Screen readers get the whole list at once; the typed copy is for the eye. */}
      <ul className="sv-sr-only">
        {area.items.map(([name, body]) => <li key={name}>{name}: {body}</li>)}
      </ul>

      <div className="flex flex-col gap-7">
        <div className="sv-svc-grid" aria-hidden="true">
          {area.items.map(([name, body]) => {
            const start = offset
            offset += name.length + body.length
            const local = typed - start
            const active = typed > start && typed <= offset && !done
            return (
              <div key={name}>
                <p className="sv-svc-name">
                  <Typed text={name} n={local} active={active && local < name.length} />
                </p>
                <p className="sv-svc-body">
                  <Typed text={body} n={local - name.length} active={active && local >= name.length} />
                </p>
              </div>
            )
          })}
        </div>

        {done && work.length > 0 && (
          <div className="sv-svc-work">
            {work.map((w, i) => (
              <motion.a
                key={w.slug}
                href={w.href}
                className="sv-tile"
                initial={{ opacity: 0, y: 20, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 26, stiffness: 300, delay: i * 0.12 }}
                onClick={(e) => zoomToCaseStudy(e, w, e.currentTarget.querySelector('.sv-tile-media img'))}
                aria-label={`${w.client}: ${w.subheading}. Read the case study`}
              >
                <div className="sv-tile-media">
                  <img src={w.src} alt="" draggable={false} />
                  <div className="sv-tile-box">
                    <p className="sv-tile-name">{w.name}</p>
                    <p className="sv-tile-sub">{w.subheading}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-x-8 gap-y-3.5">
          <a href={`/work?tag=${area.tag.toLowerCase()}`} className="sv-svc-link">
            See all {area.tag.toLowerCase()} work →
          </a>
          <button type="button" className="sv-svc-link" onClick={() => openContactPanel('companies', area.id)}>
            Start with this →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function Services({ related = {} }) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(null)
  const [footerOpen, setFooterOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  // Keep the open area in the address bar, so a link can open the page on it.
  const choose = useCallback((id, scroll = false) => {
    setOpen(id)
    try {
      const url = new URL(window.location.href)
      url.hash = ''
      if (id) url.searchParams.set('service', id)
      else url.searchParams.delete('service')
      window.history.replaceState(null, '', url)
    } catch {}
    if (id && scroll) {
      const area = SERVICE_AREAS.find((a) => a.id === id)
      setTimeout(() => document.getElementById(area.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450)
    }
  }, [])

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('service') || window.location.hash.slice(1)
      const found = SERVICE_AREAS.find((a) => q && (a.id === q || a.anchor === q))
      if (found) choose(found.id, true)
    } catch {}
  }, [choose])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(null); setFooterOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cursorSvg = '/sv-cursor.png' // the Studio Veritas eye-triangle, white (public/sv-cursor.png)

  return (
    <main
      className="sv-services-container relative w-full overflow-hidden text-black"
      style={{ background: 'var(--sv-ground, #D8FF00)', cursor: `url("${cursorSvg}") 16 1, auto` }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Studio Veritas — Services',
            itemListElement: SERVICE_AREAS.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Service',
                name: a.title,
                provider: { '@type': 'ProfessionalService', name: 'Studio Veritas' },
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: a.title,
                  itemListElement: a.items.map(([name, body]) => ({
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name, description: body },
                  })),
                },
              },
            })),
          }),
        }}
      />
      <style>{`
        .sv-services-root * { cursor: url("${cursorSvg}") 16 1, auto !important; }
        .sv-services-container { min-height: 100vh; }
        @supports (min-height: 100dvh) { .sv-services-container { min-height: 100dvh; } }
        .sv-services-root button, .sv-services-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .sv-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        .sv-safe-right { right: max(16px, env(safe-area-inset-right)); }
        .sv-safe-bottom { bottom: max(16px, env(safe-area-inset-bottom)); }
        @media (min-width: 768px) {
          .sv-safe-right { right: max(40px, env(safe-area-inset-right)); }
          .sv-safe-bottom { bottom: max(32px, env(safe-area-inset-bottom)); }
        }
        @keyframes sv-drift { 0%,100% { transform: scale(1.0) translate(0,0); } 50% { transform: scale(1.04) translate(-0.6%,-0.4%); } }
        @keyframes sv-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .sv-typewriter-cursor::after { content: '\\2588'; animation: sv-blink 0.8s step-end infinite; margin-left: 2px; }

        /* the three areas: Principles label style */
        .sv-svc-row { border-bottom: 1px solid rgba(0,0,0,0.45); scroll-margin-top: 130px; }
        .sv-svc-row:last-child { border-bottom: 0; }
        .sv-svc-btn { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 24px; width: 100%; padding: 22px 0; text-align: left; color: #000; transition: color .2s; }
        .sv-svc-btn:focus-visible { outline: none; color: #5683DD; }
        .sv-svc-row[data-open='true'] .sv-svc-btn { color: #5683DD; }
        .sv-svc-label { font-family: ${MONO}; font-weight: 500; font-size: 16pt; line-height: 1.15; letter-spacing: 0.1em; text-transform: uppercase; }
        .sv-svc-desc { display: none; max-width: 280px; text-align: right; font: 400 14px/1.4 ${MONO}; color: rgba(0,0,0,0.72); transition: color .2s; }
        .sv-svc-row[data-open='true'] .sv-svc-desc { color: #5683DD; }
        .sv-svc-plus { display: block; flex: none; width: 12px; height: 12px; transition: transform .3s cubic-bezier(0.22,1,0.36,1); }
        .sv-svc-row[data-open='true'] .sv-svc-plus { transform: rotate(45deg); }
        @media (hover: hover) {
          .sv-svc-btn:hover, .sv-svc-btn:hover .sv-svc-desc { color: #5683DD; }
        }
        @media (min-width: 768px) {
          .sv-svc-label { font-size: 28pt; }
          .sv-svc-desc { display: block; }
          .sv-svc-btn { padding: 26px 0; }
        }

        /* inside the pop-out */
        .sv-svc-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 22px 40px; padding-right: 24px; }
        @media (min-width: 768px) { .sv-svc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .sv-svc-name { margin: 0 0 8px; font: 500 11px/1.4 ${MONO}; letter-spacing: 0.2em; text-transform: uppercase; color: #5683DD; }
        .sv-svc-body { margin: 0; font: 400 13px/1.625 ${MONO}; color: rgba(255,255,255,0.9); }
        @media (min-width: 768px) { .sv-svc-name { font-size: 12px; } .sv-svc-body { font-size: 14px; } }
        .sv-svc-ghost { color: transparent; }
        .sv-svc-link { display: inline-block; font: 400 13px/1.4 ${MONO}; color: #fff; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: rgba(255,255,255,0.4); transition: color .2s, text-decoration-color .2s; }
        @media (min-width: 768px) { .sv-svc-link { font-size: 14px; } }
        .sv-svc-link:hover, .sv-svc-link:focus-visible { color: #5683DD; text-decoration-color: #fff; outline: none; }

        /* related work: the Work page tiles, popped out */
        .sv-svc-work { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 24px; border-top: 1px dashed rgba(255,255,255,0.3); }
        @media (min-width: 768px) { .sv-svc-work { grid-template-columns: repeat(2, 240px); gap: 16px; } }
        .sv-tile { display: block; color: #fff; text-decoration: none; outline: none; transform-origin: 50% 100%; }
        .sv-tile-media { position: relative; overflow: hidden; border-radius: 3px; background: #141414; aspect-ratio: 4 / 5; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .sv-tile-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .sv-tile-box { position: absolute; left: 8px; bottom: 8px; max-width: calc(100% - 16px); min-width: min(72%, calc(100% - 16px)); padding: 8px 12px 9px; background: #000; border-radius: 2px; }
        .sv-tile-name { margin: 0; font-family: ${MONO}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; font-size: 15px; line-height: 1.25; transition: color 0.2s; }
        .sv-tile-sub { margin: 3px 0 0; font-family: ${MONO}; font-weight: 400; font-size: 11.5px; line-height: 1.4; }
        @media (min-width: 768px) {
          .sv-tile-box { left: 10px; bottom: 10px; max-width: calc(100% - 20px); padding: 9px 14px 10px; }
          .sv-tile-name { font-size: clamp(15px, 1.04vw, 20px); }
          .sv-tile-sub { font-size: clamp(11.5px, 0.73vw, 14px); }
        }
        @media (hover: hover) {
          .sv-tile:hover .sv-tile-name { color: #5683DD; }
          .sv-tile:hover .sv-tile-media img { transform: scale(1.035); }
        }
        .sv-tile:focus-visible .sv-tile-name { color: #5683DD; }
        .sv-tile:focus-visible .sv-tile-media { box-shadow: 0 0 0 2px #5683DD; }
        @media (prefers-reduced-motion: reduce) { .sv-tile-media img, .sv-svc-plus { transition: none; } }
      `}</style>

      <div className="sv-services-root relative">
        {/* SEO / LLM-readable content */}
        <section className="sv-sr-only">
          <h2>Studio Veritas — Services</h2>
          {SERVICE_AREAS.map((a) => (
            <div key={a.id}>
              <h3>{a.title}</h3>
              <ul>
                {a.items.map(([name, body]) => <li key={name}>{name}: {body}</li>)}
              </ul>
            </div>
          ))}
        </section>

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden" style={{ background: 'var(--sv-ground, #D8FF00)', zIndex: 0 }}>
          <div
            className="absolute inset-0 hidden md:block"
            style={{ backgroundImage: `url(${LANDING_IMG_DESKTOP})`, filter: 'var(--sv-sky-filter, none)', backgroundSize: 'cover', backgroundPosition: 'center', animation: 'sv-drift 26s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-0 block md:hidden"
            style={{ backgroundImage: `url(${LANDING_IMG_MOBILE})`, filter: 'var(--sv-sky-filter, none)', backgroundSize: 'cover', backgroundPosition: 'center', animation: 'sv-drift 26s ease-in-out infinite' }}
          />
        </div>

        {/* GRAIN */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100, mixBlendMode: 'overlay', opacity: 0.18 }}>
          <svg width="100%" height="100%">
            <filter id="sv-services-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#sv-services-grain)" />
          </svg>
        </div>

        {/* SERVICES */}
        <div className="relative min-h-screen flex flex-col items-center justify-start md:justify-center px-4 md:px-10 pt-[132px] pb-36 md:pt-[184px] md:pb-40" style={{ zIndex: 1 }}>
          <PageTitle className="mb-10 md:mb-16">Our services</PageTitle>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260, delay: 0.25 }}
            className="w-full max-w-[1400px] rounded-md px-5 md:px-7 sv-ink"
            style={{ background: '#eeeeee', border: '1px solid rgba(0,0,0,0.45)' }}
          >
            {SERVICE_AREAS.map((a, i) => {
              const isOpen = open === a.id
              return (
                <motion.section
                  key={a.id}
                  id={a.anchor}
                  className="sv-svc-row"
                  data-open={isOpen}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                >
                  <button
                    type="button"
                    className="sv-svc-btn"
                    aria-expanded={isOpen}
                    onClick={() => choose(isOpen ? null : a.id)}
                  >
                    <span className="sv-svc-label">({i + 1}) {a.title}</span>
                    <span className="flex items-center gap-[22px]">
                      <span className="sv-svc-desc">{a.desc}</span>
                      <svg className="sv-svc-plus" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && <AreaPanel key={a.id} area={a} work={related[a.id] || []} onClose={() => choose(null)} />}
                  </AnimatePresence>
                </motion.section>
              )
            })}
          </motion.div>
        </div>

        {/* BOTTOM-RIGHT: footer trigger (FOR COMPANIES / FOR AGENCIES are global, bottom centre: site-chrome.jsx) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="sv-contact-row fixed sv-safe-bottom sv-safe-right flex flex-row items-center gap-3 md:gap-4"
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

export default Services
