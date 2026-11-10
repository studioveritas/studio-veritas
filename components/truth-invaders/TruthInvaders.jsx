'use client'

// Truth Invaders — the Studio Veritas secret arcade.
// Full-screen over the whole site (nav, Ask Veritas, grain), so the page underneath doesn't matter.
//   mode="404"    → every page that doesn't exist (app/not-found.tsx)
//   mode="secret" → /play, reached from the "work → PLAY" rollover on the contact page
// ESC leaves the game and goes to `exitTo`. The engine itself is engine.js (no dependencies).
//
// Night mode: the game turns pure white on pure black whenever the site is in night mode.
// The night-mode switch only has to mark <html> or <body> with ONE of:
//   data-theme="night"  ·  data-mode="night"  ·  class "night" / "sv-night" / "dark"
// The game watches for it and changes live. Preview it any time with ?night=1 (e.g. /play?night=1).

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createGame } from './engine'

export function siteIsNight() {
  if (typeof document === 'undefined') return false
  try { if (new URLSearchParams(window.location.search).get('night') === '1') return true } catch (e) { /* noop */ }
  return [document.documentElement, document.body].some((el) => el && (
    el.dataset.theme === 'night' || el.dataset.mode === 'night' ||
    el.classList.contains('night') || el.classList.contains('sv-night') || el.classList.contains('dark')
  ))
}

const FONTS = {
  mono: "'IBM Plex Mono', ui-monospace, Menlo, monospace",
  display: "'Chakra Petch', 'IBM Plex Mono', ui-monospace, monospace",
}

export default function TruthInvaders({ mode = '404', exitTo = '/', prize }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const applyNight = (on) => { if (wrapRef.current) wrapRef.current.style.background = on ? '#000' : '#060606' }
    let night = siteIsNight()
    applyNight(night)
    const game = createGame(canvas, { mode, prize, night, fonts: FONTS, onExit: () => router.push(exitTo) })
    // follow the site's night-mode switch live
    const mo = new MutationObserver(() => {
      const now = siteIsNight()
      if (now !== night) { night = now; game.setNight(now); applyNight(now) }
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-mode'] })
    mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-mode'] })
    canvas.focus({ preventScroll: true })
    const html = document.documentElement
    const prev = { body: document.body.style.overflow, html: html.style.overflow }
    document.body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => {
      mo.disconnect()
      game.destroy()
      document.body.style.overflow = prev.body
      html.style.overflow = prev.html
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, exitTo])

  return (
    <div
      ref={wrapRef}
      className="sv-arcade"
      role="application"
      aria-label="Truth Invaders, a retro arcade game. Left and right arrows move, up arrow fires, Escape exits."
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483000,
        background: '#060606',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <canvas ref={canvasRef} tabIndex={0} style={{ display: 'block', imageRendering: 'pixelated', outline: 'none' }} />
      <p style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
        {mode === '404'
          ? 'Error 404: this page could not be found. Play Truth Invaders, or press Escape to go to the Studio Veritas home page.'
          : 'Truth Invaders, the Studio Veritas secret arcade. Press Escape to go back to the contact page.'}
      </p>
    </div>
  )
}
