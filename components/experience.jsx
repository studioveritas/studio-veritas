'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOGO_SRC, LOGO_SRC_BLACK, ICON_SRC, ICON_SRC_BLACK, WORK_IMG, LANDING_IMG_DESKTOP, LANDING_IMG_MOBILE } from './media'

const MENU_ITEMS = [
  { label: 'Team', href: '/team' },
  { label: 'Principles', href: '/process' },
  { label: 'Experience', href: '/clients' },
]

const CONTACT_EMAIL = 'gfurminger@gmail.com'

const CONTACT_PANELS = {
  companies: {
    heading: 'For companies',
    body: 'We work directly with brand, marketing, innovation and\ndesign teams on strategic and creative projects.',
  },
  agencies: {
    heading: 'For agencies',
    body: 'We work as a freelance strategy, creative and design team\nwhen you need extra thinking, different perspectives or specialist capability.',
  },
}

const POPUP_PARAGRAPHS = [
  'Good strategy starts with hard questions.\nThe kind that get under the brief to find the truth.\nThe real problem. The deeper need.',
  "We look at the company, the category and at culture.\nAt what's changing and emerging.\nWhat's working and what's not.\nAnd what all that means for the brand.",
  "Then we find the tension. Truths pulling against each other.\nThat's where big ideas are born. And where growth happens.",
  "We work with companies and agencies that need clear thinking,\na sharp point of view, and creative that's built on truth\nand made to work in the real world.",
]

/*
  No client photography was supplied with this build. Rather than fake
  stock-photo case studies, each work gets a bespoke gradient field plus
  a single oversized initial of the client name as its signature mark —
  consistent system, distinct per client, nothing borrowed.
*/
const WORKS = [
  { name: 'PREM RUGBY', client: 'Premiership Rugby', line: 'A platform built on the collision of tradition and raw spectacle.', grad: 'radial-gradient(120% 100% at 20% 0%, #274a1f 0%, #0d1a0a 55%, #050903 100%)', accent: '#a8e05f', texture: 'collision', img: 'prem' },
  { name: 'JORDAN WINGS', client: 'Jordan Brand', line: 'Mentorship as the truth behind the mythology.', grad: 'radial-gradient(120% 100% at 80% 100%, #3a0808 0%, #150202 55%, #050101 100%)', accent: '#e8433f', texture: 'wings', img: 'jordan' },
  { name: 'SEEDLIP', client: 'Seedlip', line: "What to drink when you're not drinking.", grad: 'radial-gradient(120% 100% at 30% 20%, #1f4a3f 0%, #0b1d18 55%, #040d0a 100%)', accent: '#9fd8bf', texture: 'botanical', img: 'seedlip' },
  { name: 'ALLBIRDS', client: 'Allbirds', line: 'Nature knows better than we do.', grad: 'radial-gradient(120% 100% at 70% 10%, #4a3f2a 0%, #211c12 55%, #0c0a06 100%)', accent: '#e3d3a8', texture: 'wool', img: 'allbirds' },
  { name: 'CANYON', client: 'Canyon', line: 'Nothing between you and the road.', grad: 'radial-gradient(120% 100% at 50% 100%, #6b2c15 0%, #2a1108 55%, #0d0503 100%)', accent: '#ff8c52', texture: 'road', img: 'canyon' },
  { name: 'UBER', client: 'Uber', line: 'The city, always in motion.', grad: 'radial-gradient(120% 100% at 50% 0%, #2a2a2a 0%, #0e0e0e 55%, #030303 100%)', accent: '#ffffff', texture: 'grid', img: 'uber' },
  { name: 'ICEBREAKER', client: 'Icebreaker', line: 'A natural alternative to synthetic.', grad: 'radial-gradient(120% 100% at 20% 90%, #1c3a4a 0%, #0a1a21 55%, #03080a 100%)', accent: '#bfe6f2', texture: 'knit', img: 'icebreaker' },
  { name: 'WINDHOEK', client: 'Windhoek', line: 'Pure by nature. Nothing to hide.', grad: 'radial-gradient(120% 100% at 80% 90%, #5a3d10 0%, #241a08 55%, #0a0703 100%)', accent: '#f2c76b', texture: 'horizon', img: 'windhoek' },
]

const slide = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', scale: 1.12, opacity: 0.5 }),
  center: { x: '0%', scale: 1, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-45%' : '45%', scale: 1.06, opacity: 0.3 }),
}

function Wordmark({ max = 60, className = '', src = LOGO_SRC }) {
  return (
    <img
      src={src}
      alt="Studio Veritas"
      className={className}
      style={{
        maxHeight: className ? undefined : `${max}px`,
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

function TextureOverlay({ texture, accent }) {
  const common = { position: 'absolute', inset: 0, opacity: 0.5 }
  if (texture === 'collision') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <circle cx="130" cy="220" r="140" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.35" />
        <circle cx="290" cy="180" r="100" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.25" />
      </svg>
    )
  }
  if (texture === 'wings') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M ${-40 + i * 90} 400 L ${140 + i * 90} 400 L ${60 + i * 90} 40 Z`} fill={accent} opacity={0.05 + i * 0.01} />
        ))}
      </svg>
    )
  }
  if (texture === 'botanical') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <path d="M60 380 C 40 260, 90 160, 200 90 C 150 200, 140 300, 160 380 Z" fill={accent} opacity="0.14" />
        <path d="M340 380 C 360 250, 300 150, 220 100 C 270 210, 280 300, 270 380 Z" fill={accent} opacity="0.1" />
      </svg>
    )
  }
  if (texture === 'wool') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        {[...Array(9)].map((_, i) => (
          <circle key={i} cx={40 + (i % 3) * 160} cy={60 + Math.floor(i / 3) * 150} r="70" fill="none" stroke={accent} strokeWidth="1" opacity="0.18" />
        ))}
      </svg>
    )
  }
  if (texture === 'road') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <line x1="0" y1="400" x2="400" y2="120" stroke={accent} strokeWidth="2" opacity="0.3" />
        <line x1="0" y1="340" x2="400" y2="60" stroke={accent} strokeWidth="1" opacity="0.15" />
      </svg>
    )
  }
  if (texture === 'grid') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        {[...Array(8)].map((_, i) => (
          <line key={'v' + i} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke={accent} strokeWidth="0.5" opacity="0.12" />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={'h' + i} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke={accent} strokeWidth="0.5" opacity="0.12" />
        ))}
      </svg>
    )
  }
  if (texture === 'knit') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        {[...Array(14)].map((_, i) => (
          <line key={i} x1={-100 + i * 40} y1="0" x2={100 + i * 40} y2="400" stroke={accent} strokeWidth="1" opacity="0.12" />
        ))}
      </svg>
    )
  }
  if (texture === 'horizon') {
    return (
      <svg {...common} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <circle cx="200" cy="230" r="90" fill={accent} opacity="0.12" />
        <line x1="0" y1="260" x2="400" y2="260" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      </svg>
    )
  }
  return null
}

function WorkArt({ work }) {
  if (work.img && WORK_IMG[work.img]) {
    return (
      <img
        src={WORK_IMG[work.img]}
        alt={`${work.client} — ${work.line}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
    )
  }
  return (
    <div className="absolute inset-0" style={{ background: work.grad }}>
      <TextureOverlay texture={work.texture} accent={work.accent} />
      <div
        className="absolute inset-0 flex items-center justify-center select-none"
        style={{ pointerEvents: 'none' }}
      >
        <span
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 'min(46vw, 46vh)',
            lineHeight: 1,
            color: work.accent,
            opacity: 0.14,
          }}
        >
          {work.client.charAt(0)}
        </span>
      </div>
    </div>
  )
}

export function Experience() {
  const [mode, setMode] = useState('home')
  const [workIndex, setWorkIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [infoOpen, setInfoOpen] = useState(false)
  const [titleHover, setTitleHover] = useState(false)
  const [revealed, setRevealed] = useState([])
  const [contactPanel, setContactPanel] = useState(null)
  const [footerOpen, setFooterOpen] = useState(false)
  const [contactRevealed, setContactRevealed] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [workMenuOpen, setWorkMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoverHamburger, setHoverHamburger] = useState(false)
  const wheelLock = useRef(false)
  const touchStart = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => setMounted(true), [])

  const openWork = useCallback((idx) => {
    setDirection(1)
    setWorkIndex(idx)
    setMode('work')
  }, [])

  const goHome = useCallback(() => {
    setMode('home')
  }, [])

  const navigate = useCallback((dir) => {
    setDirection(dir)
    setWorkIndex((prev) => (prev + dir + WORKS.length) % WORKS.length)
  }, [])

  useEffect(() => {
    if (mode !== 'work') return
    const el = rootRef.current
    if (!el) return
    const onWheel = (e) => {
      if (wheelLock.current) return
      if (Math.abs(e.deltaY) < 12) return
      wheelLock.current = true
      navigate(e.deltaY < 0 ? 1 : -1)
      window.setTimeout(() => { wheelLock.current = false }, 850)
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [mode, navigate])

  useEffect(() => {
    if (mode !== 'work') return
    const el = rootRef.current
    if (!el) return
    const onTouchStart = (e) => {
      const t = e.touches[0]
      if (t) touchStart.current = { x: t.clientX, y: t.clientY }
    }
    const onTouchEnd = (e) => {
      const start = touchStart.current
      const t = e.changedTouches[0]
      if (!start || !t) return
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        navigate(dx < 0 ? 1 : -1)
      }
      touchStart.current = null
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [mode, navigate])

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
    const onKey = (e) => {
      if (e.key === 'Escape') { setInfoOpen(false); setContactPanel(null); setFooterOpen(false); if (mode === 'work') goHome() }
      if (mode === 'work') {
        if (e.key === 'ArrowRight') navigate(1)
        if (e.key === 'ArrowLeft') navigate(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, navigate, goHome])

  useEffect(() => {
    if (!infoOpen) { setRevealed([]); return }
    setRevealed(POPUP_PARAGRAPHS.map(() => 0))
    const lengths = POPUP_PARAGRAPHS.map((p) => p.length)
    const total = lengths.reduce((a, b) => a + b, 0)
    let current = 0
    const interval = setInterval(() => {
      current += 3
      const rev = []
      let acc = 0
      for (let i = 0; i < lengths.length; i++) {
        rev.push(Math.max(0, Math.min(current - acc, lengths[i] ?? 0)))
        acc += lengths[i] ?? 0
      }
      setRevealed(rev)
      if (current >= total) clearInterval(interval)
    }, 12)
    return () => clearInterval(interval)
  }, [infoOpen])

  const onStageClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    navigate(e.clientX - rect.left < rect.width / 2 ? -1 : 1)
  }, [navigate])

  const current = WORKS[workIndex]
  const cursorSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 24' fill='none'><path d='M1 1L1 18.5L5.5 14L10 22L13 20.5L8.5 12.5L14.5 12L1 1Z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round'/></svg>"

  return (
    <main
      ref={rootRef}
      className="sv-container relative w-full overflow-hidden text-white"
      style={{
        background: '#0f0f3d',
        cursor: `url("${cursorSvg}") 4 2, auto`,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Studio Veritas',
            description: 'Good strategy starts with hard questions. Studio Veritas is a creative strategy studio that finds the truth that makes brands matter.',
            slogan: 'The truth will set you free',
            email: CONTACT_EMAIL,
            areaServed: 'Worldwide',
            makesOffer: [
              { '@type': 'Offer', name: CONTACT_PANELS.companies.heading, description: CONTACT_PANELS.companies.body.replace(/\n/g, ' ') },
              { '@type': 'Offer', name: CONTACT_PANELS.agencies.heading, description: CONTACT_PANELS.agencies.body.replace(/\n/g, ' ') },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Studio Veritas — Selected work',
            itemListElement: WORKS.map((w, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'CreativeWork',
                name: w.name,
                about: w.client,
                description: w.line,
              },
            })),
          }),
        }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        .sv-root * { cursor: url("${cursorSvg}") 4 2, auto !important; }
        .sv-container { height: 100vh; }
        @supports (height: 100dvh) { .sv-container { height: 100dvh; } }
        .sv-root button, .sv-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .sv-worklist { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .sv-worklist::-webkit-scrollbar { display: none; }
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
        .sv-case-copy { font-size: 18pt; }
        @media (min-width: 768px) { .sv-case-copy { font-size: 28px; } }
        .sv-center-logo { max-height: 50px; }
        @media (min-width: 768px) { .sv-center-logo { max-height: 75px; } }
        @media (min-width: 1024px) { .sv-center-logo { max-height: 100px; } }
        .sv-topleft-icon { height: 33px; }
        @media (min-width: 768px) { .sv-topleft-icon { height: 42px; } }
        .sv-safe-top-menu { top: max(56px, calc(env(safe-area-inset-top) + 40px)); }
        @media (min-width: 768px) { .sv-safe-top-menu { top: max(76px, calc(env(safe-area-inset-top) + 44px)); } }
        @media (max-width: 480px) {
          .sv-contact-row { flex-direction: column !important; align-items: flex-end !important; gap: 4px !important; }
        }
        @keyframes sv-drift { 0%,100% { transform: scale(1.0) translate(0,0); } 50% { transform: scale(1.04) translate(-0.6%,-0.4%); } }
        @keyframes sv-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .sv-typewriter-cursor::after { content: '\\2588'; animation: sv-blink 0.8s step-end infinite; margin-left: 2px; }
      `}</style>

      {/* SEO / LLM-readable content — visually hidden, but real text in the DOM so
          search engines and LLM crawlers can read the studio's story, work, and
          contact info without simulating clicks, hovers, or carousel navigation. */}
      <section className="sv-sr-only">
        <h1>Studio Veritas — Creative strategy studio. The truth will set you free.</h1>
        {POPUP_PARAGRAPHS.map((p, i) => (
          <p key={i}>{p.replace(/\n/g, ' ')}</p>
        ))}
        <h2>Selected work</h2>
        <ul>
          {WORKS.map((w) => (
            <li key={w.name}>
              {w.client} ({w.name}): {w.line}
            </li>
          ))}
        </ul>
        <h2>{CONTACT_PANELS.companies.heading}</h2>
        <p>{CONTACT_PANELS.companies.body.replace(/\n/g, ' ')}</p>
        <h2>{CONTACT_PANELS.agencies.heading}</h2>
        <p>{CONTACT_PANELS.agencies.body.replace(/\n/g, ' ')}</p>
        <p>
          Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>

      <div className="sv-root absolute inset-0">
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          {mode === 'home' ? (
            <div className="absolute inset-0 overflow-hidden" style={{ background: '#0f0f3d' }}>
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
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,15,61,0.55), rgba(15,15,61,0.05) 45%, rgba(15,15,61,0.35))' }} />
            </div>
          ) : (
            <div className="absolute inset-0" style={{ background: '#000' }} onClick={onStageClick}>
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={workIndex}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <WorkArt work={current} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.4))' }} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* GRAIN */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100, mixBlendMode: 'overlay' }}>
          <svg width="100%" height="100%" style={{ opacity: 0.18 }}>
            <filter id="sv-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#sv-grain)" />
          </svg>
        </div>

        {/* TOP-LEFT ICON (replaces the wordmark; same click behavior) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => setInfoOpen((v) => !v)}
          className="absolute sv-safe-top sv-safe-left hover:opacity-70 transition-opacity p-2 -m-2 touch-manipulation"
          style={{ zIndex: 40 }}
          aria-label="Studio Veritas — about"
        >
          <img src={ICON_SRC_BLACK} alt="Studio Veritas" className="sv-topleft-icon" style={{ width: 'auto', display: 'block' }} draggable={false} />
        </motion.button>

        {/* TOP-RIGHT: HAMBURGER MENU */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => setMenuOpen((v) => !v)}
          onMouseEnter={() => setHoverHamburger(true)}
          onMouseLeave={() => setHoverHamburger(false)}
          className="absolute sv-safe-top sv-safe-right flex flex-col items-end justify-center gap-[5px] p-2 -m-2 touch-manipulation"
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

        {/* CENTER TITLE (home only) */}
        {mode === 'home' && (
          <div className="absolute inset-0 flex items-center justify-center px-6" style={{ zIndex: 30, pointerEvents: 'none' }}>
            <div
              style={{ pointerEvents: 'auto' }}
              className="text-center select-none"
              onMouseEnter={() => setTitleHover(true)}
              onMouseLeave={() => setTitleHover(false)}
            >
              <AnimatePresence mode="wait">
                {titleHover ? (
                  <motion.p
                    key="tagline"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.01em' }}
                    className="text-[24px] md:text-[30px] lg:text-[36px] font-medium text-black"
                  >
                    GROWTH IN TRUTH
                  </motion.p>
                ) : (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Wordmark className="sv-center-logo" src={LOGO_SRC_BLACK} />
                    <p
                      style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '18pt' }}
                      className="mt-3 font-medium text-black"
                    >
                      Freelance team for strategy + design + innovation
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* WORK MODE: active client line */}
        {mode === 'work' && (
          <div className="absolute inset-0 flex items-center justify-center px-6" style={{ zIndex: 20, pointerEvents: 'none' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={workIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-center max-w-3xl"
              >
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, letterSpacing: '0.35em' }} className="text-xs md:text-sm text-white/70 uppercase mb-3">{current?.client}</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }} className="sv-case-copy text-white">{current?.line}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* INFO POPUP */}
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="absolute top-12 left-4 md:top-20 md:left-10 w-[calc(100%-2rem)] max-w-[560px] max-h-[min(75vh,560px)] rounded-md p-5 md:p-7 overflow-y-auto shadow-2xl"
              style={{ zIndex: 50, background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <button
                onClick={() => setInfoOpen(false)}
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
                Studio Veritas
              </p>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", WebkitOverflowScrolling: 'touch' }} className="text-[13px] md:text-sm text-white/90 leading-relaxed space-y-4 pr-6">
                {POPUP_PARAGRAPHS.map((p, idx) => {
                  const chars = revealed?.[idx] ?? 0
                  const isActive = chars > 0 && chars < p.length
                  return (
                    <p key={idx} className={`whitespace-pre-line transition-colors hover:text-white ${chars === 0 ? 'opacity-0' : 'opacity-100'}`}>
                      {p.slice(0, chars)}
                      {isActive && <span className="sv-typewriter-cursor" />}
                    </p>
                  )
                })}
              </div>
              <div style={{ fontFamily: "'Chakra Petch', sans-serif" }} className="mt-6 text-sm font-bold text-white tracking-wider">SV</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute sv-safe-bottom sv-safe-left sv-safe-right flex items-end justify-between gap-4"
          style={{ zIndex: 40 }}
        >
          <div className="flex flex-col gap-3 min-w-0 flex-shrink">
            {mode === 'work' && (
              <div className="flex items-center gap-2 text-white">
                <button onClick={() => navigate(-1)} className="text-lg hover:opacity-60 transition-opacity p-2 -m-2" aria-label="Previous work">◀</button>
                <button onClick={() => navigate(1)} className="text-lg hover:opacity-60 transition-opacity p-2 -m-2" aria-label="Next work">▶</button>
              </div>
            )}
            <nav className="sv-worklist flex flex-nowrap md:flex-wrap items-center gap-x-3 gap-y-1.5 md:gap-x-4 md:gap-y-2 overflow-x-auto md:overflow-visible max-w-[68vw] md:max-w-[74vw] min-w-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }} aria-label="Case studies">
              <button
                onClick={() => setWorkMenuOpen((v) => !v)}
                className="shrink-0 text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase transition-colors p-2 -m-2"
                style={{ color: workMenuOpen ? '#5683DD' : '#000000', fontFamily: "'IBM Plex Mono', monospace" }}
                aria-expanded={workMenuOpen}
                aria-label="Toggle case studies list"
              >
                Work
              </button>
              {workMenuOpen && WORKS.map((w, idx) => {
                const active = mode === 'work' && idx === workIndex
                return (
                  <button
                    key={w.name}
                    onClick={() => (active ? goHome() : openWork(idx))}
                    className="shrink-0 text-[11px] md:text-xs font-medium tracking-[0.12em] py-1.5 md:py-0.5 transition-colors"
                    style={{ color: active ? '#5683DD' : 'rgba(255,255,255,0.9)', fontFamily: "'IBM Plex Mono', monospace" }}
                    aria-label={`${w.client}: ${w.line}`}
                    aria-current={active ? 'true' : undefined}
                  >
                    {w.name}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="sv-contact-row flex flex-row items-center gap-3 md:gap-4 flex-shrink-0">
            {['companies', 'agencies'].map((key) => {
              const active = contactPanel === key
              return (
                <button
                  key={key}
                  onClick={() => setContactPanel((v) => (v === key ? null : key))}
                  className="text-[11px] md:text-xs font-medium tracking-[0.12em] uppercase hover:opacity-70 transition-opacity whitespace-nowrap p-2 -m-2"
                  style={{ color: active ? '#5683DD' : '#000000', fontFamily: "'IBM Plex Mono', monospace" }}
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
          </div>
        </motion.div>

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

        {/* CONTACT PANEL */}
        <AnimatePresence>
          {contactPanel && (
            <motion.div
              key={contactPanel}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="absolute bottom-20 right-4 md:bottom-28 md:right-10 w-[calc(100%-2rem)] max-w-[300px] max-h-[55%] rounded-md p-5 md:p-7 overflow-y-auto shadow-2xl"
              style={{ zIndex: 50, background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
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
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", WebkitOverflowScrolling: 'touch' }} className="whitespace-pre-line text-[13px] md:text-sm text-white/90 leading-relaxed pr-6">
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
      </div>
    </main>
  )
}

export default Experience
