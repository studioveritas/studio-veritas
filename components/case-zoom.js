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
