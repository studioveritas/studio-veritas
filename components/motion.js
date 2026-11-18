// Studio Veritas motion system — one place for every spring and gesture rule.
// Based on Apple's "Designing Fluid Interfaces" (WWDC 2018), translated for Framer Motion.
//
// The house rule: things the visitor didn't throw never bounce.
//   SPRING      — the default. Critically damped (no overshoot): menus, pop-outs, tags.
//   SPRING_SNAP — quicker, still no overshoot: small controls (toggle knob, chips).
//   SPRING_FLICK— a little bounce, ONLY after a gesture that carried momentum (a flick, a drag release).
// Framer's `bounce` + `duration` map to Apple's damping ratio + response: bounce 0 ≈ damping 1.0.

export const SPRING = { type: 'spring', bounce: 0, duration: 0.4 }
export const SPRING_SNAP = { type: 'spring', bounce: 0, duration: 0.3 }
export const SPRING_FLICK = { type: 'spring', bounce: 0.18, duration: 0.35 }
export const FADE = { duration: 0.2, ease: 'easeOut' } // reduced-motion stand-in for any of the above

// Where a flick is heading: Apple's exponential-decay projection (scroll-deceleration feel).
// velocity in px/s → distance in px the element would coast before stopping.
export function project(velocity, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

// Soft boundary: the further past the edge, the less the element follows.
export function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

// Pick the snap point nearest to where the gesture is going (not where it was released).
export function nearestSnap(position, velocity, points, decelerationRate = 0.998) {
  const target = position + project(velocity, decelerationRate)
  return points.reduce((best, p) => (Math.abs(p - target) < Math.abs(best - target) ? p : best), points[0])
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Release velocity (px/s) from the last few pointer samples [[pos, timeStamp], ...].
// A finger that stopped before lifting has no velocity, however fast it moved earlier.
export function releaseVelocity(samples, now) {
  if (samples.length < 2) return 0
  const a = samples[0], b = samples[samples.length - 1]
  if (now - b[1] > 80 || b[1] <= a[1]) return 0
  return ((b[0] - a[0]) / (b[1] - a[1])) * 1000
}

// Haptics (Apple's three rules): only on a real commit (a snap, a page change, a dismiss),
// fired on the same frame as the visual, and never for visitors who asked for less motion.
// Vibration works on Android browsers; elsewhere this does nothing.
export function haptic(ms = 10) {
  try {
    if (prefersReducedMotion()) return
    if (typeof navigator !== 'undefined' && navigator.vibrate && window.matchMedia?.('(pointer: coarse)').matches) navigator.vibrate(ms)
  } catch (e) {}
}
