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

import { useEffect, useMemo, useState } from 'react'

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
        <button
          type="button"
          role="switch"
          aria-checked={night}
          aria-label="Night mode"
          title={night ? 'Switch to day' : 'Switch to night'}
          onClick={toggle}
          className="sv-toggle"
        >
          <span className="sv-toggle-knob" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
