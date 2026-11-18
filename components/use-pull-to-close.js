'use client'
// Pull a case study down to close it (touch). At the top of the page, a downward drag
// takes over from the browser's overscroll: the page shrinks and lifts away 1:1 with the
// finger (rubber-banded), and on release the flick is projected forward. Far enough and
// it goes back to Work, where the photo shrinks into its tile (components/case-zoom.js);
// otherwise it springs back with the finger's speed. Grab it again mid-spring to catch it.
import { useEffect } from 'react'
import { animate } from 'framer-motion'
import { SPRING, project, rubberband, prefersReducedMotion, releaseVelocity, haptic } from './motion'

export function usePullToClose(rootRef, onClose) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const targets = () => [root.querySelector('.sv-cx-stage'), root.querySelector('.sv-cx-inner')].filter(Boolean)
    let g = null
    let pull = 0
    let running = null

    const paint = (d) => {
      const vh = window.innerHeight
      const p = Math.min(Math.max(d, 0) / vh, 0.6)
      targets().forEach((el) => {
        el.style.transformOrigin = '50% 0%'
        // translate/scale, not transform: the stage is centred with its own transform
        el.style.translate = `0 ${d * 0.5}px`
        el.style.scale = String(1 - p * 0.35)
        el.style.borderRadius = `${Math.round(p * 60)}px`
        el.style.overflow = d > 0 ? 'hidden' : ''
      })
    }
    const reset = () => targets().forEach((el) => { el.style.translate = ''; el.style.scale = ''; el.style.borderRadius = ''; el.style.overflow = ''; el.style.transformOrigin = '' })

    const start = (e) => {
      if (e.touches.length !== 1 || window.scrollY > 0) return
      if (e.target.closest('a, button, [data-sv-modal="open"], .av-panel')) return
      running?.stop(); running = null
      const t = e.touches[0]
      g = { x0: t.clientX, y0: t.clientY, start: pull, on: false, samples: [[t.clientY, e.timeStamp]] }
    }
    const move = (e) => {
      if (!g) return
      const t = e.touches[0]
      const dx = t.clientX - g.x0, dy = t.clientY - g.y0
      if (!g.on) {
        if (Math.hypot(dx, dy) < 10) return
        if (dy <= 0 || Math.abs(dy) < Math.abs(dx) * 1.2 || window.scrollY > 0) { g = null; return }
        g.on = true
      }
      e.preventDefault() // ours now, not the browser's overscroll / pull-to-refresh
      const vh = window.innerHeight
      pull = g.start + rubberband(dy, vh, 0.9)
      paint(pull)
      g.samples.push([t.clientY, e.timeStamp]); if (g.samples.length > 5) g.samples.shift()
    }
    const end = (e) => {
      if (!g) return
      const was = g
      g = null
      if (!was.on) return
      const v = releaseVelocity(was.samples, e.timeStamp)
      const vh = window.innerHeight
      const commit = pull + project(v) * 0.5 > vh * 0.22 && v >= -50
      if (commit) { haptic(); onClose(); return }
      const opts = prefersReducedMotion() ? { duration: 0.15 } : { ...SPRING, velocity: v * 0.5 }
      running = animate(pull, 0, { ...opts, onUpdate: (d) => { pull = d; paint(d) }, onComplete: () => { pull = 0; reset() } })
    }

    root.addEventListener('touchstart', start, { passive: true })
    root.addEventListener('touchmove', move, { passive: false })
    root.addEventListener('touchend', end)
    root.addEventListener('touchcancel', end)
    return () => {
      root.removeEventListener('touchstart', start)
      root.removeEventListener('touchmove', move)
      root.removeEventListener('touchend', end)
      root.removeEventListener('touchcancel', end)
      running?.stop()
    }
  }, [rootRef, onClose])
}
