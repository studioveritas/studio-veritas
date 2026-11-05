'use client'

// The zoom from an Experience tile into its case study.
//
// Clicking a tile grows its image from where it sits on the grid to the case
// study's master image frame (full height, up to 1920px wide, centred, black
// beyond), crossfading from the tile photo to the master image on the way. Then
// the case study page loads and opens on exactly that frame: a flag in
// sessionStorage tells it to show the master image at once instead of fading it in.
//
// The Experience page looks the same; only the click changes. Cmd/Ctrl/Shift
// clicks, middle clicks and reduced motion keep the plain link behaviour.

export const MASTER_MAX_W = 1920
export const ZOOM_FLAG = 'sv-cx-zoom'
const ZOOM_MS = 900
const EASE = 'cubic-bezier(0.77, 0, 0.18, 1)'
const START_SCALE = 1.02 // the master image's drift starts here on the case study page

// The phone rule matches the <source> on the case study page.
const PHONE_PORTRAIT = '(max-width: 767px) and (orientation: portrait)'

export function masterOf(work) {
  const cs = work.caseStudy || {}
  const phone = typeof window !== 'undefined' && window.matchMedia?.(PHONE_PORTRAIT).matches
  const portrait = cs.masterPortrait || work.portrait
  const src = phone && portrait ? portrait : cs.hero?.startsWith('/') ? cs.hero : null
  return { src, position: phone && portrait ? '50% 50%' : cs.masterPosition || '50% 50%' }
}

// Inline script for the case study page: runs while the HTML is parsed, before
// first paint, so an arrival by zoom shows the master image with no fade.
export const zoomArrivalScript = (slug) =>
  `try{if(sessionStorage.getItem(${JSON.stringify(ZOOM_FLAG)})===${JSON.stringify(slug)})document.documentElement.dataset.svZoom='1'}catch(e){}`

export function clearZoomArrival() {
  try { sessionStorage.removeItem(ZOOM_FLAG) } catch (e) {}
  delete document.documentElement.dataset.svZoom
}

// Leftover overlays when the visitor comes back with the Back button (the page
// can be restored from the browser's cache exactly as it was left).
export function clearZoomOverlays() {
  document.querySelectorAll('.sv-zoom').forEach((el) => el.remove())
}

export function zoomToCaseStudy(event, work, tileImg) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const href = `/experience/${work.slug}`
  if (!tileImg || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  event.preventDefault()

  const from = tileImg.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = Math.min(vw, MASTER_MAX_W)
  const master = masterOf(work)
  const radius = getComputedStyle(tileImg.parentElement).borderRadius || '0px'

  const root = document.createElement('div')
  root.className = 'sv-zoom'
  root.setAttribute('aria-hidden', 'true')
  // Below the nav bar (40), which the case study page keeps in the same place.
  root.style.cssText = 'position:fixed;inset:0;z-index:35;pointer-events:none;'

  const black = document.createElement('div')
  black.style.cssText = 'position:absolute;inset:0;background:#000;opacity:0;'
  root.appendChild(black)

  const frame = document.createElement('div')
  frame.style.cssText = `position:absolute;left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;overflow:hidden;border-radius:${radius};background:#000;box-shadow:0 0 0 1px rgba(255,255,255,0.2);`
  const layer = (src, pos) => {
    const im = document.createElement('img')
    im.src = src
    im.alt = ''
    im.decoding = 'async'
    im.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};transform-origin:60% 40%;`
    frame.appendChild(im)
    return im
  }
  const tileLayer = layer(tileImg.currentSrc || tileImg.src, getComputedStyle(tileImg).objectPosition || '50% 50%')
  const masterLayer = master.src && master.src !== tileImg.getAttribute('src') ? layer(master.src, master.position) : null
  if (masterLayer) masterLayer.style.opacity = '0'
  root.appendChild(frame)
  document.body.appendChild(root)
  document.documentElement.dataset.svDarkBottom = '1' // white eye and footer triangle over the black

  // Load the master image (and so warm the cache for the case study page).
  const ready = masterLayer
    ? new Promise((res) => {
        if (masterLayer.complete && masterLayer.naturalWidth) res()
        else { masterLayer.onload = res; masterLayer.onerror = res }
      })
    : Promise.resolve()

  const to = { left: `${(vw - w) / 2}px`, top: '0px', width: `${w}px`, height: `${vh}px`, borderRadius: '0px' }
  const opts = { duration: ZOOM_MS, easing: EASE, fill: 'forwards' }
  black.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ZOOM_MS * 0.6, easing: 'ease', fill: 'forwards' })
  const grow = frame.animate(
    [{ left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: radius }, to],
    opts
  )
  tileLayer.animate([{ transform: 'scale(1)' }, { transform: `scale(${START_SCALE})` }], opts)
  if (masterLayer) {
    masterLayer.animate([{ transform: 'scale(1.12)' }, { transform: `scale(${START_SCALE})` }], opts)
    ready.then(() =>
      masterLayer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ZOOM_MS * 0.7, delay: ZOOM_MS * 0.2, easing: 'ease', fill: 'forwards' })
    )
  }

  try { sessionStorage.setItem(ZOOM_FLAG, work.slug) } catch (e) {}
  const go = () => window.location.assign(href)
  // Leave once the frame is full and the master image is showing (or after a
  // short wait for a slow image: the case study page then fades it in).
  Promise.all([grow.finished.catch(() => {}), Promise.race([ready, new Promise((r) => setTimeout(r, 1600))])]).then(() =>
    setTimeout(go, masterLayer ? 140 : 0)
  )
}

/* ------------------------------------------------------------ case study → case study */

// The case study page's shading over the master image: on the first screen, and
// once scrolled into the copy. Shared so the crossfade ends on the same frame.
export const HERO_SHADE =
  'radial-gradient(80% 65% at 0% 100%, rgba(0,0,0,0.85), rgba(0,0,0,0) 72%), linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)'
export const SCROLLED_SHADE = 'rgba(0, 0, 0, 0.68)'

const FADE_MS = 1000

// From one case study to another (Next case study, the arrows, ← →): the copy
// fades away, this master image crossfades into the next one, and the next case
// study opens on that frame at the top of its page.
// `event` may be null (keyboard). Returns true if it took over the navigation.
export function crossfadeToCaseStudy(event, work) {
  if (event && (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return false
  const href = `/experience/${work.slug}`
  const current = document.querySelector('.sv-cx-stage img')
  const stage = document.querySelector('.sv-cx-stage')
  const next = masterOf(work)
  if (!current || !stage || !next.src || document.querySelector('.sv-zoom')) return false
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
  event?.preventDefault()

  const r = stage.getBoundingClientRect()
  const cs = getComputedStyle(current)
  const scrolled = document.querySelector('.sv-cx[data-scrolled="1"]')

  const root = document.createElement('div')
  root.className = 'sv-zoom'
  root.setAttribute('aria-hidden', 'true')
  root.style.cssText = 'position:fixed;inset:0;z-index:35;pointer-events:none;background:#000;opacity:0;'
  const frame = document.createElement('div')
  frame.style.cssText = `position:absolute;left:${r.left}px;top:0;width:${r.width}px;height:${r.height}px;overflow:hidden;background:#000;box-shadow:0 0 0 1px rgba(255,255,255,0.2);`
  const layer = (src, pos, transform) => {
    const im = document.createElement('img')
    im.src = src
    im.alt = ''
    im.decoding = 'async'
    im.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};transform-origin:60% 40%;transform:${transform};`
    frame.appendChild(im)
    return im
  }
  const shade = (bg, opacity) => {
    const d = document.createElement('div')
    d.style.cssText = `position:absolute;inset:0;background:${bg};opacity:${opacity};`
    frame.appendChild(d)
    return d
  }
  // where the page is now: the current image, mid-drift, under its current shade
  layer(current.currentSrc || current.src, cs.objectPosition, cs.transform === 'none' ? 'none' : cs.transform)
  const nowShade = shade(scrolled ? SCROLLED_SHADE : HERO_SHADE, 1)
  // where the next page starts: its master at the start of the drift, first-screen shade
  const incoming = layer(next.src, next.position, 'scale(1.1)')
  incoming.style.opacity = '0'
  const nextShade = shade(HERO_SHADE, 0)
  root.appendChild(frame)
  document.body.appendChild(root)

  // the copy, arrows and X fade away; the overlay takes over beneath the nav
  const page = document.querySelectorAll('.sv-cx-inner, .sv-cx-close, .sv-cx-arrow')
  page.forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: 'ease', fill: 'forwards' }))
  root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: 300, fill: 'forwards' })

  const ready = new Promise((res) => {
    if (incoming.complete && incoming.naturalWidth) res()
    else { incoming.onload = res; incoming.onerror = res }
  })
  const opts = { duration: FADE_MS, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' }
  const run = ready.then(() => {
    nowShade.animate([{ opacity: 1 }, { opacity: 0 }], opts)
    nextShade.animate([{ opacity: 0 }, { opacity: 1 }], opts)
    incoming.animate([{ transform: 'scale(1.1)' }, { transform: `scale(${START_SCALE})` }], opts)
    return incoming.animate([{ opacity: 0 }, { opacity: 1 }], opts).finished
  })

  try { sessionStorage.setItem(ZOOM_FLAG, work.slug) } catch (e) {}
  // wait for the image, but not forever: the next page fades it in if it's slow
  Promise.race([run, new Promise((res) => setTimeout(res, 2400))]).then(() => setTimeout(() => window.location.assign(href), 60))
  return true
}
