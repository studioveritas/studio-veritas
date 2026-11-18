'use client'

// Day / night: a live clock and a pill toggle, top-right corner of every page.
//
//   In Amsterdam:   ● AMS 11:29:26            [ ●]
//   Anywhere else:  ● AMS 11:29 · ● NYC 05:29  [ ●]
//
// - The studio's time (AMS) always shows; visitors elsewhere also see their own time and
//   a three-letter code for their city, worked out from the browser's time zone.
// - Each dot is the real sky in that city: green while the sun is up, blue after sunset.
//   The dots follow the sun only; the toggle never changes them.
// - By default the site follows the sun: it is night from sunset to sunrise at the
//   visitor's city (computed in the head script, window.svSun). It switches by itself
//   at sunset and sunrise while the page is open.
// - The toggle overrides that for the rest of the visit (sessionStorage `sv-theme`).
//
// The theme itself is the class `sv-night` on <html> (set before first paint by the
// head script in app/layout.tsx); every night style lives in app/globals.css.

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import { SPRING_SNAP, SPRING_FLICK, FADE, nearestSnap, rubberband, releaseVelocity } from './motion'

export const THEME_KEY = 'sv-theme'

function stars(n, seed) {
  let s = seed
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  return Array.from({ length: n }, () => {
    const big = r() > 0.9
    return {
      left: `${(r() * 100).toFixed(2)}%`,
      top: `${(r() * 82).toFixed(2)}%`,
      size: big ? 2.2 : +(0.9 + r() * 0.8).toFixed(1),
      delay: `${(r() * 5).toFixed(2)}s`,
      dur: `${(2.6 + r() * 3.6).toFixed(2)}s`,
    }
  })
}

const pad = (n) => String(n).padStart(2, '0')

// Hours, minutes and seconds of `d` in a given IANA time zone.
function partsIn(d, tz) {
  try {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
    const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]))
    return [p.hour, p.minute, p.second]
  } catch (e) {
    return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())]
  }
}

function applyTheme(night, animate) {
  const html = document.documentElement
  if (html.classList.contains('sv-night') === night) return
  if (animate) {
    html.classList.add('sv-theme-anim')
    window.clearTimeout(applyTheme.t)
    applyTheme.t = window.setTimeout(() => html.classList.remove('sv-theme-anim'), 500)
  }
  html.classList.toggle('sv-night', night)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', night ? '#000000' : '#D8FF00')
}

export function ThemeSwitch() {
  const [night, setNight] = useState(false)
  const [now, setNow] = useState(null)
  const [city, setCity] = useState(null)
  const field = useMemo(() => stars(150, 23), [])

  useEffect(() => {
    setNight(document.documentElement.classList.contains('sv-night'))
    setCity(window.svSun ? window.svSun.city() : null)
    const tick = () => {
      const d = new Date()
      setNow(d)
      // Follow the sun unless the visitor chose a mode this visit.
      let chosen = null
      try { chosen = sessionStorage.getItem(THEME_KEY) } catch (e) {}
      if (!chosen && window.svSun) {
        const n = window.svSun.isNight(d)
        if (n !== document.documentElement.classList.contains('sv-night')) {
          applyTheme(n, true)
          setNight(n)
        }
      }
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const toggle = () => {
    const next = !night
    applyTheme(next, true)
    try { sessionStorage.setItem(THEME_KEY, next ? 'night' : 'day') } catch (e) {}
    setNight(next)
  }

  const sun = typeof window !== 'undefined' ? window.svSun : null
  const ams = sun ? sun.ams : { code: 'AMS', tz: 'Europe/Amsterdam' }
  const inAms = !city || city.tz === ams.tz
  const clocks = now
    ? (inAms ? [ams] : [ams, city]).map((c) => {
        const [h, m, sec] = c === city ? [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())] : partsIn(now, c.tz)
        return { code: c.code, h, m, s: sec, dark: sun ? sun.isNight(now, c) : false }
      })
    : []
  const spoken = clocks.map((c) => `${c.code} ${c.h}:${c.m}, ${c.dark ? 'night' : 'day'}`).join('; ')

  return (
    <>
      <div className="sv-stars" aria-hidden="true">
        {field.map((s, i) => (
          <span key={i} style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.dur }} />
        ))}
        <i className="sv-shoot" />
      </div>

      <div className={`sv-daynight${inAms ? '' : ' is-dual'}`}>
        <p className={`sv-clock${inAms ? '' : ' is-dual'}`} aria-label={`Local time: ${spoken}`}>
          {clocks.map((c, k) => (
            <span key={c.code} className="sv-clock-item" aria-hidden="true">
              {k > 0 ? <span className="sv-clock-sep">·</span> : null}
              <span className={`sv-clock-dot${c.dark ? ' is-dark' : ''}`} title={c.dark ? `Night in ${c.code}` : `Day in ${c.code}`} />
              <span className="sv-clock-city">{c.code}</span>
              <time suppressHydrationWarning>
                {c.h}<span className="sv-clock-colon">:</span>{c.m}
                {inAms ? <>:{c.s}</> : null}
              </time>
            </span>
          ))}
        </p>
        <Toggle night={night} onChange={(v) => { if (v !== night) toggle() }} />
      </div>
    </>
  )
}

// The pill toggle (Apple-style): press feedback on pointer-down, the knob follows the
// finger 1:1 from where it was grabbed, rubber-bands past either end, and on release
// the flick's velocity is projected forward to choose day or night. Tap still toggles.
// The knob is a spring, so a second tap mid-travel simply reverses it from where it is.
function Toggle({ night, onChange }) {
  const btn = useRef(null)
  const knob = useRef(null)
  const x = useMotionValue(0)
  const reduce = useReducedMotion()
  const drag = useRef(null) // { id, startX, startKnob, travel, moved, samples }

  const travel = () => {
    const b = btn.current, k = knob.current
    if (!b || !k) return 20
    return b.clientWidth - k.offsetWidth - 2 * k.offsetLeft
  }
  // keep the knob in sync with the theme (including the sun flipping it at dusk)
  useEffect(() => {
    if (drag.current) return
    animate(x, night ? travel() : 0, reduce ? FADE : SPRING_SNAP)
  }, [night]) // eslint-disable-line react-hooks/exhaustive-deps

  const down = (e) => {
    if (e.button > 0) return
    btn.current.setPointerCapture(e.pointerId)
    x.stop() // grab it mid-flight, from where it is on screen
    drag.current = { id: e.pointerId, startX: e.clientX, startKnob: x.get(), travel: travel(), moved: false, samples: [[e.clientX, e.timeStamp]] }
    btn.current.dataset.pressed = '1'
  }
  const move = (e) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const dx = e.clientX - d.startX
    if (!d.moved && Math.abs(dx) < 4) return // hysteresis before it becomes a drag
    d.moved = true
    let v = d.startKnob + dx
    if (v < 0) v = rubberband(v, d.travel)
    else if (v > d.travel) v = d.travel + rubberband(v - d.travel, d.travel)
    x.set(v)
    d.samples.push([e.clientX, e.timeStamp])
    if (d.samples.length > 5) d.samples.shift()
  }
  const up = (e) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    drag.current = null
    delete btn.current.dataset.pressed
    if (!d.moved) { onChange(!night); return } // a tap
    const velocity = releaseVelocity(d.samples, e.timeStamp)
    // a small control coasts less far than a page: snappier deceleration (0.99) for the projection
    const end = nearestSnap(x.get(), velocity, [0, d.travel], 0.99)
    const nextNight = end > 0
    // hand the finger's velocity to the spring so there's no seam; a little bounce only because it was thrown
    animate(x, end, reduce ? FADE : { ...(Math.abs(velocity) > 200 ? SPRING_FLICK : SPRING_SNAP), velocity })
    if (nextNight !== night) onChange(nextNight)
  }
  const cancel = () => {
    drag.current = null
    if (btn.current) delete btn.current.dataset.pressed
    animate(x, night ? travel() : 0, SPRING_SNAP)
  }

  return (
    <button
      ref={btn}
      type="button"
      role="switch"
      aria-checked={night}
      aria-label="Night mode"
      title={night ? 'Switch to day' : 'Switch to night'}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={cancel}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!night) } }}
      className="sv-toggle"
      style={{ touchAction: 'none' }}
    >
      <motion.span ref={knob} className="sv-toggle-knob" aria-hidden="true" style={{ x }} />
    </button>
  )
}
