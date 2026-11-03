'use client'

// First-load intro on the home page: the sticker loader.
// The animation itself lives in public/sv-intro.js (framework-free, shared with the
// HTML prototype). That script is loaded blocking in <head> (app/layout.tsx), so on a
// first visit it hides the nav, eye, bottom bar and logo before the first paint. This
// component starts it once React has rendered the page.
//
// Variants: 'sticker' (stickers pop off, lead sticker lands as the logo) or
//           'peel'    (stickers peel off by hand; the lead sticker is peeled away to
//                      reveal the logo). Test either with /#intro-sticker or /#intro-peel.
// Plays once per browser session. Page hooks: data-sv-intro / data-sv-intro-step
// attributes in experience.jsx and site-chrome.jsx.

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const INTRO_VARIANT = 'sticker'

export function IntroLoader({ variant = INTRO_VARIANT }) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') return
    let tries = 0
    let timer
    let frame
    const start = () => {
      const sv = window.SVIntro
      if (!sv) {
        if (tries++ < 40) timer = setTimeout(start, 50)
        else document.documentElement.classList.remove('sv-intro')
        return
      }
      if (!sv.pending()) return
      // wait a frame so the logo has laid out
      frame = requestAnimationFrame(() => { if (sv.pending()) sv.run({ variant: sv.variantFromHash(variant) }) })
    }
    start()
    return () => { clearTimeout(timer); cancelAnimationFrame(frame) }
  }, [pathname, variant])

  return null
}

export default IntroLoader
