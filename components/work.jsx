'use client'

// Work: the selected-work grid. A black card with a white keyline on the site background, with
// tiles of work, each with a name and subheading. Tiles with a case study link
// to /experience/<slug>; the rest show COMING SOON on rollover.
// Sizes are taken from the design at 1920 wide and scale down with the viewport.
// Filters (Brand, Comms, ...) sit beside the title; the choice is kept in the
// URL as ?tag=brand so a filtered view can be shared.

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SiteShell } from './site-shell'
import { WORK, TAGS } from './work-data'
import { WORK_TILES } from './work-images'

const MONO = "'IBM Plex Mono', monospace"

function Tile({ work, index, firstPaint }) {
  const live = Boolean(work.caseStudy)
  const media = (
    <div className="sv-tile-media">
      {/* A file path (e.g. /work/ketel-one/tile.jpg in /public) or a key in work-images.js */}
      <img src={work.img?.startsWith('/') ? work.img : WORK_TILES[work.img]} alt="" draggable={false} />
      {!live && (
        <div className="sv-tile-soon" aria-hidden="true">
          <span>Coming soon</span>
        </div>
      )}
    </div>
  )
  const caption = (
    <div className="sv-tile-caption">
      <p className="sv-tile-name">{work.name}</p>
      <p className="sv-tile-sub">{work.subheading}</p>
    </div>
  )
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
      transition={{ duration: 0.6, delay: firstPaint ? 0.15 + index * 0.06 : 0.04 * index, ease: [0.22, 1, 0.36, 1] }}
    >
      {live ? (
        <a href={`/experience/${work.slug}`} className="sv-tile sv-tile-live" aria-label={`${work.client}: ${work.subheading}. Read the case study`}>
          {media}
          {caption}
        </a>
      ) : (
        <div className="sv-tile" tabIndex={0} aria-label={`${work.client}: ${work.subheading}. Case study coming soon`}>
          {media}
          {caption}
        </div>
      )}
    </motion.li>
  )
}

const slug = (t) => t.toLowerCase()

export function Work() {
  // Only offer filters that have work behind them.
  const filters = TAGS.map((t) => ({ tag: t, count: WORK.filter((w) => w.tags?.includes(t)).length })).filter((f) => f.count)
  const [tag, setTag] = useState(null)
  const [firstPaint, setFirstPaint] = useState(true)

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('tag')
      const found = TAGS.find((t) => slug(t) === (q || '').toLowerCase())
      if (found) setTag(found)
    } catch {}
    const t = setTimeout(() => setFirstPaint(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const choose = (t) => {
    const next = t === tag ? null : t
    setTag(next)
    setFirstPaint(false)
    try {
      const url = new URL(window.location.href)
      if (next) url.searchParams.set('tag', slug(next))
      else url.searchParams.delete('tag')
      window.history.replaceState(null, '', url)
    } catch {}
  }

  const shown = tag ? WORK.filter((w) => w.tags?.includes(tag)) : WORK

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
        /* Card: 1582px wide at 1920 (169px each side), black with a 1px white keyline; all text white */
        .sv-work-wrap { padding: 80px 16px 104px; }
        .sv-work-card {
          width: 100%; max-width: 1582px; margin: 0 auto;
          background: #000; border: 1px solid #fff; border-radius: 4px; color: #fff;
          padding: 28px 18px 40px;
        }
        .sv-work-title {
          margin: 0; color: #fff; font-family: ${MONO}; font-weight: 700;
          text-transform: uppercase; line-height: 1; font-size: 30px;
        }
        .sv-work-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 14px 32px; }
        .sv-filters { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 0 -6px; }
        .sv-filter {
          padding: 6px; background: none; border: 0; color: #fff; font-family: ${MONO}; font-weight: 500;
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; line-height: 1;
          text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 5px; text-decoration-thickness: 1px;
          transition: color 0.2s, text-decoration-color 0.2s;
        }
        .sv-filter sup { font-size: 0.72em; margin-left: 3px; letter-spacing: 0; vertical-align: 0.5em; opacity: 0.55; }
        .sv-filter[aria-pressed='true'] { color: #5683DD; text-decoration-color: currentColor; }
        .sv-filter:focus-visible { outline: none; color: #5683DD; }
        @media (hover: hover) { .sv-filter:hover { color: #5683DD; } }
        @media (min-width: 768px) { .sv-filter { font-size: clamp(12px, 0.73vw, 14px); } }
        .sv-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; margin: 0; }
        .sv-work-grid {
          list-style: none; margin: 28px 0 0; padding: 0;
          display: grid; grid-template-columns: 1fr; column-gap: 14px; row-gap: 22px;
        }
        @media (min-width: 640px) { .sv-work-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .sv-work-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 768px) {
          .sv-work-wrap { padding: clamp(96px, 7.76vw, 149px) clamp(24px, 8.8vw, 169px) 120px; }
          .sv-work-card { padding: clamp(30px, 2.4vw, 46px) clamp(24px, 5.625vw, 108px) clamp(48px, 5.625vw, 108px); }
          .sv-work-title { font-size: clamp(34px, 2.604vw, 50px); }
          .sv-work-grid { margin-top: clamp(28px, 2.29vw, 44px); column-gap: clamp(10px, 0.73vw, 14px); row-gap: clamp(12px, 0.83vw, 16px); }
        }

        .sv-tile { display: block; color: #fff; text-decoration: none; outline: none; }
        .sv-tile-media {
          position: relative; overflow: hidden; border-radius: 4px; background: #111;
          aspect-ratio: 446 / 250;
        }
        .sv-tile-media img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sv-tile-soon {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(0, 0, 0, 0.33); opacity: 0; transition: opacity 0.25s;
        }
        .sv-tile-soon span {
          color: #fff; font-family: ${MONO}; font-weight: 500; text-transform: uppercase;
          font-size: clamp(24px, 2.083vw, 40px); line-height: 1; white-space: nowrap;
          transform: translateY(0.25em); /* the design sits the label just below centre */
        }
        .sv-tile-caption { padding-top: 2px; }
        .sv-tile-name {
          /* brand names in IBM Plex Mono SemiBold */
          margin: 0; font-family: ${MONO}; font-weight: 600; text-transform: uppercase;
          font-size: clamp(16px, 1.042vw, 20px); line-height: 1.25; transition: color 0.2s;
        }
        .sv-tile-sub { margin: 5px 0 0; font-family: ${MONO}; font-weight: 400; font-size: clamp(12px, 0.73vw, 14px); line-height: 1.5; }

        @media (hover: hover) {
          .sv-tile:hover .sv-tile-soon { opacity: 1; }
          .sv-tile-live:hover .sv-tile-name { color: #5683DD; }
          .sv-tile-live:hover .sv-tile-media img { transform: scale(1.03); }
        }
        /* keyboard and tap: the same states */
        .sv-tile:focus-visible .sv-tile-soon, .sv-tile:focus .sv-tile-soon { opacity: 1; }
        .sv-tile-live:focus-visible .sv-tile-name { color: #5683DD; }
        .sv-tile-live:focus-visible .sv-tile-media { box-shadow: 0 0 0 2px #5683DD; }
        @media (prefers-reduced-motion: reduce) { .sv-tile-media img, .sv-tile-soon { transition: none; } }
      `}</style>

      <div className="sv-work-wrap">
        <motion.section
          className="sv-work-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          aria-labelledby="sv-work-title"
        >
          <div className="sv-work-head">
            <h1 id="sv-work-title" className="sv-work-title">Work</h1>
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
          <ul className="sv-work-grid">
            <AnimatePresence mode="popLayout" initial={true}>
              {shown.map((w, i) => (
                <Tile key={w.slug} work={w} index={i} firstPaint={firstPaint} />
              ))}
            </AnimatePresence>
          </ul>
        </motion.section>
      </div>
    </SiteShell>
  )
}

export default Work
