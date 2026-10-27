'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC, ICON_SRC, ICON_SRC_BLACK, PROCESS_ICON_SRC, LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE } from './media'
import { SiteFooter, PageTag } from './site-chrome'

const CONTACT_EMAIL = 'info@studio-veritas.com'

const CONTACT_PANELS = {
  companies: { heading: 'For companies', body: 'We work directly with brand, marketing, innovation and\ndesign teams on strategic and creative projects.' },
  agencies: { heading: 'For agencies', body: 'We work as a freelance strategy, creative and design team\nwhen you need extra thinking, different perspectives or specialist capability.' },
}


// Positions are relative to a fixed-aspect bounding box (not the viewport),
// so the triangle's proportions stay identical on every screen size/aspect
// ratio. Box aspect is set to 16:9 to exactly match the reference screenshot
// (Veritas_Website_Design-Process_page.png, 1920x1080) — every coordinate
// below is measured directly from that file's pixels, so using the same
// aspect ratio means these percentages map 1:1 with no approximation error.
//
// IMPORTANT: bl.x/br.x define the WIDTH of the wrapper box the triangle PNG
// renders inside, and that wrapper uses object-contain — so its own aspect
// ratio must exactly match the source image's REAL, ACTUAL pixel aspect
// ratio or object-contain letterboxes the image inward, leaving the visual
// triangle narrower than this box and detaching the corner labels from the
// actual ink. A hardcoded ratio here is a trap: it silently goes wrong the
// moment PROCESS_ICON_SRC is ever re-exported/re-cropped even slightly, with
// no error anywhere to catch it. So instead of a hardcoded number, the real
// aspect ratio is measured directly from the loaded <img> element itself
// (naturalWidth/naturalHeight, see useProcessIconAspect below) and used to
// derive width% from height% * (9/16) * measuredAspect — this can never
// drift out of sync with whatever image actually ships, ever again.
const TRIANGLE_ASPECT = 16 / 9
const TRIANGLE_IMG_ASPECT_FALLBACK = 767 / 500 // only used for the first frame, before the real image reports its size
const TRIANGLE_APEX_X = 49.95
const TRIANGLE_APEX_Y = 37.04
const TRIANGLE_BASE_Y = 68.8

function getTriangleGeometry(imgAspect) {
  const halfWidth = ((TRIANGLE_BASE_Y - TRIANGLE_APEX_Y) * (9 / 16) * imgAspect) / 2
  const triangle = {
    apex: { x: TRIANGLE_APEX_X, y: TRIANGLE_APEX_Y },
    bl: { x: 50 - halfWidth, y: TRIANGLE_BASE_Y },
    br: { x: 50 + halfWidth, y: TRIANGLE_BASE_Y },
  }
  const steps = [
    {
      id: 'truthful',
      label: 'Truthful',
      x: 50.03,
      y: 31.16,
      body: 'Say the things everyone already feels but hasn\'t said.',
    },
    {
      id: 'noticable',
      label: 'Noticeable',
      x: triangle.bl.x + 0.27,
      y: 72.36,
      body: 'Break conventions that others follow blindly.',
    },
    {
      id: 'memorable',
      label: 'Memorable',
      x: triangle.br.x - 0.49,
      y: 72.36,
      body: 'Make it simple enough to repeat, unexpected enough to stick.',
    },
  ]
  return { triangle, steps }
}

// Static fallback (used for SEO/SR-only markup and the JSON-LD block, which
// render before any image can load — a couple tenths of a percent of drift
// there has no visible effect since that content isn't positionally laid out).
const { steps: STEPS } = getTriangleGeometry(TRIANGLE_IMG_ASPECT_FALLBACK)

function Wordmark({ max = 10 }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Studio Veritas"
      style={{
        maxHeight: `${max}px`,
        maxWidth: '100%',
        width: 'auto',
        height: 'auto',
        display: 'block',
        objectFit: 'contain',
        userSelect: 'none',
      }}
      draggable={false}
    />
  )
}

const PANEL_WIDTH = 300
const PANEL_MARGIN = 16

export function Process() {
  const [active, setActive] = useState(null)
  const [revealed, setRevealed] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [contactPanel, setContactPanel] = useState(null)
  const [contactRevealed, setContactRevealed] = useState(0)
  const [footerOpen, setFooterOpen] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [panelPos, setPanelPos] = useState(null)
  const btnRefs = useRef({})
  const triangleImgRef = useRef(null)

  // Real, measured aspect ratio of whatever PROCESS_ICON_SRC actually is —
  // see the note above getTriangleGeometry for why this can't be hardcoded.
  const [imgAspect, setImgAspect] = useState(TRIANGLE_IMG_ASPECT_FALLBACK)

  const readNaturalAspect = useCallback(() => {
    const el = triangleImgRef.current
    if (el && el.naturalWidth && el.naturalHeight) {
      setImgAspect(el.naturalWidth / el.naturalHeight)
    }
  }, [])

  useEffect(() => {
    // Data-URI images can finish decoding before this effect (and the
    // onLoad prop below) even attaches — that's the classic case where
    // relying on onLoad alone silently misses the real dimensions. Checking
    // `.complete` on mount catches that; onLoad still covers the normal case.
    readNaturalAspect()
  }, [readNaturalAspect])

  const { triangle: TRIANGLE, steps: dynamicSteps } = useMemo(
    () => getTriangleGeometry(imgAspect),
    [imgAspect]
  )

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

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
    if (!active) {
      setRevealed(0)
      return
    }
    setRevealed(0)
    const step = STEPS.find((s) => s.id === active)
    const total = step ? step.body.length : 0
    let current = 0
    const interval = setInterval(() => {
      current += 3
      setRevealed(Math.min(current, total))
      if (current >= total) clearInterval(interval)
    }, 12)
    return () => clearInterval(interval)
  }, [active])

  const positionPanel = useCallback((id) => {
    const el = btnRefs.current[id]
    if (!el) return
    const rect = el.getBoundingClientRect()
    let left = rect.right + PANEL_MARGIN
    if (left + PANEL_WIDTH + PANEL_MARGIN > window.innerWidth) {
      left = rect.left - PANEL_MARGIN - PANEL_WIDTH
    }
    left = Math.max(PANEL_MARGIN, Math.min(left, window.innerWidth - PANEL_WIDTH - PANEL_MARGIN))
    let top = rect.top - 30
    top = Math.max(PANEL_MARGIN, Math.min(top, window.innerHeight - 280))
    setPanelPos({ top, left })
  }, [])

  const handleStepClick = useCallback((id) => {
    setActive((prev) => (prev === id ? null : id))
    positionPanel(id)
  }, [positionPanel])

  useEffect(() => {
    if (!active) return
    const onResize = () => positionPanel(active)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active, positionPanel])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setActive(null); setContactPanel(null); setFooterOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cursorSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 24' fill='none'><path d='M1 1L1 18.5L5.5 14L10 22L13 20.5L8.5 12.5L14.5 12L1 1Z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round'/></svg>"

  const activeStep = STEPS.find((s) => s.id === active)

  return (
    <main
      className="sv-process-container relative w-full overflow-hidden text-white"
      style={{ background: '#D8FF00', cursor: `url("${cursorSvg}") 4 2, auto` }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Studio Veritas — Process',
            step: STEPS.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.label,
              text: s.body.replace(/\n/g, ' '),
            })),
          }),
        }}
      />
      <style>{`
        .sv-process-root * { cursor: url("${cursorSvg}") 4 2, auto !important; }
        .sv-process-container { height: 100vh; }
        @supports (height: 100dvh) { .sv-process-container { height: 100dvh; } }
        .sv-process-root button, .sv-process-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
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
        .sv-triangle-label { font-size: 16pt; }
        @media (min-width: 768px) { .sv-triangle-label { font-size: 28pt; } }
        @media (max-width: 480px) {
          [data-id="noticable"] { left: 21% !important; }
          [data-id="memorable"] { left: 79% !important; }
        }
        @media (min-width: 768px) { .sv-safe-top-menu { top: max(76px, calc(env(safe-area-inset-top) + 44px)); } }
        @media (max-width: 480px) {
          .sv-contact-row { flex-direction: column !important; align-items: flex-end !important; gap: 4px !important; }
        }
        @keyframes sv-drift { 0%,100% { transform: scale(1.0) translate(0,0); } 50% { transform: scale(1.04) translate(-0.6%,-0.4%); } }
        @keyframes sv-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .sv-typewriter-cursor::after { content: '\\2588'; animation: sv-blink 0.8s step-end infinite; margin-left: 2px; }
      `}</style>

      <div className="sv-process-root absolute inset-0">
        {/* SEO / LLM-readable content — visually hidden, real text in the DOM */}
        <section className="sv-sr-only">
          <h1>Studio Veritas — Process: Discover, Define, Develop.</h1>
          {STEPS.map((s) => (
            <div key={s.id}>
              <h2>{s.label}</h2>
              <p>{s.body.replace(/\n/g, ' ')}</p>
            </div>
          ))}
        </section>

        {/* BACKGROUND — same atmospheric photo as the homepage */}
        <div className="absolute inset-0 overflow-hidden" style={{ background: '#D8FF00', zIndex: 0 }}>
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              backgroundImage: `url(${LANDING_IMG_DESKTOP})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'sv-drift 26s ease-in-out infinite',
            }}
          />
          <div
            className="absolute inset-0 block md:hidden"
            style={{
              backgroundImage: `url(${LANDING_IMG_MOBILE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'sv-drift 26s ease-in-out infinite',
            }}
          />
        </div>

        {/* GRAIN */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100, mixBlendMode: 'overlay' }}>
          <svg width="100%" height="100%" style={{ opacity: 0.18 }}>
            <filter id="sv-process-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#sv-process-grain)" />
          </svg>
        </div>

        {/* PROCESS VISUAL — desktop: triangle + radial labels. Mobile: icon on
            top with the words stacked below as a clickable list. Only one of
            these mounts at a time (driven by isMobile), so there's no button
            ref collision between the two layouts. */}
        {isMobile ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 pt-[76px]" style={{ zIndex: 5 }}>
            <PageTag label="Principles" className="-mb-2" />
            <motion.div
              style={{ width: '48vw', maxWidth: 220, cursor: 'pointer' }}
              animate={{ rotate: spinCount * 360 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              onClick={() => setSpinCount((c) => c + 1)}
              role="button"
              className="sv-zoom-on-hover"
              aria-label="Spin the process icon"
            >
              <img
                src={PROCESS_ICON_SRC}
                alt="Studio Veritas"
                className="w-full h-auto object-contain"
                draggable={false}
              />
            </motion.div>

            <nav className="flex flex-col items-center gap-6" aria-label="Process">
              {STEPS.map((s, i) => (
                <motion.button
                  key={s.id}
                  data-id={s.id}
                  ref={(el) => { btnRefs.current[s.id] = el }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  onClick={() => handleStepClick(s.id)}
                  className="sv-triangle-label font-medium tracking-[0.1em] uppercase transition-colors p-3 -m-3 whitespace-nowrap"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: active === s.id ? '#5683DD' : '#000000',
                  }}
                  aria-label={`${s.label}: read more`}
                >
                  {s.label}
                </motion.button>
              ))}
            </nav>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 5, paddingTop: 72 }}>
            <div
              style={{
                position: 'relative',
                width: `min(100vw, calc(100vh * ${TRIANGLE_ASPECT}))`,
                aspectRatio: String(TRIANGLE_ASPECT),
              }}
            >
              {/* PRINCIPLES tag, anchored just above the top label (TRUTHFUL) */}
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: `${Math.min(...dynamicSteps.map((s) => s.y))}%`,
                  transform: 'translate(-50%, calc(-100% - 50px))',
                  zIndex: 25,
                }}
              >
                <PageTag label="Principles" />
              </div>

              {/* Rotating group: the new triangle-eye icon replaces the old polygon + logo */}
              <motion.div
                className="absolute inset-0 sv-zoom-on-hover"
                style={{ zIndex: 10, cursor: 'pointer' }}
                animate={{ rotate: spinCount * 360 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                onClick={() => setSpinCount((c) => c + 1)}
                role="button"
                aria-label="Spin the process triangle"
              >
                <div
                  className="absolute"
                  style={{
                    left: `${TRIANGLE.bl.x}%`,
                    top: `${TRIANGLE.apex.y}%`,
                    width: `${TRIANGLE.br.x - TRIANGLE.bl.x}%`,
                    height: `${TRIANGLE.bl.y - TRIANGLE.apex.y}%`,
                  }}
                >
                  <img
                    ref={triangleImgRef}
                    src={PROCESS_ICON_SRC}
                    alt="Studio Veritas"
                    className="w-full h-full object-contain"
                    draggable={false}
                    onLoad={readNaturalAspect}
                  />
                </div>
              </motion.div>

              {/* Fixed labels — do not rotate with the triangle. Positioned
                  from dynamicSteps (measured from the real image), not the
                  static fallback STEPS used for the SEO-only text above.
                  IMPORTANT: the centering transform lives on this OUTER,
                  plain div — never on the same element as a Framer Motion
                  animate/initial that touches x/y/scale/rotate. Framer
                  Motion takes full ownership of an element's `transform`
                  CSS property the moment any transform-affecting value
                  appears in animate/initial, and silently overwrites
                  whatever was set via style.transform — so a manual
                  translate(-50%,-50%) placed on the same motion.div as
                  `animate={{ y: 0 }}` gets discarded outright, leaving the
                  label's top-left corner (not its center) sitting at the
                  anchor point. That's precisely why every label rendered
                  shifted right/down by exactly half its own width/height.
                  Splitting the two concerns across parent/child fixes it. */}
              {dynamicSteps.map((s, i) => (
                <div
                  key={s.id}
                  data-id={s.id}
                  className="absolute"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  >
                    <button
                      ref={(el) => { btnRefs.current[s.id] = el }}
                      onClick={() => handleStepClick(s.id)}
                      className="sv-triangle-label font-medium tracking-[0.1em] uppercase transition-colors p-3 -m-3 whitespace-nowrap"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: active === s.id ? '#5683DD' : '#000000',
                      }}
                      aria-label={`${s.label}: read more`}
                    >
                      {s.label}
                    </button>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POP-OUT MODULE — anchored beside the clicked word */}
        <AnimatePresence>
          {activeStep && panelPos && (
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed w-[calc(100%-2rem)] max-w-[300px] max-h-[280px] rounded-md p-5 md:p-7 overflow-y-auto shadow-2xl"
              style={{
                top: panelPos.top,
                left: panelPos.left,
                background: '#000',
                border: '1px solid rgba(255,255,255,0.1)',
                WebkitOverflowScrolling: 'touch',
                zIndex: 50,
              }}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 touch-manipulation"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                aria-label="Close"
              >
                ✕
              </button>
              <p
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#5683DD', letterSpacing: '0.2em' }}
                className="text-[11px] md:text-xs font-medium uppercase mb-3"
              >
                {activeStep.label}
              </p>
              <p
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                className="whitespace-pre-line text-[13px] md:text-sm text-white/90 leading-relaxed pr-6"
              >
                {activeStep.body.slice(0, revealed)}
                {revealed < activeStep.body.length && <span className="sv-typewriter-cursor" />}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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

export default Process
