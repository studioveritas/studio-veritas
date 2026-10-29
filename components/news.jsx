'use client'

// News + Insights: a full-width warm-brown band holding a masonry grid of article tiles,
// laid out like the Work page. Tile images sit in a brown monotone and come into full colour
// on rollover (on touch screens, as the tile reaches the middle of the screen). Each tile
// links to its article at /news/<slug>; COMING SOON tiles don't link yet.
// READ MORE adds the next nine tiles. Content lives in components/news-data.js.

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SiteShell } from './site-shell'
import { PageTag } from './site-chrome'
import { useColumns } from './use-columns'
import { NEWS } from './news-data'

const MONO = "'IBM Plex Mono', monospace"
const PAGE = 9
const SQUARES = [0, 2] // in each run of nine, these positions are square; the rest are 4:5
export const BROWN = '#ddc9b8'
export const BROWN_LIGHT = '#ead5c3'

const shapeOf = (n) => n.shape || (SQUARES.includes(NEWS.indexOf(n) % PAGE) ? 'square' : 'portrait')

function NewsTile({ item, order }) {
  const ref = useRef(null)
  const [lit, setLit] = useState(false)
  const soon = Boolean(item.comingSoon)

  // Touch screens have no rollover: bring the colour up while the tile is mid-screen.
  useEffect(() => {
    if (!window.matchMedia?.('(hover: none)').matches || !ref.current) return
    const io = new IntersectionObserver(([e]) => setLit(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const inner = (
    <div className={`sv-nw-media sv-nw-${shapeOf(item)}`} data-lit={lit && !soon ? 'true' : 'false'}>
      <img src={item.tile} alt="" loading={order < 6 ? 'eager' : 'lazy'} draggable={false} />
      {soon && (
        <div className="sv-nw-soon" aria-hidden="true">
          <span>Coming soon</span>
        </div>
      )}
      <div className={`sv-nw-box${soon ? ' sv-nw-box-ink' : ''}`}>
        <p className="sv-nw-name">{item.name}</p>
        <p className="sv-nw-title">{item.title}</p>
      </div>
    </div>
  )

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: (order % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {soon ? (
        <div className="sv-nw-tile" tabIndex={0} aria-label={`${item.name}: ${item.title}. Coming soon`}>
          {inner}
        </div>
      ) : (
        <a href={`/news/${item.slug}`} className="sv-nw-tile sv-nw-live" aria-label={`${item.name}: ${item.title}. Read the article`}>
          {inner}
        </a>
      )}
    </motion.article>
  )
}

export function News() {
  const [count, setCount] = useState(PAGE)
  const [allShown, setAllShown] = useState(false)
  const cols = useColumns()
  const visible = NEWS.slice(0, count)
  const more = NEWS.length > count
  // Each tile goes into the shortest column so far (square = 1, 4:5 = 1.25 tall).
  const columns = Array.from({ length: cols }, () => [])
  const heights = Array(cols).fill(0)
  visible.forEach((n, i) => {
    const c = heights.indexOf(Math.min(...heights))
    columns[c].push({ n, i })
    heights[c] += shapeOf(n) === 'square' ? 1 : 1.25
  })

  return (
    <SiteShell
      pageKey="news"
      srOnly={
        <>
          <h2>Studio Veritas — News + Insights</h2>
          <ul>
            {NEWS.map((n) => (
              <li key={n.slug}>
                {n.name}: {n.title}.{n.comingSoon ? ' Coming soon.' : ` /news/${n.slug}`}
              </li>
            ))}
          </ul>
        </>
      }
    >
      <style>{`
        .sv-nw { padding-top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 12px); }
        .sv-nw-band { background: ${BROWN}; color: #000; border-top: 1px solid #000; padding: 28px 0 40px; min-height: calc(100vh - var(--sv-nav-top) - var(--sv-nav-h) - 12px); }
        .sv-nw-inner { max-width: 1366px; margin: 0 auto; padding: 0 12px; }
        .sv-nw-head { display: flex; }
        .sv-nw-head .sv-tag { min-width: 0; width: min(100%, 360px); padding-top: 14px; padding-bottom: 14px; }

        .sv-mason { display: flex; align-items: flex-start; gap: 12px; margin-top: 24px; }
        .sv-mason-col { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 12px; }

        .sv-nw-tile { display: block; color: #000; text-decoration: none; outline: none; }
        .sv-nw-media { position: relative; overflow: hidden; border-radius: 3px; background: #2a2119; }
        .sv-nw-square { aspect-ratio: 1 / 1; }
        .sv-nw-portrait { aspect-ratio: 4 / 5; }
        .sv-nw-media img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          /* the brown monotone; rollover brings the colour back */
          filter: grayscale(1) sepia(0.62) saturate(0.9) brightness(0.9) contrast(1.04);
          transition: filter 0.55s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sv-nw-media[data-lit='true'] img { filter: none; }
        @media (hover: hover) {
          .sv-nw-live:hover .sv-nw-media img { filter: none; transform: scale(1.035); }
          .sv-nw-live:hover .sv-nw-name { color: #5683DD; }
        }
        .sv-nw-live:focus-visible .sv-nw-media img { filter: none; }
        .sv-nw-live:focus-visible .sv-nw-media { box-shadow: 0 0 0 2px #5683DD; }
        .sv-nw-live:focus-visible .sv-nw-name { color: #5683DD; }

        .sv-nw-box {
          position: absolute; left: 8px; bottom: 8px; max-width: calc(100% - 16px); min-width: min(72%, calc(100% - 16px));
          padding: 8px 12px 9px; background: ${BROWN}; color: #000; border-radius: 2px;
        }
        .sv-nw-box-ink { background: #000; color: ${BROWN}; }
        .sv-nw-name { margin: 0; font-family: ${MONO}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; font-size: 15px; line-height: 1.25; transition: color 0.2s; }
        .sv-nw-title { margin: 3px 0 0; font-family: ${MONO}; font-weight: 400; font-size: 11.5px; line-height: 1.4; }
        .sv-nw-soon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.18); }
        .sv-nw-soon span { color: ${BROWN}; font-family: ${MONO}; font-weight: 500; text-transform: uppercase; font-size: clamp(22px, 1.9vw, 36px); line-height: 1; white-space: nowrap; }

        .sv-more-row { display: flex; justify-content: center; margin-top: 40px; }
        .sv-nw-more {
          display: inline-flex; align-items: center; justify-content: space-between; gap: 40px;
          min-width: 220px; padding: 12px 18px; background: #000; color: ${BROWN}; border: 0; border-radius: 3px;
          font-family: ${MONO}; font-weight: 500; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase;
          transition: background-color 0.2s, color 0.2s;
        }
        .sv-nw-more .plus { font-size: 22px; font-weight: 300; line-height: 0.8; transition: transform 0.3s; }
        .sv-nw-more:hover, .sv-nw-more:focus-visible { background: #5683DD; color: #fff; outline: none; }
        .sv-nw-more:hover .plus { transform: rotate(90deg); }
        .sv-nw-more[data-done='true'] { background: transparent; color: #000; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.45); }

        @media (min-width: 768px) {
          .sv-nw { padding-top: calc(var(--sv-nav-top) + var(--sv-nav-h) + 26px); }
          .sv-nw-band { padding: clamp(40px, 3.9vw, 75px) 0 clamp(110px, 7vw, 130px); min-height: calc(100vh - var(--sv-nav-top) - var(--sv-nav-h) - 26px); }
          .sv-nw-inner { padding: 0 24px; }
          .sv-nw-head .sv-tag { width: auto; min-width: 280px; padding: 16px 64px 16px 28px; }
          .sv-mason { gap: 14px; margin-top: clamp(32px, 2.6vw, 50px); }
          .sv-mason-col { gap: 14px; }
          .sv-nw-box { left: 10px; bottom: 10px; max-width: calc(100% - 20px); padding: 9px 14px 10px; }
          .sv-nw-name { font-size: clamp(15px, 1.04vw, 20px); }
          .sv-nw-title { font-size: clamp(11.5px, 0.73vw, 14px); }
          .sv-more-row { margin-top: clamp(40px, 2.6vw, 52px); }
          .sv-nw-more { min-width: 260px; padding: 14px 22px; font-size: 16px; }
        }
        @media (prefers-reduced-motion: reduce) { .sv-nw-media img, .sv-nw-more .plus { transition: none; } }
      `}</style>

      <div className="sv-nw">
        <section className="sv-nw-band" aria-labelledby="sv-nw-title">
          <div className="sv-nw-inner">
            <div className="sv-nw-head" id="sv-nw-title">
              <PageTag label="News + Insights" tone="ink" align="left" closeLabel="Close News + Insights" />
            </div>

            <div className="sv-mason" key={cols}>
              {columns.map((col, c) => (
                <div className="sv-mason-col" key={c}>
                  {col.map(({ n, i }) => (
                    <NewsTile key={n.slug} item={n} order={i} />
                  ))}
                </div>
              ))}
            </div>

            <div className="sv-more-row">
              <button
                type="button"
                className="sv-nw-more"
                data-done={allShown && !more}
                aria-live="polite"
                onClick={() => (more ? setCount((c) => c + PAGE) : setAllShown(true))}
              >
                <span className="plus" aria-hidden="true">+</span>
                <span>{allShown && !more ? 'More soon' : 'Read more'}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}

export default News
