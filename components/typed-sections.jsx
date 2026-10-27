'use client'

// The copy reveal shared by case studies and News + Insights articles: Section renders a heading
// with its paragraph and/or list; TypedSections types sections out in the site's typewriter style.
// Styling comes from the page (.sv-cs-section, .sv-cs-caret).

import { useEffect, useState } from 'react'

const TYPE_CHARS = 3 // characters per tick: the site's typewriter speed
const TYPE_MS = 12

export function Section({ s }) {
  return (
    <section className="sv-cs-section">
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
  )
}

// Types the given sections out, heading by heading, line by line.
export function TypedSections({ sections, onTick, onDone, skipRef }) {
  const parts = []
  sections.forEach((s, si) => {
    parts.push({ si, kind: 'h', text: s.heading })
    if (s.body) parts.push({ si, kind: 'p', text: s.body })
    ;(s.list || []).forEach((t) => parts.push({ si, kind: 'li', text: t }))
  })
  const total = parts.reduce((n, p) => n + p.text.length, 0)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (typed >= total) { onDone(); return }
    const t = setTimeout(() => setTyped((c) => Math.min(total, c + TYPE_CHARS)), TYPE_MS)
    return () => clearTimeout(t)
  }, [typed, total, onDone])
  useEffect(() => { onTick() }, [typed, onTick])
  useEffect(() => { skipRef.current = () => setTyped(total) }, [skipRef, total])

  let offset = 0
  const shown = parts.map((p) => {
    const start = offset
    offset += p.text.length
    const n = Math.max(0, Math.min(p.text.length, typed - start))
    // the caret stays on a line until the next one starts, so it never blinks out between lines
    return { ...p, n, active: typed > start && typed <= offset && typed < total }
  })
  const text = (p) => (
    <>
      {p.text.slice(0, p.n)}
      {p.active && <span className="sv-cs-caret" />}
    </>
  )
  return (
    <div aria-hidden="true">
      {sections.map((s, si) => {
        const mine = shown.filter((p) => p.si === si)
        if (mine[0].n === 0) return null
        const items = mine.filter((p) => p.kind === 'li')
        return (
          <section className="sv-cs-section" key={s.heading}>
            {mine.filter((p) => p.kind !== 'li').map((p, k) =>
              p.kind === 'h' ? <h2 key={k}>{text(p)}</h2> : <p key={k}>{text(p)}</p>
            )}
            {items.length > 0 && (
              <ul>
                {items.filter((p) => p.n > 0).map((p, k) => <li key={k}>{text(p)}</li>)}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}

