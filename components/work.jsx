'use client'

// Work: the selected-work page. A full-width black band holds a masonry grid of square and 4:5
// tiles, each with its name in a black box over the image. Tiles rise in as they scroll into
// view; LOAD MORE adds the next nine once the first nine are on the page. Below the band, the
// client logos scroll past on a ticker.
//
// Tiles with a case study link to /experience/<slug>; the rest show COMING SOON on rollover.
// Filters (Brand, Comms, ...) sit beside the title; the choice is kept in the URL as ?tag=brand.
//
// Tile images: `portrait` in work-data.js (4:5, about 880 x 1100). Square tiles crop the same image.
// Shape: `tile: 'square'` or `tile: 'portrait'` on an entry, otherwise the pattern below.

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SiteShell } from './site-shell'
import { PageTag } from './site-chrome'
import { LogoTicker } from './logo-ticker'
import { WORK, TAGS } from './work-data'
import { WORK_TILES } from './work-images'

const MONO = "'IBM Plex Mono', monospace"
const PAGE = 9 // tiles per load
const SQUARES = [0, 2] // in each run of nine, these positions are square; the rest are 4:5

const slug = (t) => t.toLowerCase()
const shapeOf = (w) => w.tile || (SQUARES.includes(WORK.indexOf(w) % PAGE) ? 'square' : 'portrait')
const srcOf = (w) => w.portrait || (w.img?.startsWith('/') ? w.img : WORK_TILES[w.img])

// 1 column on phones, 2 on tablets, 3 from 1024px.
function useColumns() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const read = () => setCols(window.innerWidth < 600 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [])
  return cols
}

function Tile({ work, order }) {
  const live = Boolean(work.caseStudy)
  const inner = (
    <>
      <div className={`sv-tile-media sv-tile-${shapeOf(work)}`}>
        <img src={srcOf(work)} alt="" loading={order < 6 ? 'eager' : 'lazy'} draggable={false} />
        {!live && (
          <div className="sv-tile-soon" aria-hidden="true">
            <span>Coming soon</span>
          </div>
        )}
        <div className="sv-tile-box">
          <p className="sv-tile-name">{work.name}</p>
          <p className="sv-tile-sub">{work.subheading}</p>
        </div>
      </div>
    </>
  )
  return (
    <motion.article
      className="sv-tile-wrap"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: (order % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {live ? (
        <a href={`/experience/${work.slug}`} className="sv-tile sv-tile-live" aria-label={`${work.client}: ${work.subheading}. Read the case study`}>
          {inner}
        </a>
      ) : (
        <div className="sv-tile" tabIndex={0} aria-label={`${work.client}: ${work.subheading}. Case study coming soon`}>
          {inner}
        </div>
      )}
    </motion.article>
  )
}

export function Work() {
  // Only offer filters that have work behind them.
  const filters = TAGS.map((t) => ({ tag: t, count: WORK.filter((w) => w.tags?.includes(t)).length })).filter((f) => f.count)
  const [tag, setTag] = useState(null)
  const [count, setCount] = useState(PAGE)
  const [allShown, setAllShown] = useState(false)
  const cols = useColumns()
  const band = useRef(null)

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('tag')
      const found = TAGS.find((t) => slug(t) === (q || '').toLowerCase())
      if (found) setTag(found)
    } catch {}
  }, [])

  // While the black band is behind the bottom corners, the eye and footer triangle turn white.
  useEffect(() => {
    const root = document.documentElement
    const check = () => {
      const r = band.current?.getBoundingClientRect()
      const y = window.innerHeight - 40
      root.dataset.svDarkBottom = r && r.top < y && r.bottom > y ? '1' : '0'
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      delete root.dataset.svDarkBottom
    }
  }, [])

  const choose = (t) => {
    const next = t === tag ? null : t
    setTag(next)
    setCount(PAGE)
    setAllShown(false)
    try {
      const url = new URL(window.location.href)
      if (next) url.searchParams.set('tag', slug(next))
      else url.searchParams.delete('tag')
      window.history.replaceState(null, '', url)
    } catch {}
  }

  const shown = tag ? WORK.filter((w) => w.tags?.includes(tag)) : WORK
  const visible = shown.slice(0, count)
  const more = shown.length > count
  const columns = Array.from({ length: cols }, (_, c) => visible.map((w, i) => ({ w, i })).filter(({ i }) => i % cols === c))

  const loadMore = () => {
    if (more) setCount((n) => n + PAGE)
    else setAllShown(true)
  }

  return (
    <SiteShell
      pageKey="work"
      srOnly={
        <>
          <h2>Studio Veritas — selected work</h2>
          <ul>
            {WORK.map((w) => (
              <li key={w.slug}>
                {w.client} ({w.name}): {w.subheading}.{w.caseStudy ? ` Case study: /experience/${w.slug}` : ''}
              </li>
            ))}
          </ul>
        </>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Studio Veritas — Work',
            itemListElement: WORK.map((w, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'CreativeWork',
                name: w.name,
                about: w.client,
                description: w.subheading,
                ...(w.caseStudy ? { url: `/experience/${w.slug}` } : {}),
              },
            })),
          }),
        }}
      />
      <style>{`
        /* the black band starts just below the nav bar and runs the full width */
        .sv-work { padding-top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 12px); }
        .sv-work-band { background: #000; color: #fff; padding: 28px 0 44px; }
        .sv-work-inner { max-width: 1366px; margin: 0 auto; padding: 0 12px; }
        .sv-work-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px 32px; }
        .sv-work-head .sv-tag { min-width: 0; width: min(100%, 300px); padding-top: 14px; padding-bottom: 14px; }
        .sv-filters { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 0 -6px; }
        .sv-filter {
          padding: 6px; background: none; border: 0; color: #fff; font-family: ${MONO}; font-weight: 500;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; line-height: 1;
          text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 6px; text-decoration-thickness: 1px;
          transition: color 0.2s, text-decoration-color 0.2s;
        }
        .sv-filter sup { font-size: 0.62em; margin-left: 3px; letter-spacing: 0; vertical-align: 0.6em; opacity: 0.55; }
        .sv-filter[aria-pressed='true'] { color: #5683DD; text-decoration-color: currentColor; }
        .sv-filter:focus-visible { outline: none; color: #5683DD; }
        @media (hover: hover) { .sv-filter:hover { color: #5683DD; } }
        .sv-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; margin: 0; }

        .sv-mason { display: flex; align-items: flex-start; gap: 12px; margin-top: 24px; }
        .sv-mason-col { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 12px; }

        .sv-tile { display: block; color: #fff; text-decoration: none; outline: none; }
        .sv-tile-media { position: relative; overflow: hidden; border-radius: 3px; background: #141414; }
        .sv-tile-square { aspect-ratio: 1 / 1; }
        .sv-tile-portrait { aspect-ratio: 4 / 5; }
        .sv-tile-media img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sv-tile-box {
          position: absolute; left: 8px; bottom: 8px; max-width: calc(100% - 16px); min-width: min(72%, calc(100% - 16px));
          padding: 8px 12px 9px; background: #000; border-radius: 2px;
        }
        .sv-tile-name {
          margin: 0; font-family: ${MONO}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;
          font-size: 15px; line-height: 1.25; transition: color 0.2s;
        }
        .sv-tile-sub { margin: 3px 0 0; font-family: ${MONO}; font-weight: 400; font-size: 11.5px; line-height: 1.4; }
        .sv-tile-soon {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(0, 0, 0, 0.33); opacity: 0; transition: opacity 0.25s;
        }
        .sv-tile-soon span {
          color: #fff; font-family: ${MONO}; font-weight: 500; text-transform: uppercase;
          font-size: clamp(22px, 1.9vw, 36px); line-height: 1; white-space: nowrap;
        }
        @media (hover: hover) {
          .sv-tile:hover .sv-tile-soon { opacity: 1; }
          .sv-tile-live:hover .sv-tile-name { color: #5683DD; }
          .sv-tile-live:hover .sv-tile-media img { transform: scale(1.035); }
        }
        .sv-tile:focus-visible .sv-tile-soon, .sv-tile:focus .sv-tile-soon { opacity: 1; }
        .sv-tile-live:focus-visible .sv-tile-name { color: #5683DD; }
        .sv-tile-live:focus-visible .sv-tile-media { box-shadow: 0 0 0 2px #5683DD; }

        .sv-more-row { display: flex; justify-content: center; margin-top: 40px; }
        .sv-more {
          display: inline-flex; align-items: center; justify-content: space-between; gap: 40px;
          min-width: 220px; padding: 12px 18px; background: #f6f4ee; color: #000; border: 0; border-radius: 3px;
          font-family: ${MONO}; font-weight: 500; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase;
          transition: background-color 0.2s, color 0.2s;
        }
        .sv-more-plus { font-size: 22px; font-weight: 300; line-height: 0.8; transition: transform 0.3s; }
        .sv-more:hover, .sv-more:focus-visible { background: #5683DD; color: #fff; outline: none; }
        .sv-more:hover .sv-more-plus { transform: rotate(90deg); }
        .sv-more[data-done='true'] { background: transparent; color: rgba(255,255,255,0.7); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3); }

        .sv-work-after { height: 120px; }

        @media (min-width: 768px) {
          .sv-work { padding-top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 42px); }
          .sv-work-band { padding: clamp(40px, 3.9vw, 75px) 0 clamp(56px, 4.4vw, 84px); }
          .sv-work-inner { padding: 0 24px; }
          .sv-work-head .sv-tag { width: calc((100% - 28px) / 3); min-width: 280px; padding-top: 16px; padding-bottom: 16px; }
          .sv-filter { font-size: clamp(14px, 1.04vw, 20px); }
          .sv-filters { gap: 6px clamp(18px, 1.6vw, 30px); }
          .sv-mason { gap: 14px; margin-top: clamp(32px, 3vw, 58px); }
          .sv-mason-col { gap: 14px; }
          .sv-tile-box { left: 10px; bottom: 10px; max-width: calc(100% - 20px); padding: 9px 14px 10px; }
          .sv-tile-name { font-size: clamp(15px, 1.04vw, 20px); }
          .sv-tile-sub { font-size: clamp(11.5px, 0.73vw, 14px); }
          .sv-more-row { margin-top: clamp(48px, 3.4vw, 64px); }
          .sv-more { min-width: 260px; padding: 14px 22px; font-size: 16px; }
          .sv-work-after { height: 180px; }
        }
        @media (prefers-reduced-motion: reduce) { .sv-tile-media img, .sv-tile-soon, .sv-more-plus { transition: none; } }
      `}</style>

      <div className="sv-work">
        <section ref={band} className="sv-work-band" aria-labelledby="sv-work-title">
          <div className="sv-work-inner">
            <div className="sv-work-head">
              <PageTag label="Work" tone="light" align="left" closeLabel="Close the work page" />
              <div className="sv-filters" role="group" aria-label="Filter the work">
                <button type="button" className="sv-filter" aria-pressed={tag === null} onClick={() => choose(null)}>
                  All<sup>{WORK.length}</sup>
                </button>
                {filters.map((f) => (
                  <button key={f.tag} type="button" className="sv-filter" aria-pressed={tag === f.tag} onClick={() => choose(f.tag)}>
                    {f.tag}<sup>{f.count}</sup>
                  </button>
                ))}
              </div>
            </div>
            <p className="sv-sr" aria-live="polite">
              {tag ? `${shown.length} ${tag} projects` : `All ${WORK.length} projects`}
            </p>

            <div className="sv-mason" key={`${tag}-${cols}`}>
              {columns.map((col, c) => (
                <div className="sv-mason-col" key={c}>
                  {col.map(({ w, i }) => (
                    <Tile key={w.slug} work={w} order={i} />
                  ))}
                </div>
              ))}
            </div>

            <div className="sv-more-row">
              <button type="button" className="sv-more" onClick={loadMore} data-done={allShown && !more} aria-live="polite">
                <span className="sv-more-plus" aria-hidden="true">+</span>
                <span>{allShown && !more ? 'More work soon' : 'Load more'}</span>
              </button>
            </div>
          </div>
        </section>

        <LogoTicker />
        <div className="sv-work-after" aria-hidden="true" />
      </div>
    </SiteShell>
  )
}

export default Work
