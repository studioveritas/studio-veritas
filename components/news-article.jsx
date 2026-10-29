'use client'

// A News + Insights article, on the warm-brown band. Laid out like a case study: the black title
// box (name, title, X back to /news) over a copy box on the left, the article image (PNG, JPEG
// or animated GIF) on the right, in full colour. The arrows step to the previous/next article.
//
// The copy reveals as on the case studies: the opening, the standard intro and the sections
// before WORTH ASKING show first; MORE types out the rest. The full text is always in the page
// for screen readers and search engines.

import { useEffect, useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SiteShell } from './site-shell'
import { Section, TypedSections } from './typed-sections'
import { getArticle, getArticleNeighbours, REVEAL_FROM } from './news-data'

const MONO = "'IBM Plex Mono', monospace"
const BROWN = '#ddc9b8'
const BROWN_LIGHT = '#ead5c3'

// 'IN SIGNO VERITAS #02' -> 'In Signo Veritas #02'
const titleCase = (s) => s.toLowerCase().replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase())

function Arrow({ dir, target }) {
  const prev = dir === 'prev'
  const shape = prev ? '15,1.5 15,18.5 1.5,10' : '1,1.5 1,18.5 14.5,10'
  const icon = (
    <svg width="18" height="22" viewBox="0 0 16 20" aria-hidden="true">
      <polygon points={shape} fill={target ? '#000' : 'none'} stroke="#000" strokeWidth={target ? 0 : 1.5} strokeLinejoin="round" />
    </svg>
  )
  const cls = `sv-na-arrow sv-na-arrow-${dir}`
  if (!target) return <span className={cls} aria-hidden="true">{icon}</span>
  return (
    <a className={cls} href={`/news/${target.slug}`} aria-label={`${prev ? 'Previous' : 'Next'} article: ${target.name}, ${target.title}`}>
      {icon}
    </a>
  )
}

// The closing line; "Get in touch" links to the Contact page.
function Cta({ text }) {
  const i = text.search(/get in touch/i)
  if (i < 0) return <p className="sv-na-cta">{text}</p>
  const m = text.slice(i).match(/get in touch/i)[0]
  return (
    <p className="sv-na-cta">
      {text.slice(0, i)}
      <a href="/contact">{m}</a>
      {text.slice(i + m.length)}
    </p>
  )
}

export function NewsArticle({ slug }) {
  const item = getArticle(slug)
  const { prev, next } = getArticleNeighbours(slug)

  const bodyRef = useRef(null)
  const [more, setMore] = useState(false)
  const checkMore = useCallback(() => {
    const el = bodyRef.current
    if (el) setMore(el.scrollHeight - el.clientHeight - el.scrollTop > 4)
  }, [])
  useEffect(() => {
    checkMore()
    document.fonts?.ready.then(checkMore)
    window.addEventListener('resize', checkMore)
    return () => window.removeEventListener('resize', checkMore)
  }, [checkMore])

  const [phase, setPhase] = useState('lead')
  const skipRef = useRef(() => {})
  const follow = useRef(true)
  const onTick = useCallback(() => {
    const el = bodyRef.current
    if (el && follow.current && el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight
    checkMore()
  }, [checkMore])
  const onDone = useCallback(() => setPhase('done'), [])
  const startReveal = () => {
    follow.current = true
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    setPhase(reduce ? 'done' : 'typing')
  }
  useEffect(() => { requestAnimationFrame(checkMore) }, [phase, checkMore])

  const back = useCallback(() => { window.location.href = '/news' }, [])
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return
      if (e.key === 'ArrowLeft' && prev) window.location.href = `/news/${prev.slug}`
      if (e.key === 'ArrowRight' && next) window.location.href = `/news/${next.slug}`
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  if (!item) return null
  const sections = item.sections || []
  const cut = sections.findIndex((s) => s.heading.toLowerCase() === REVEAL_FROM.toLowerCase())
  const lead = cut < 0 ? sections : sections.slice(0, cut)
  const rest = cut < 0 ? [] : sections.slice(cut)

  return (
    <SiteShell pageKey="article" onEscape={back}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${titleCase(item.name)}: ${item.title}`,
            ...(item.date ? { datePublished: item.date } : {}),
            image: item.image,
            author: { '@type': 'Organization', name: 'Studio Veritas' },
            articleBody: [...sections.map((s) => `${s.heading}: ${[s.body, ...(s.list || [])].filter(Boolean).join(' ')}`), item.cta].filter(Boolean).join(' '),
          }),
        }}
      />
      <style>{`
        .sv-na { padding-top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 12px); }
        .sv-na-band { background: ${BROWN}; color: #000; border-top: 1px solid #000; padding: 24px 12px 110px; min-height: calc(100vh - var(--sv-nav-top) - var(--sv-nav-h) - 12px); }
        .sv-na-card { position: relative; max-width: 1219px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 12px; }
        .sv-na-titlebox { position: relative; background: #000; color: ${BROWN}; border-radius: 4px; padding: 16px 48px 18px 18px; }
        .sv-na-name { margin: 0; font-family: ${MONO}; font-weight: 600; text-transform: uppercase; line-height: 1; font-size: 26px; }
        .sv-na-sub { margin: 12px 0 0; font-family: ${MONO}; font-weight: 400; line-height: 1.25; font-size: 16px; }
        .sv-na-close { position: absolute; top: 8px; right: 8px; padding: 8px; line-height: 1; color: ${BROWN}; font-family: ${MONO}; font-size: 15px; text-decoration: none; transition: color .2s; }
        .sv-na-close:hover, .sv-na-close:focus-visible { color: #fff; outline: none; }
        .sv-na-figure { margin: 0; border-radius: 4px; overflow: hidden; background: #2a2119; aspect-ratio: 465 / 607; }
        .sv-na-figure img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .sv-na-bodywrap { position: relative; }
        .sv-na-body {
          background: ${BROWN_LIGHT}; border: 1px solid #000; border-radius: 4px; padding: 18px;
          font-family: ${MONO}; font-weight: 400; font-size: 13px; line-height: 1.38; outline: none;
        }
        .sv-na-bodywrap::after {
          content: ''; position: absolute; left: 1px; right: 1px; bottom: 1px; height: 64px; border-radius: 0 0 4px 4px; pointer-events: none;
          background: linear-gradient(rgba(234,213,195,0), ${BROWN_LIGHT} 85%); opacity: 0; transition: opacity .25s;
        }
        .sv-na-bodywrap[data-more='true']::after { opacity: 1; }
        .sv-na-body p { margin: 0; }
        .sv-na-body .sv-cs-section p + p { margin-top: 1em; }
        .sv-na-cta { margin-top: 1.38em !important; animation: sv-na-in .45s ease both; }
        .sv-na-cta a { text-decoration: underline; text-underline-offset: 3px; transition: color .2s; }
        .sv-na-cta a:hover, .sv-na-cta a:focus-visible { color: #5683DD; outline: none; }
        .sv-na-kicker { margin-bottom: 1.38em !important; }
        .sv-na-body h2 { margin: 0; font: inherit; font-weight: 600; text-transform: uppercase; }
        .sv-na-body h2::before { content: '\\25A0\\00a0'; }
        .sv-cs-section { margin-top: 1.38em; }
        .sv-na-body ul { margin: 1.38em 0 0; padding: 0; list-style: none; }
        .sv-na-body li { position: relative; padding-left: 1.2em; }
        .sv-na-body li::before { content: '•'; position: absolute; left: 0.45em; }
        .sv-cs-caret::after { content: '\\2588'; animation: sv-na-blink 0.8s step-end infinite; margin-left: 1px; }
        @keyframes sv-na-blink { 50% { opacity: 0; } }
        .sv-na-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .sv-na-more {
          display: inline-flex; align-items: center; gap: 0.5em; margin-top: 1.1em; padding: 6px 0;
          background: none; border: 0; border-bottom: 1px solid currentColor; color: inherit;
          font: inherit; font-weight: 600; font-size: 0.92em; letter-spacing: 0.12em; text-transform: uppercase;
          transition: color .2s; animation: sv-na-in .45s ease both;
        }
        .sv-na-more .sign { display: inline-block; transition: transform .3s; }
        .sv-na-more:hover, .sv-na-more:focus-visible { color: #5683DD; outline: none; }
        .sv-na-more:hover .sign { transform: rotate(90deg); }
        @keyframes sv-na-in { from { opacity: 0; transform: translateY(4px); } }
        .sv-na-nav { display: flex; justify-content: space-between; padding: 6px 4px 0; }
        .sv-na-arrow { display: inline-flex; padding: 10px; margin: -10px; line-height: 0; transition: opacity .2s; }
        a.sv-na-arrow:hover, a.sv-na-arrow:focus-visible { opacity: .55; outline: none; }
        span.sv-na-arrow { opacity: .45; }

        @media (min-width: 900px) {
          .sv-na { padding-top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 26px); }
          .sv-na-band { padding: clamp(40px, 3.3vw, 64px) 72px 120px; }
          .sv-na-card {
            grid-template-columns: 735fr 465fr; grid-template-rows: auto auto;
            column-gap: clamp(12px, 1vw, 19px); row-gap: clamp(8px, 0.6vw, 11px);
          }
          .sv-na-titlebox { grid-column: 1; grid-row: 1; padding: clamp(14px, 1vw, 19px) clamp(52px, 3.6vw, 70px) clamp(18px, 1.3vw, 25px) clamp(18px, 1.5625vw, 30px); }
          .sv-na-name { font-size: clamp(30px, 2.604vw, 50px); }
          .sv-na-sub { margin-top: clamp(10px, 0.84vw, 16px); font-size: clamp(16px, 1.25vw, 24px); }
          .sv-na-close { top: clamp(4px, 0.34vw, 6px); right: clamp(6px, 0.5vw, 9px); font-size: clamp(14px, 1.04vw, 20px); }
          .sv-na-bodywrap { grid-column: 1; grid-row: 2; }
          /* the copy box is exactly as tall as the image beside it, and scrolls */
          .sv-na-body { position: absolute; inset: 0; overflow-y: auto; overscroll-behavior: contain;
            padding: clamp(16px, 1.25vw, 24px) clamp(18px, 1.5625vw, 30px); font-size: clamp(13px, 0.9375vw, 18px); line-height: 1.278; }
          .sv-cs-section { margin-top: 1.278em; }
          .sv-na-figure { grid-column: 2; grid-row: 2; }
          /* the arrows sit just outside the card, level with the middle of the image */
          .sv-na-nav { grid-column: 1 / -1; grid-row: 2; align-self: center; margin: 0 -46px; padding: 0; pointer-events: none; }
          .sv-na-arrow { pointer-events: auto; margin: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .sv-na-more { animation: none; } .sv-cs-caret::after { animation: none; } }
      `}</style>

      <div className="sv-na">
        <section className="sv-na-band">
          <motion.article
            className="sv-na-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            aria-labelledby="sv-na-name"
          >
            <header className="sv-na-titlebox">
              <h1 id="sv-na-name" className="sv-na-name">{item.name}</h1>
              <p className="sv-na-sub">{item.title}</p>
              <a className="sv-na-close" href="/news" aria-label="Close article, back to News + Insights">X</a>
            </header>

            <figure className="sv-na-figure">
              {/* PNG, JPEG or animated GIF */}
              <img src={item.image} alt={item.imageAlt || ''} draggable={false} />
            </figure>

            <div className="sv-na-bodywrap" data-more={more ? 'true' : 'false'}>
              <div
                className="sv-na-body"
                ref={bodyRef}
                tabIndex={0}
                aria-label={`${item.name}: ${item.title}`}
                onScroll={(e) => {
                  const el = e.currentTarget
                  if (phase === 'typing') follow.current = el.scrollHeight - el.clientHeight - el.scrollTop < 24
                  checkMore()
                }}
                onClick={(e) => { if (phase === 'typing' && !e.target.closest('button')) skipRef.current() }}
              >
                <p className="sv-na-kicker">{titleCase(item.name)}</p>
                {item.intro && <p>{item.intro}</p>}
                {lead.map((s) => <Section key={s.heading} s={s} />)}

                <div className="sv-na-sr">
                  {rest.map((s) => <Section key={s.heading} s={s} />)}
                  {item.cta && phase !== 'done' && <p>{item.cta}</p>}
                </div>
                {phase === 'lead' && rest.length > 0 && (
                  <button type="button" className="sv-na-more" onClick={startReveal} aria-label="Read the rest of the article">
                    <span className="sign" aria-hidden="true">+</span> More
                  </button>
                )}
                {phase === 'typing' && <TypedSections sections={rest} onTick={onTick} onDone={onDone} skipRef={skipRef} />}
                {phase === 'done' && <div aria-hidden="true">{rest.map((s) => <Section key={s.heading} s={s} />)}</div>}
                {(phase === 'done' || rest.length === 0) && item.cta && <Cta text={item.cta} />}
              </div>
            </div>

            <nav className="sv-na-nav" aria-label="Articles">
              <Arrow dir="prev" target={prev} />
              <Arrow dir="next" target={next} />
            </nav>
          </motion.article>
        </section>
      </div>
    </SiteShell>
  )
}

export default NewsArticle
