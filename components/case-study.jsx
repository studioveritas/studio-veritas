'use client'

// Case study: the project photo fills the card, with a black title box (name +
// subheading + X back to Experience) and a white box of the case study copy on
// the left. The arrows step to the previous/next published case study: filled
// when there is one that way, outline when there isn't (as in the design, where
// the first case study shows an outline left arrow).
// Sizes are taken from the design at 1920x1080 and scale down with the viewport.

import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { SiteShell } from './site-shell'
import { getCaseStudy, getNeighbours, caseSubheading } from './work-data'
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

export function CaseStudy({ slug }) {
  const work = getCaseStudy(slug)
  const { prev, next } = getNeighbours(slug)
  const cs = work?.caseStudy

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
            text: cs.sections
              .map((s) => `${s.heading}: ${s.body || (s.list || []).join(' ')}`)
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
        .sv-cs-body h2 { margin: 0; font: inherit; font-weight: 600; text-transform: uppercase; }
        .sv-cs-body p { margin: 0; }
        .sv-cs-section + .sv-cs-section { margin-top: 1.38em; }
        .sv-cs-body ul { margin: 0; padding: 0; list-style: none; }
        .sv-cs-body li { position: relative; padding-left: 1.2em; }
        .sv-cs-body li::before { content: '•'; position: absolute; left: 0.45em; }
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
          .sv-cs-body { flex: 1 1 auto; padding: clamp(16px, 1.25vw, 24px) clamp(18px, 1.5625vw, 30px) clamp(18px, 1.5625vw, 30px); font-size: clamp(13px, 0.9375vw, 18px); line-height: 1.278; }
          .sv-cs-section + .sv-cs-section { margin-top: 1.278em; }
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
              <h1 id="sv-cs-name" className="sv-cs-name">{work.name}</h1>
              <p className="sv-cs-sub">{caseSubheading(work)}</p>
              <a className="sv-cs-close" href="/experience" aria-label="Close case study, back to Experience">X</a>
            </header>

            <div className="sv-cs-body" tabIndex={0} aria-label={`${work.client} case study`}>
              {cs.sections.map((s) => (
                <section className="sv-cs-section" key={s.heading}>
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
              ))}
            </div>
          </div>

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
