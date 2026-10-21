'use client'

// Experience: the selected-work grid. A white card on the site background with
// tiles of work, each with a name and subheading. Tiles with a case study link
// to /experience/<slug>; the rest show COMING SOON on rollover.
// Sizes are taken from the design at 1920 wide and scale down with the viewport.

import { motion } from 'framer-motion'
import { SiteShell } from './site-shell'
import { WORK } from './work-data'
import { WORK_TILES } from './work-images'

const MONO = "'IBM Plex Mono', monospace"

function Tile({ work, index }) {
  const live = Boolean(work.caseStudy)
  const media = (
    <div className="sv-tile-media">
      <img src={WORK_TILES[work.img]} alt="" draggable={false} />
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
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

export function Work() {
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
            name: 'Studio Veritas — Experience',
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
        /* Card: 1582px wide at 1920 (169px each side), 1px black border */
        .sv-work-wrap { padding: 80px 16px 104px; }
        .sv-work-card {
          width: 100%; max-width: 1582px; margin: 0 auto;
          background: #fff; border: 1px solid #000; border-radius: 4px;
          padding: 28px 18px 40px;
        }
        .sv-work-title {
          margin: 0; color: #000; font-family: ${MONO}; font-weight: 700;
          text-transform: uppercase; line-height: 1; font-size: 30px;
        }
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

        .sv-tile { display: block; color: #000; text-decoration: none; outline: none; }
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
          margin: 0; font-family: ${MONO}; font-weight: 400; text-transform: uppercase;
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
          <h1 id="sv-work-title" className="sv-work-title">Experience</h1>
          <ul className="sv-work-grid">
            {WORK.map((w, i) => (
              <Tile key={w.slug} work={w} index={i} />
            ))}
          </ul>
        </motion.section>
      </div>
    </SiteShell>
  )
}

export default Work
