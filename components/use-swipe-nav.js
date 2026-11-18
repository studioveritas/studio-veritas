'use client'
// Swipe between case studies (touch and pen), Apple "fluid interface" style:
//   • waits ~10px to see whether the finger means horizontal (then takes over) or vertical (then lets the page scroll)
//   • the hero and its photo follow the finger 1:1, rubber-banding where there is no neighbour
//   • the arrow on the side you're heading towards brightens as you go (hint in the direction of the gesture)
//   • on release the flick is projected forward; past ~30% of the screen it commits, otherwise it springs home,
//     and either way the spring starts with the finger's own velocity — no seam between drag and animation
//   • grab it again mid-spring and it stops where it is and follows you
import { useEffect } from 'react'
import { animate } from 'framer-motion'
import { SPRING, project, rubberband, prefersReducedMotion, releaseVelocity } from './motion'

export function useSwipeNav(rootRef, { prev, next }) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const layers = () => [root.querySelector('.sv-cx-stage img'), root.querySelector('.sv-cx-hero')].filter(Boolean)
    const arrow = (dir) => document.querySelector(`.sv-cx-arrow-${dir}`)
    let g = null
    let running = []

    const setX = (x) => {
      const w = window.innerWidth
      layers().forEach((el, i) => { el.style.translate = `${i === 0 ? x * 0.6 : x}px 0` }) // photo moves slower: depth
      const p = arrow('prev'), n = arrow('next')
      if (p) p.style.opacity = String(x > 0 ? 1 : Math.max(0.35, 1 - Math.abs(x) / (w * 0.3)))
      if (n) n.style.opacity = String(x < 0 ? 1 : Math.max(0.35, 1 - Math.abs(x) / (w * 0.3)))
      if (p) p.style.scale = String(x > 0 ? 1 + Math.min(x / w, 0.3) : 1)
      if (n) n.style.scale = String(x < 0 ? 1 + Math.min(-x / w, 0.3) : 1)
    }
    let current = 0

    const down = (e) => {
      if (e.pointerType === 'mouse' || !e.isPrimary) return
      if (e.target.closest('a, button, [data-sv-modal="open"]')) return
      running.forEach((a) => a.stop()); running = [] // interruptible: catch it mid-flight
      g = { id: e.pointerId, x0: e.clientX, y0: e.clientY, start: current, mode: null, samples: [[e.clientX, e.timeStamp]] }
    }
    const move = (e) => {
      if (!g || e.pointerId !== g.id) return
      const dx = e.clientX - g.x0, dy = e.clientY - g.y0
      if (!g.mode) {
        if (Math.hypot(dx, dy) < 10) return
        g.mode = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y'
        if (g.mode === 'y') { g = null; return }
        try { root.setPointerCapture(e.pointerId) } catch (_) {}
      }
      const w = window.innerWidth
      let x = g.start + dx
      if ((x > 0 && !prev) || (x < 0 && !next)) x = rubberband(x, w) // nothing that way: resist
      current = x
      setX(x)
      g.samples.push([e.clientX, e.timeStamp]); if (g.samples.length > 5) g.samples.shift()
    }
    const up = (e) => {
      if (!g || e.pointerId !== g.id) return
      const v = releaseVelocity(g.samples, e.timeStamp)
      g = null
      const w = window.innerWidth
      const landing = current + project(v)
      const target = landing > w * 0.3 && prev ? prev : landing < -w * 0.3 && next ? next : null
      const to = target ? (target === prev ? w : -w) : 0
      const opts = prefersReducedMotion() ? { duration: 0.15 } : { ...SPRING, velocity: v }
      const ctl = animate(current, to, { ...opts, onUpdate: (x) => { current = x; setX(x) } })
      running = [ctl]
      if (target) {
        layers().forEach((el) => animate(el, { opacity: 0 }, { duration: 0.25 }))
        ctl.then(() => { window.location.href = target.href })
      }
    }

    root.addEventListener('pointerdown', down)
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerup', up)
    root.addEventListener('pointercancel', up)
    return () => {
      root.removeEventListener('pointerdown', down)
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerup', up)
      root.removeEventListener('pointercancel', up)
      running.forEach((a) => a.stop())
    }
  }, [rootRef, prev, next])
}
