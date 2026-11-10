'use client'

// Truth Invaders — the Studio Veritas secret arcade.
// Full-screen over the whole site (nav, Ask Veritas, grain), so the page underneath doesn't matter.
//   mode="404"    → every page that doesn't exist (app/not-found.tsx)
//   mode="secret" → /play, reached from the "work → PLAY" rollover on the contact page
// ESC leaves the game and goes to `exitTo`. The engine itself is engine.js (no dependencies).

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createGame } from './engine'

const FONTS = {
  mono: "'IBM Plex Mono', ui-monospace, Menlo, monospace",
  display: "'Chakra Petch', 'IBM Plex Mono', ui-monospace, monospace",
}

export default function TruthInvaders({ mode = '404', exitTo = '/', prize }) {
  const canvasRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const game = createGame(canvas, { mode, prize, fonts: FONTS, onExit: () => router.push(exitTo) })
    canvas.focus({ preventScroll: true })
    const html = document.documentElement
    const prev = { body: document.body.style.overflow, html: html.style.overflow }
    document.body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => {
      game.destroy()
      document.body.style.overflow = prev.body
      html.style.overflow = prev.html
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, exitTo])

  return (
    <div
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
