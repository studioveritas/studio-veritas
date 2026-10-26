'use client'

// Case study: the project photo fills the card, with a black title box (name +
// subheading + X back to Experience) and a white box of the case study copy on
// the left. The arrows step to the previous/next published case study: filled
// when there is one that way, outline when there isn't (as in the design, where
// the first case study shows an outline left arrow).
// Sizes are taken from the design at 1920x1080 and scale down with the viewport.
//
// The copy reveals in steps: the intro line and the Truth show first, MORE types
// out the rest (typewriter, as elsewhere on the site), then MORE IMAGERY shows
// the case study's `images` (one to three) in a grid inside the same box.
// The full copy is always in the page for screen readers and search engines.

import { useEffect, useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SiteShell } from './site-shell'
import { getCaseStudy, getNeighbours, caseSubheading, caseTitle } from './work-data'
import { CASE_STUDY_HEROES } from './case-images'

const MONO = "'IBM Plex Mono', monospace"

function Arrow({ dir, target }) {
  const prev = dir === 'prev'
  const shape = prev ? '15,1.5 15,18.5 1.5,10' : '1,1.5 1,18.5 14.5,10'
  const icon = (
    <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true">
      <polygon
        points={shape}
        fill={target ? '#fff' : 'none'}
        stroke="#fff"
        strokeWidth={target ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  )
  const cls = `sv-cs-arrow sv-cs-arrow-${dir}`
  if (!target) {
    return (
      <span className={cls} aria-hidden="true" data-state="end">
        {icon}
      </span>
    )
  }
  return (
    <a
      className={cls}
      href={`/experience/${target.slug}`}
      aria-label={`${prev ? 'Previous' : 'Next'} case study: ${target.client}`}
      data-state="link"
    >
      {icon}
    </a>
  )
}

const TYPE_CHARS = 3 // characters per tick: the site's typewriter speed
const TYPE_MS = 12

function Section({ s }) {
  return (
    <section className="sv-cs-section">
      <h2>{s.heading}</h2>
      {s.body && <p>{s.body}</p>}
      {s.list && (
        <ul>
          {s.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

// Types the given sections out, heading by heading, line by line.
function TypedSections({ sections, onTick, onDone, skipRef }) {
  const parts = []
  sections.forEach((s, si) => {
    parts.push({ si, kind: 'h', text: s.heading })
    if (s.body) parts.push({ si, kind: 'p', text: s.body })
    ;(s.list || []).forEach((t) => parts.push({ si, kind: 'li', text: t }))
  })
  const total = parts.reduce((n, p) => n + p.text.length, 0)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (typed >= total) { onDone(); return }
    const t = setTimeout(() => setTyped((c) => Math.min(total, c + TYPE_CHARS)), TYPE_MS)
    return () => clearTimeout(t)
  }, [typed, total, onDone])
  useEffect(() => { onTick() }, [typed, onTick])
  useEffect(() => { skipRef.current = () => setTyped(total) }, [skipRef, total])

  let offset = 0
  const shown = parts.map((p) => {
    const start = offset
    offset += p.text.length
    const n = Math.max(0, Math.min(p.text.length, typed - start))
    // the caret stays on a line until the next one starts, so it never blinks out between lines
    return { ...p, n, active: typed > start && typed <= offset && typed < total }
  })
  const text = (p) => (
    <>
      {p.text.slice(0, p.n)}
      {p.active && <span className="sv-cs-caret" />}
    </>
  )
  return (
    <div aria-hidden="true">
      {sections.map((s, si) => {
        const mine = shown.filter((p) => p.si === si)
        if (mine[0].n === 0) return null
        const items = mine.filter((p) => p.kind === 'li')
        return (
          <section className="sv-cs-section" key={s.heading}>
            {mine.filter((p) => p.kind !== 'li').map((p, k) =>
              p.kind === 'h' ? <h2 key={k}>{text(p)}</h2> : <p key={k}>{text(p)}</p>
            )}
            {items.length > 0 && (
              <ul>
                {items.filter((p) => p.n > 0).map((p, k) => <li key={k}>{text(p)}</li>)}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}

// `images` entries are a path ('/work/<slug>/image-1.jpg') or { src, alt }.
const imageList = (work) =>
  (work.caseStudy.images || []).slice(0, 3).map((im, i) =>
    typeof im === 'string' ? { src: im, alt: `${work.client}: image ${i + 1}` } : { alt: `${work.client}: image ${i + 1}`, ...im }
  )

export function CaseStudy({ slug }) {
  const work = getCaseStudy(slug)
  const { prev, next } = getNeighbours(slug)
  const cs = work?.caseStudy

  // When the copy is longer than its box, fade the last line until the reader
  // reaches the end, so it's clear there is more to scroll.
  const bodyRef = useRef(null)
  const [more, setMore] = useState(false)
  const checkMore = useCallback(() => {
    const el = bodyRef.current
    if (el) setMore(el.scrollHeight - el.clientHeight - el.scrollTop > 4)
  }, [])
  useEffect(() => {
    checkMore()
    document.fonts?.ready.then(checkMore) // text reflows once the web font arrives
    window.addEventListener('resize', checkMore)
    return () => window.removeEventListener('resize', checkMore)
  }, [checkMore])

  // Reveal: 'lead' (intro + Truth) → 'typing' (MORE pressed) → 'done'
  const [phase, setPhase] = useState('lead')
  const [imagesOpen, setImagesOpen] = useState(false)
  const [zoom, setZoom] = useState(null)
  const skipRef = useRef(() => {})
  const follow = useRef(true) // keep the newest typed line in view unless the reader scrolls up
  const onTick = useCallback(() => {
    const el = bodyRef.current
    if (el && follow.current) el.scrollTop = el.scrollHeight
    checkMore()
  }, [checkMore])
  const onDone = useCallback(() => setPhase('done'), [])
  const startReveal = () => {
    follow.current = true
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    setPhase(reduce ? 'done' : 'typing')
  }
  useEffect(() => { requestAnimationFrame(checkMore) }, [phase, imagesOpen, checkMore])
  useEffect(() => {
    if (!imagesOpen) return
    const t = setTimeout(() => bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }), 150)
    return () => clearTimeout(t)
  }, [imagesOpen])
  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const backToExperience = useCallback(() => { window.location.href = '/experience' }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return
      if (e.key === 'ArrowLeft' && prev) window.location.href = `/experience/${prev.slug}`
      if (e.key === 'ArrowRight' && next) window.location.href = `/experience/${next.slug}`
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  if (!work || !cs) return null
  // A file path (e.g. /work/ketel-one/hero.jpg in /public) or a key in case-images.js.
  const hero = cs.hero?.startsWith('/') ? cs.hero : CASE_STUDY_HEROES[cs.hero]
  const heroSize = cs.heroSize || 'cover'
  const heroPosition = cs.heroPosition || '50% 50%'
  const heroPositionMobile = cs.heroPositionMobile || heroPosition
  const lead = cs.sections.filter((s) => s.heading === 'Truth')
  const rest = cs.sections.filter((s) => s.heading !== 'Truth')
  const images = imageList(work)
  // Preload the images while the copy types, so they appear at once.
  if (typeof window !== 'undefined' && phase !== 'lead') images.forEach((im) => { const i = new window.Image(); i.src = im.src })

  return (
    <SiteShell
      pageKey="case"
      onEscape={backToExperience}
    >
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
        /* Mobile first: photo band on top, boxes below. Desktop (>=768): the design. */
        .sv-cs-wrap { padding: 80px 16px 104px; }
        .sv-cs-card {
          position: relative; width: 100%; max-width: 1582px; margin: 0 auto;
          border-radius: 6px; overflow: hidden; background: #141414;
        }
        .sv-cs-hero {
          position: relative; height: 62vw; background-color: #141414;
          background-repeat: no-repeat; background-size: cover;
        }
        .sv-cs-col { position: relative; padding: 0 12px 12px; margin-top: -36px; display: flex; flex-direction: column; gap: 12px; }
        .sv-cs-titlebox {
          position: relative; flex: none; background: #101010; border-radius: 4px; color: #fff;
          padding: 16px 44px 18px 18px;
        }
        .sv-cs-name { margin: 0; font-family: ${MONO}; font-weight: 600; text-transform: uppercase; line-height: 1; font-size: 30px; }
        .sv-cs-sub { margin: 12px 0 0; font-family: ${MONO}; font-weight: 400; line-height: 1.25; font-size: 16px; }
        .sv-cs-close {
          position: absolute; top: 8px; right: 8px; padding: 8px; line-height: 1;
          font-family: ${MONO}; font-size: 15px; color: #fff; background: none; border: 0;
          transition: color 0.2s;
        }
        .sv-cs-close:hover, .sv-cs-close:focus-visible { color: #5683DD; outline: none; }
        .sv-cs-body {
          flex: 0 1 auto; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;
          background: #fff; color: #000; border: 1px solid #000; border-radius: 4px;
          padding: 18px; font-family: ${MONO}; font-weight: 400; font-size: 13px; line-height: 1.38;
        }
        .sv-cs-bodywrap { position: relative; display: flex; flex-direction: column; min-height: 0; }
        .sv-cs-bodywrap::after {
          content: ''; position: absolute; left: 1px; right: 1px; bottom: 1px; height: 64px;
          border-radius: 0 0 4px 4px; pointer-events: none;
          background: linear-gradient(rgba(255,255,255,0), #fff 85%);
          opacity: 0; transition: opacity 0.25s;
        }
        .sv-cs-bodywrap[data-more='true']::after { opacity: 1; }
        .sv-cs-body h2 { margin: 0; font: inherit; font-weight: 600; text-transform: uppercase; }
        .sv-cs-body p { margin: 0; }
        .sv-cs-section { margin-top: 1.38em; }
        .sv-cs-body > .sv-cs-section:first-child { margin-top: 0; }
        .sv-cs-body ul { margin: 0; padding: 0; list-style: none; }
        .sv-cs-body li { position: relative; padding-left: 1.2em; }
        .sv-cs-body li::before { content: '•'; position: absolute; left: 0.45em; }
        .sv-cs-caret::after { content: '\\2588'; animation: sv-cs-blink 0.8s step-end infinite; margin-left: 1px; }
        @keyframes sv-cs-blink { 50% { opacity: 0; } }
        .sv-cs-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        /* MORE / MORE IMAGERY: same voice as the site's >>LINKEDIN links */
        .sv-cs-more {
          display: inline-flex; align-items: center; gap: 0.5em; margin-top: 1.1em; padding: 6px 0;
          background: none; border: 0; border-bottom: 1px solid currentColor; color: inherit;
          font: inherit; font-weight: 600; font-size: 0.92em; letter-spacing: 0.12em; text-transform: uppercase;
          transition: color 0.2s; animation: sv-cs-in 0.45s ease both;
        }
        .sv-cs-more .sign { display: inline-block; transition: transform 0.3s; }
        .sv-cs-more:hover, .sv-cs-more:focus-visible { color: #5683DD; outline: none; }
        .sv-cs-more:hover .sign { transform: rotate(90deg); }
        @keyframes sv-cs-in { from { opacity: 0; transform: translateY(4px); } }
        /* images, inside the copy box: 1 = full width, 2 = side by side, 3 = one wide + two */
        .sv-cs-shots { display: grid; gap: 10px; margin-top: 1.2em; }
        .sv-cs-shots.n2, .sv-cs-shots.n3 { grid-template-columns: 1fr 1fr; }
        .sv-cs-shots.n3 .sv-cs-shot:first-child { grid-column: 1 / -1; }
        .sv-cs-shot {
          display: block; width: 100%; padding: 0; aspect-ratio: 16 / 10; overflow: hidden;
          border: 1px solid #000; border-radius: 4px; background: #111;
          animation: sv-cs-pop 0.6s cubic-bezier(0.34, 1.45, 0.64, 1) both;
        }
        .sv-cs-shots.n1 .sv-cs-shot, .sv-cs-shots.n3 .sv-cs-shot:first-child { aspect-ratio: 16 / 9; }
        .sv-cs-shot img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .sv-cs-shot:hover img { transform: scale(1.04); }
        .sv-cs-shot:focus-visible { outline: 2px solid #5683DD; outline-offset: 2px; }
        @keyframes sv-cs-pop { from { opacity: 0; transform: translateY(14px) scale(0.9); } }
        /* enlarged image, over the card */
        .sv-cs-zoom {
          position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center;
          padding: 5%; background: rgba(0, 0, 0, 0.82); animation: sv-cs-in 0.25s ease both;
        }
        .sv-cs-zoom img { max-width: 100%; max-height: 100%; border: 1px solid #fff; border-radius: 4px; }
        .sv-cs-zoom button {
          position: absolute; top: 12px; right: 14px; padding: 8px; background: none; border: 0;
          color: #fff; font-family: ${MONO}; font-size: 18px; line-height: 1; transition: color 0.2s;
        }
        .sv-cs-zoom button:hover, .sv-cs-zoom button:focus-visible { color: #5683DD; outline: none; }
        @media (prefers-reduced-motion: reduce) { .sv-cs-shot, .sv-cs-more, .sv-cs-zoom { animation: none; } .sv-cs-caret::after { animation: none; } }
        .sv-cs-nav { display: flex; justify-content: space-between; padding: 4px 14px 14px; }
        .sv-cs-arrow { display: inline-flex; padding: 10px; margin: -10px; color: #fff; line-height: 0; transition: opacity 0.2s; }
        a.sv-cs-arrow:hover, a.sv-cs-arrow:focus-visible { opacity: 0.7; outline: none; }

        @media (min-width: 768px) {
          .sv-cs-wrap { padding: clamp(96px, 7.76vw, 149px) clamp(24px, 8.8vw, 169px) 36px; }
          .sv-cs-card {
            height: calc(100vh - clamp(96px, 7.76vw, 149px) - 36px);
            height: calc(100dvh - clamp(96px, 7.76vw, 149px) - 36px);
            min-height: 560px;
          }
          .sv-cs-hero { position: absolute; inset: 0; height: auto; }
          .sv-cs-col {
            position: absolute; margin: 0; padding: 0;
            left: clamp(36px, 2.29vw, 44px); top: clamp(20px, 1.72vw, 33px); bottom: clamp(20px, 1.93vw, 37px);
            width: max(46.46%, 440px); max-width: calc(100% - 96px);
            gap: clamp(14px, 1.25vw, 24px); align-items: stretch;
          }
          .sv-cs-titlebox { padding: clamp(14px, 1.0vw, 19px) clamp(52px, 3.6vw, 70px) clamp(18px, 1.3vw, 25px) clamp(18px, 1.5625vw, 30px); }
          .sv-cs-name { font-size: clamp(30px, 2.604vw, 50px); }
          .sv-cs-sub { margin-top: clamp(10px, 0.84vw, 16px); font-size: clamp(16px, 1.25vw, 24px); }
          .sv-cs-close { top: clamp(4px, 0.34vw, 6px); right: clamp(6px, 0.5vw, 9px); font-size: clamp(14px, 1.04vw, 20px); }
          .sv-cs-bodywrap { flex: 1 1 auto; }
          .sv-cs-body { flex: 1 1 auto; padding: clamp(16px, 1.25vw, 24px) clamp(18px, 1.5625vw, 30px) clamp(18px, 1.5625vw, 30px); font-size: clamp(13px, 0.9375vw, 18px); line-height: 1.278; }
          .sv-cs-section { margin-top: 1.278em; }
          .sv-cs-body > .sv-cs-section:first-child { margin-top: 0; }
          .sv-cs-nav { display: contents; }
          .sv-cs-arrow { position: absolute; top: 53.2%; transform: translateY(-50%); margin: 0; }
          .sv-cs-arrow-prev { left: calc(14px - 10px); }
          .sv-cs-arrow-next { right: calc(20px - 10px); }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .sv-cs-col { width: calc(100% - 96px); }
        }
      `}</style>

      <div className="sv-cs-wrap">
        <motion.article
          className="sv-cs-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          aria-labelledby="sv-cs-name"
        >
          <div
            className="sv-cs-hero"
            role="img"
            aria-label={`${work.client} case study image`}
            style={{ backgroundImage: `url(${hero})` }}
          />
          <style>{`
            .sv-cs-hero { background-position: ${heroPositionMobile}; }
            @media (min-width: 768px) { .sv-cs-hero { background-size: ${heroSize}; background-position: ${heroPosition}; } }
          `}</style>

          <div className="sv-cs-col">
            <header className="sv-cs-titlebox">
              <h1 id="sv-cs-name" className="sv-cs-name">{caseTitle(work)}</h1>
              <p className="sv-cs-sub">{caseSubheading(work)}</p>
              <a className="sv-cs-close" href="/experience" aria-label="Close case study, back to Work">X</a>
            </header>

            <div className="sv-cs-bodywrap" data-more={more ? 'true' : 'false'}>
            <div
              className="sv-cs-body"
              ref={bodyRef}
              onScroll={(e) => {
                const el = e.currentTarget
                if (phase === 'typing') follow.current = el.scrollHeight - el.clientHeight - el.scrollTop < 24
                checkMore()
              }}
              onClick={(e) => { if (phase === 'typing' && !e.target.closest('button')) skipRef.current() }}
              tabIndex={0}
              aria-label={`${work.client} case study`}
            >
              {cs.intro && <p className="sv-cs-intro">{cs.intro}</p>}
              {lead.map((s) => <Section key={s.heading} s={s} />)}

              {/* The rest of the copy: typed for sighted readers, whole for everyone else */}
              <div className="sv-cs-sr">{rest.map((s) => <Section key={s.heading} s={s} />)}</div>
              {phase === 'lead' && rest.length > 0 && (
                <button type="button" className="sv-cs-more" onClick={startReveal} aria-label="Read the full case study">
                  More <span className="sign" aria-hidden="true">+</span>
                </button>
              )}
              {phase === 'typing' && <TypedSections sections={rest} onTick={onTick} onDone={onDone} skipRef={skipRef} />}
              {phase === 'done' && <div aria-hidden="true">{rest.map((s) => <Section key={s.heading} s={s} />)}</div>}

              {phase === 'done' && images.length > 0 && (
                <>
                  <button
                    type="button"
                    className="sv-cs-more"
                    aria-expanded={imagesOpen}
                    onClick={() => setImagesOpen((v) => !v)}
                  >
                    {imagesOpen ? 'Less imagery' : 'More imagery'}{' '}
                    <span className="sign" aria-hidden="true">{imagesOpen ? '−' : '+'}</span>
                  </button>
                  {imagesOpen && (
                    <div className={`sv-cs-shots n${images.length}`}>
                      {images.map((im, i) => (
                        <button
                          type="button"
                          key={im.src}
                          className="sv-cs-shot"
                          style={{ animationDelay: `${60 + i * 140}ms` }}
                          onClick={() => setZoom(im)}
                          aria-label={`Enlarge: ${im.alt}`}
                        >
                          <img src={im.src} alt={im.alt} draggable={false} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            </div>
          </div>

          {zoom && (
            <div className="sv-cs-zoom" role="dialog" aria-label={zoom.alt} data-sv-modal="open" onClick={(e) => e.target === e.currentTarget && setZoom(null)}>
              <img src={zoom.src} alt={zoom.alt} />
              <button type="button" onClick={() => setZoom(null)} aria-label="Close image" autoFocus>✕</button>
            </div>
          )}

          <nav className="sv-cs-nav" aria-label="Case studies">
            <Arrow dir="prev" target={prev} />
            <Arrow dir="next" target={next} />
          </nav>
        </motion.article>
      </div>
    </SiteShell>
  )
}

export default CaseStudy
