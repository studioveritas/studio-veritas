'use client'

// Case study (full-screen format, Nov 2026).
//
// The case study's master image fills the screen, fixed behind the page with a
// slow drift. On very wide screens it stops at MAX_W (1920px): beyond that the
// edges are black, with a hairline marking the image edge.
// Over it, the page scrolls: the title block at the foot of the first screen,
// then each section of copy in a black pop-out (spring entrance, typed out as it
// comes into view), the extra images between them, and The Results.
// Headings in the pop-outs use the case study's own `accent` colour.
//
// The Work page is unchanged: its tiles still link to /work/<slug>,
// zooming into the master image on the way (components/case-zoom.js). Moving on
// to another case study crossfades master image to master image. Arriving either
// way, the master image shows at once instead of fading in.
// Everything comes from components/work-data.js (see CASE-STUDIES.md):
//   hero / heroPosition       the master image and which part stays in view
//   portrait                  used as the master on phones held upright
//   accent                    colour of the headings (falls back to Veritas blue)
//   positioning               optional line shown in its own pop-out after Truth
//   resultStat                optional { value, label } headline figure in The Results
// The full copy is always in the page for screen readers and search engines.

import { useEffect, useRef, useState, useCallback } from 'react'
import { SiteShell } from './site-shell'
import { getCaseStudy, getNeighbours, caseSubheading, caseTitle } from './work-data'
import { CASE_STUDY_HEROES } from './case-images'
import { paragraphs } from './typed-sections'
import { zoomArrivalScript, clearZoomArrival, clearZoomOverlays, crossfadeToCaseStudy, HERO_SHADE, SCROLLED_SHADE } from './case-zoom'

const MONO = "'IBM Plex Mono', monospace"
const DISPLAY = "'Chakra Petch', sans-serif"
const MAX_W = 1920
const SV_BLUE = '#5683DD'

const TYPE_CHARS = 3 // the site's typewriter speed
const TYPE_MS = 12

// `images` entries are a path ('/work/<slug>/image-1.jpg') or { src, alt }.
const imageList = (work) =>
  (work.caseStudy.images || []).slice(0, 3).map((im, i) =>
    typeof im === 'string' ? { src: im, alt: `${work.client}: image ${i + 1}` } : { alt: `${work.client}: image ${i + 1}`, ...im }
  )

const isResults = (s) => /^the results$/i.test(s.heading)

/* ------------------------------------------------------------ reveal on view */

function useInView(ref, threshold = 0.2) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (!('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen, threshold])
  return seen
}

// Types `texts` (an array of strings) one after another once `run` is true.
function useTyped(texts, run) {
  const total = texts.reduce((n, t) => n + t.length, 0)
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setTyped(total); return }
    if (typed >= total) return
    const t = setTimeout(() => setTyped((c) => Math.min(total, c + TYPE_CHARS)), TYPE_MS)
    return () => clearTimeout(t)
  }, [run, typed, total])
  let offset = 0
  return texts.map((t) => {
    const start = offset
    offset += t.length
    const n = Math.max(0, Math.min(t.length, typed - start))
    return { text: t.slice(0, n), active: run && typed > start && typed <= offset && typed < total }
  })
}

const Caret = () => <span className="sv-cx-caret" aria-hidden="true" />

/* ------------------------------------------------------------ pop-outs */

function Popout({ heading, body, list, side = 'left' }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const paras = paragraphs(body)
  const items = list || []
  const lines = useTyped([...paras, ...items], seen)
  const shownParas = lines.slice(0, paras.length)
  const shownItems = lines.slice(paras.length)
  return (
    <section ref={ref} className={`sv-cx-pop sv-cx-${side}`} data-in={seen ? '1' : '0'}>
      <h2 className="sv-cx-h">{heading}</h2>
      {/* whole copy for screen readers and search; typed copy for sighted readers */}
      <div className="sv-sr-only">
        {paras.map((p, i) => <p key={i}>{p}</p>)}
        {items.length > 0 && <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>}
      </div>
      <div aria-hidden="true">
        {shownParas.map((l, i) => (
          <p key={i} className="sv-cx-p">{l.text}{l.active && <Caret />}</p>
        ))}
        {items.length > 0 && (
          <ul className="sv-cx-list">
            {shownItems.map((l, i) => l.text && (
              <li key={i}><span className="n">{String(i + 1).padStart(2, '0')}</span><span>{l.text}{l.active && <Caret />}</span></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function Results({ section, stat }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const items = section.list || []
  const paras = paragraphs(section.body)
  const lines = useTyped([...paras, ...items], seen)
  return (
    <section ref={ref} className="sv-cx-pop sv-cx-wide" data-in={seen ? '1' : '0'}>
      <h2 className="sv-cx-h">{section.heading}</h2>
      {stat && (
        <div className="sv-cx-stat">
          <b>{stat.value}</b>
          {stat.label && <span>{stat.label}</span>}
        </div>
      )}
      <div className="sv-sr-only">
        {paras.map((p, i) => <p key={i}>{p}</p>)}
        {items.length > 0 && <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>}
      </div>
      <div aria-hidden="true">
        {lines.slice(0, paras.length).map((l, i) => <p key={i} className="sv-cx-p">{l.text}{l.active && <Caret />}</p>)}
        {items.length > 0 && (
          <ul className="sv-cx-list sv-cx-rlist">
            {lines.slice(paras.length).map((l, i) => (
              <li key={i} style={{ visibility: l.text ? 'visible' : 'hidden' }}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span>{l.text || items[i]}{l.active && <Caret />}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function Figure({ im, onOpen, className = '' }) {
  const ref = useRef(null)
  const seen = useInView(ref, 0.15)
  return (
    <figure ref={ref} className={`sv-cx-fig ${className}`} data-in={seen ? '1' : '0'}>
      <button type="button" onClick={() => onOpen(im)} aria-label={`Enlarge: ${im.alt}`}>
        <img src={im.src} alt={im.alt} loading="lazy" draggable={false} />
      </button>
    </figure>
  )
}

function Arrow({ dir, target }) {
  const prev = dir === 'prev'
  const shape = prev ? '15,1.5 15,18.5 1.5,10' : '1,1.5 1,18.5 14.5,10'
  const icon = (
    <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true">
      <polygon points={shape} fill={target ? '#fff' : 'none'} stroke="#fff" strokeWidth={target ? 0 : 1.5} strokeLinejoin="round" />
    </svg>
  )
  const cls = `sv-cx-arrow sv-cx-arrow-${dir}`
  if (!target) return <span className={cls} aria-hidden="true" data-state="end">{icon}</span>
  return (
    <a className={cls} href={`/work/${target.slug}`} onClick={(e) => crossfadeToCaseStudy(e, target)} aria-label={`${prev ? 'Previous' : 'Next'} case study: ${target.client}`}>
      {icon}
    </a>
  )
}

/* ------------------------------------------------------------ page */

export function CaseStudy({ slug }) {
  const work = getCaseStudy(slug)
  const { prev, next } = getNeighbours(slug)
  const cs = work?.caseStudy

  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [zoom, setZoom] = useState(null)

  const backToExperience = useCallback(() => { window.location.href = '/work' }, [])

  // Entrance, scroll state, and white eye / footer triangle over the dark page.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.svDarkBottom = '1'
    const raf = requestAnimationFrame(() => setReady(true))
    // the zoom's hand-off is done once the page has painted
    const clear = setTimeout(clearZoomArrival, 1200)
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    // Back from the next case study can restore this page as it was left, mid-crossfade
    const onShow = (e) => {
      if (!e.persisted) return
      clearZoomOverlays()
      document.querySelectorAll('.sv-cx-inner, .sv-cx-close, .sv-cx-arrow').forEach((el) => el.getAnimations().forEach((an) => an.cancel()))
    }
    window.addEventListener('pageshow', onShow)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(clear)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pageshow', onShow)
      delete root.dataset.svDarkBottom
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return
      if (document.querySelector('.av-panel, [data-sv-modal="open"]')) return
      const to = e.key === 'ArrowLeft' ? prev : e.key === 'ArrowRight' ? next : null
      if (to && !crossfadeToCaseStudy(null, to)) window.location.href = `/work/${to.slug}`
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  if (!work || !cs) return null

  // A file path (e.g. /work/ketel-one/hero.jpg in /public) or a key in case-images.js.
  const master = cs.hero?.startsWith('/') ? cs.hero : CASE_STUDY_HEROES[cs.hero]
  const masterPos = cs.masterPosition || '50% 50%'
  const portrait = cs.masterPortrait || work.portrait
  const accent = cs.accent || SV_BLUE
  const images = imageList(work)
  const body = cs.sections.filter((s) => !isResults(s))
  const results = cs.sections.find(isResults)
  const discipline = (work.tags || []).join(' · ')

  // Running order: sections alternate left/right; the positioning line follows
  // Truth; the first image follows the first section; the others sit as a pair
  // before The Results.
  const blocks = []
  let side = 0
  body.forEach((s, i) => {
    blocks.push({ type: 'pop', key: s.heading, s, side: side++ % 2 ? 'right' : 'left' })
    if (/^truth$/i.test(s.heading) && cs.positioning) {
      blocks.push({ type: 'pop', key: 'positioning', s: { heading: 'The Big Idea', body: cs.positioning }, side: side++ % 2 ? 'right' : 'left' })
    }
    if (i === 0 && images[0]) blocks.push({ type: 'fig', key: 'fig0', im: images[0] })
  })
  if (images.length > 1) blocks.push({ type: 'pair', key: 'pair', ims: images.slice(1) })
  if (results) blocks.push({ type: 'results', key: 'results', s: results })

  return (
    <SiteShell pageKey="case" onEscape={backToExperience}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: `${work.client} — ${caseSubheading(work)}`,
            about: work.client,
            creator: { '@type': 'Organization', name: 'Studio Veritas' },
            text: [cs.intro, ...cs.sections.map((s) => `${s.heading}: ${s.body || (s.list || []).join(' ')}`)]
              .filter(Boolean)
              .join(' '),
          }),
        }}
      />
      <style>{`
        .sv-cx {
          --accent: ${accent};
          --maxw: ${MAX_W}px;
          --body: clamp(14px, 1.15vw, 17px);
          --body-lh: 1.55;
          --head: clamp(14px, 1.05vw, 16px);
          --gutter: clamp(20px, 4vw, 72px);
          font-family: ${MONO}; color: #fff;
        }
        /* black page, master image capped at --maxw, hairline at its edge */
        .sv-cx-black { position: fixed; inset: 0; background: #000; z-index: 0; }
        .sv-cx-stage {
          position: fixed; top: 0; bottom: 0; left: 50%; z-index: 0;
          width: min(100vw, var(--maxw)); transform: translateX(-50%);
          overflow: hidden; background: #000;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .sv-cx-stage picture, .sv-cx-stage img { position: absolute; inset: 0; width: 100%; height: 100%; }
        .sv-cx-stage img {
          object-fit: cover; object-position: ${masterPos};
          transform-origin: 60% 40%;
          animation: sv-cx-drift 40s ease-in-out infinite alternate;
          opacity: 0; transition: opacity 1.1s ease;
        }
        .sv-cx[data-ready='1'] .sv-cx-stage img { opacity: 1; }
        /* arriving by the zoom from Experience: the master is already in place */
        html[data-sv-zoom='1'] .sv-cx-stage img { opacity: 1; transition: none; }
        /* …and the nav bar stays put instead of fading in with the new page */
        html[data-sv-zoom='1'] .sv-nav { opacity: 1 !important; transform: translateX(-50%) !important; }
        @keyframes sv-cx-drift { 0% { transform: scale(1.02); } 100% { transform: scale(1.09) translate(-1.2%, -0.8%); } }
        .sv-cx-shade {
          position: absolute; inset: 0; transition: background 0.5s;
          background: ${HERO_SHADE};
        }
        .sv-cx[data-scrolled='1'] .sv-cx-shade { background: ${SCROLLED_SHADE}; }

        .sv-cx-inner { position: relative; z-index: 1; width: min(100vw, var(--maxw)); margin: 0 auto; }

        /* first screen: title block at the foot */
        .sv-cx-hero {
          position: relative; min-height: 100vh; min-height: 100svh;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: calc(var(--sv-nav-top) + var(--sv-nav-h) + 40px) var(--gutter) clamp(96px, 12vh, 140px);
        }
        .sv-cx-kicker { font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; opacity: 0.85; margin: 0 0 16px; }
        .sv-cx-title { margin: 0; font-weight: 600; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.02em; font-size: clamp(40px, 6.6vw, 112px); }
        .sv-cx-sub { margin: 12px 0 0; font-family: ${DISPLAY}; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); font-size: clamp(18px, 1.9vw, 30px); }
        .sv-cx-intro { margin: 18px 0 0; max-width: 58ch; font-size: var(--body); line-height: var(--body-lh); opacity: 0.92; }
        .sv-cx-meta { display: flex; flex-wrap: wrap; gap: 12px clamp(24px, 4vw, 56px); margin: 26px 0 0; font-size: 12px; }
        .sv-cx-meta dt { opacity: 0.55; letter-spacing: 0.2em; text-transform: uppercase; font-size: 10px; margin-bottom: 6px; }
        .sv-cx-meta dd { margin: 0; }
        .sv-cx-cue { position: absolute; right: var(--gutter); bottom: clamp(96px, 12vh, 140px); display: flex; align-items: center; gap: 10px; font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; opacity: 0.75; }
        .sv-cx-cue i { display: block; width: 1px; height: 40px; background: #fff; transform-origin: top; animation: sv-cx-cue 1.8s ease-in-out infinite; }
        @keyframes sv-cx-cue { 0% { transform: scaleY(0); } 50% { transform: scaleY(1); } 100% { transform: scaleY(0); transform-origin: bottom; } }
        .sv-cx-rv { opacity: 0; transform: translateY(24px); transition: opacity 1s ease, transform 1s cubic-bezier(0.77, 0, 0.18, 1); }
        .sv-cx[data-ready='1'] .sv-cx-rv { opacity: 1; transform: none; }
        .sv-cx[data-ready='1'] .d2 { transition-delay: 0.12s; } .sv-cx[data-ready='1'] .d3 { transition-delay: 0.24s; }
        .sv-cx[data-ready='1'] .d4 { transition-delay: 0.36s; } .sv-cx[data-ready='1'] .d5 { transition-delay: 0.48s; }

        /* the pop-outs */
        .sv-cx-body { display: grid; gap: 28px; padding: 6vh var(--gutter) 0; }
        .sv-cx-pop {
          width: min(100%, 820px); background: #000; border: 1px solid rgba(255,255,255,0.16); border-radius: 18px;
          padding: clamp(24px, 3.2vw, 52px); box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          opacity: 0; transform: translateY(30px) scale(0.94);
          transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sv-cx-pop[data-in='1'], .sv-cx-fig[data-in='1'] { opacity: 1; transform: none; }
        .sv-cx-right { margin-left: auto; }
        .sv-cx-wide { width: 100%; }
        .sv-cx-h { margin: 0 0 18px; font-weight: 600; font-size: var(--head); letter-spacing: 0.24em; text-transform: uppercase; color: var(--accent); }
        .sv-cx-p { margin: 0; max-width: 62ch; font-size: var(--body); line-height: var(--body-lh); min-height: 1.55em; }
        .sv-cx-p + .sv-cx-p { margin-top: 1em; }
        .sv-cx-list { list-style: none; margin: 1em 0 0; padding: 0; }
        .sv-cx-pop > div > .sv-cx-list:first-child { margin-top: 0; }
        .sv-cx-list li { display: grid; grid-template-columns: 2.4em 1fr; padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.14); font-size: var(--body); line-height: var(--body-lh); }
        .sv-cx-list li:last-child { border-bottom: 1px solid rgba(255,255,255,0.14); }
        .sv-cx-list .n { color: var(--accent); }
        .sv-cx-stat { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 16px clamp(16px, 3vw, 40px); margin: 0 0 28px; }
        .sv-cx-stat b { font-family: ${DISPLAY}; font-weight: 600; line-height: 0.95; font-size: clamp(40px, 5.2vw, 84px); }
        .sv-cx-stat span { max-width: 32ch; font-size: var(--body); line-height: var(--body-lh); opacity: 0.75; padding-bottom: 6px; }
        .sv-cx-caret::after { content: '\\2588'; animation: sv-cx-blink 0.8s step-end infinite; margin-left: 1px; }
        @keyframes sv-cx-blink { 50% { opacity: 0; } }

        /* images */
        .sv-cx-fig {
          margin: 0; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); background: #000;
          opacity: 0; transform: translateY(30px) scale(0.96);
          transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sv-cx-fig button { display: block; width: 100%; height: 100%; padding: 0; border: 0; background: none; }
        .sv-cx-fig img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .sv-cx-fig button:hover img { transform: scale(1.03); }
        .sv-cx-fig button:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
        .sv-cx-pair { display: grid; grid-template-columns: 1.25fr 1fr; gap: 28px; }
        .sv-cx-pair.n1 { grid-template-columns: 1fr; }

        /* next case study */
        .sv-cx-next { display: block; margin-top: 12vh; padding: 12vh var(--gutter) 18vh; border-top: 1px solid rgba(255,255,255,0.14); color: #fff; text-decoration: none; }
        .sv-cx-next small { font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; opacity: 0.6; }
        .sv-cx-next strong { display: block; margin-top: 14px; font-weight: 600; text-transform: uppercase; font-size: clamp(30px, 5vw, 72px); transition: color 0.3s; }
        .sv-cx-next:hover strong, .sv-cx-next:focus-visible strong { color: var(--accent); }
        .sv-cx-next:focus-visible { outline: none; }

        /* close + arrows */
        .sv-cx-close {
          position: fixed; z-index: 40; right: max(16px, env(safe-area-inset-right));
          top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 14px);
          width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          background: #000; border: 1px solid rgba(255,255,255,0.3); color: #fff; transition: background 0.3s, border-color 0.3s;
        }
        .sv-cx-close:hover, .sv-cx-close:focus-visible { background: ${SV_BLUE}; border-color: ${SV_BLUE}; outline: none; }
        .sv-cx-arrow { position: fixed; z-index: 40; top: 50%; transform: translateY(-50%); display: inline-flex; padding: 12px; line-height: 0; transition: opacity 0.2s; filter: drop-shadow(0 1px 6px rgba(0,0,0,0.6)); }
        a.sv-cx-arrow:hover, a.sv-cx-arrow:focus-visible { opacity: 0.6; outline: none; }
        .sv-cx-arrow-prev { left: max(4px, env(safe-area-inset-left)); }
        .sv-cx-arrow-next { right: max(4px, env(safe-area-inset-right)); }

        /* enlarged image */
        .sv-cx-zoom { position: fixed; inset: 0; z-index: 55; display: flex; align-items: center; justify-content: center; padding: 5vh 5vw; background: rgba(0,0,0,0.88); }
        .sv-cx-zoom img { max-width: 100%; max-height: 100%; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; }
        .sv-cx-zoom button { position: absolute; top: 16px; right: 18px; padding: 8px; background: none; border: 0; color: #fff; font-size: 20px; line-height: 1; }
        .sv-cx-zoom button:hover, .sv-cx-zoom button:focus-visible { color: ${SV_BLUE}; outline: none; }

        @media (min-width: 768px) {
          .sv-cx-close { right: max(40px, env(safe-area-inset-right)); }
          .sv-cx-arrow-prev { left: max(14px, env(safe-area-inset-left)); }
          .sv-cx-arrow-next { right: max(14px, env(safe-area-inset-right)); }
        }
        @media (max-width: 767px) {
          .sv-cx-cue { display: none; }
          .sv-cx-right { margin-left: 0; }
          .sv-cx-pair { grid-template-columns: 1fr; }
          .sv-cx-arrow { top: auto; bottom: max(80px, calc(env(safe-area-inset-bottom) + 64px)); transform: none; }
          /* on phones the X joins the arrows at the foot, clear of the nav and Ask Veritas */
          .sv-cx-close { top: auto; right: auto; left: 50%; transform: translateX(-50%); bottom: max(76px, calc(env(safe-area-inset-bottom) + 60px)); }
          .sv-cx-hero { padding-bottom: 120px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sv-cx-stage img, .sv-cx-cue i, .sv-cx-caret::after { animation: none; }
          .sv-cx-pop, .sv-cx-fig, .sv-cx-rv { transition: none; }
        }
      `}</style>

      <script dangerouslySetInnerHTML={{ __html: zoomArrivalScript(slug) }} />
      <article className="sv-cx" data-ready={ready ? '1' : '0'} data-scrolled={scrolled ? '1' : '0'} aria-labelledby="sv-cx-title">
        <div className="sv-cx-black" aria-hidden="true" />
        <div className="sv-cx-stage" aria-hidden="true">
          <picture>
            {portrait && <source media="(max-width: 767px) and (orientation: portrait)" srcSet={portrait} />}
            <img src={master} alt="" fetchPriority="high" draggable={false} />
          </picture>
          <div className="sv-cx-shade" />
        </div>

        <div className="sv-cx-inner">
          <header className="sv-cx-hero">
            <p className="sv-cx-kicker sv-cx-rv">{work.client}{discipline ? ` — ${discipline}` : ''}</p>
            <h1 id="sv-cx-title" className="sv-cx-title sv-cx-rv d2">{caseTitle(work)}</h1>
            <p className="sv-cx-sub sv-cx-rv d3">{caseSubheading(work)}</p>
            {cs.intro && <p className="sv-cx-intro sv-cx-rv d4">{cs.intro}</p>}
            <dl className="sv-cx-meta sv-cx-rv d5">
              <div><dt>Client</dt><dd>{work.client}</dd></div>
              {cs.positioning && <div><dt>Platform</dt><dd>{cs.positioning.replace(/[“”"]/g, '')}</dd></div>}
              {discipline && <div><dt>Discipline</dt><dd>{discipline}</dd></div>}
            </dl>
            <div className="sv-cx-cue" aria-hidden="true">Scroll<i /></div>
          </header>

          <div className="sv-cx-body">
            {blocks.map((b) => {
              if (b.type === 'pop') return <Popout key={b.key} heading={b.s.heading} body={b.s.body} list={b.s.list} side={b.side} />
              if (b.type === 'fig') return <Figure key={b.key} im={b.im} onOpen={setZoom} />
              if (b.type === 'pair')
                return (
                  <div key={b.key} className={`sv-cx-pair n${b.ims.length}`}>
                    {b.ims.map((im) => <Figure key={im.src} im={im} onOpen={setZoom} />)}
                  </div>
                )
              return <Results key={b.key} section={b.s} stat={cs.resultStat} />
            })}
          </div>

          {next ? (
            <a className="sv-cx-next" href={`/work/${next.slug}`} onClick={(e) => crossfadeToCaseStudy(e, next)}>
              <small>Next case study</small>
              <strong>{next.name} →</strong>
            </a>
          ) : (
            <a className="sv-cx-next" href="/work">
              <small>That’s the last one</small>
              <strong>Back to Work →</strong>
            </a>
          )}
        </div>

        <a className="sv-cx-close" href="/work" aria-label="Close case study, back to Work">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" /></svg>
        </a>
        <nav aria-label="Case studies">
          <Arrow dir="prev" target={prev} />
          <Arrow dir="next" target={next} />
        </nav>

        {zoom && (
          <div className="sv-cx-zoom" role="dialog" aria-label={zoom.alt} data-sv-modal="open" onClick={(e) => e.target === e.currentTarget && setZoom(null)}>
            <img src={zoom.src} alt={zoom.alt} />
            <button type="button" onClick={() => setZoom(null)} aria-label="Close image" autoFocus>✕</button>
          </div>
        )}
      </article>
    </SiteShell>
  )
}

export default CaseStudy
