'use client'

// Client logos on a band that scrolls left to right in a continuous loop.
// The logos come from components/clients-data.js (the studio's client list).
// Hovering pauses it; with reduced motion it stands still and can be scrolled by hand.

import { CLIENTS } from './clients-data'

const MONO = "'IBM Plex Mono', monospace"

export function LogoTicker({ seconds = 70 }) {
  const row = (copy) =>
    CLIENTS.map((c) => (
      <li key={`${copy}-${c.id}`} className="sv-ticker-item" aria-hidden={copy > 0 || undefined}>
        <img src={c.logo} alt={copy > 0 ? '' : c.name} draggable={false} />
      </li>
    ))

  return (
    <section className="sv-ticker" aria-label="Clients">
      <style>{`
        .sv-ticker { position: relative; overflow: hidden; background: #f6f4ee; color: #000; }
        .sv-ticker-track {
          display: flex; width: max-content; margin: 0; padding: 0; list-style: none;
          animation: sv-ticker ${seconds}s linear infinite;
        }
        /* two identical runs side by side; sliding one run's width to the right loops seamlessly */
        @keyframes sv-ticker { from { transform: translate3d(-50%, 0, 0); } to { transform: translate3d(0, 0, 0); } }
        .sv-ticker:hover .sv-ticker-track { animation-play-state: paused; }
        .sv-ticker-item { flex: none; display: flex; align-items: center; justify-content: center; height: 58px; padding: 0 22px; }
        .sv-ticker-item img { display: block; height: 22px; max-width: 96px; width: auto; object-fit: contain; filter: brightness(0); }
        @media (min-width: 768px) {
          .sv-ticker-item { height: 80px; padding: 0 clamp(28px, 2.6vw, 50px); }
          .sv-ticker-item img { height: 30px; max-width: 132px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sv-ticker { overflow-x: auto; }
          .sv-ticker-track { animation: none; }
        }
        .sv-ticker-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; font-family: ${MONO}; }
      `}</style>
      <h2 className="sv-ticker-label">Clients we have worked with</h2>
      <ul className="sv-ticker-track">
        {row(0)}
        {row(1)}
      </ul>
    </section>
  )
}
