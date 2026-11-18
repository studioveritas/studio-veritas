'use client'
// Every Framer Motion animation on the site follows the visitor's "Reduce motion" setting:
// transforms (slides, scales, springs) are dropped and only opacity/colour changes remain.
import { MotionConfig } from 'framer-motion'
import { SPRING } from './motion'

export function MotionPrefs({ children }) {
  return <MotionConfig reducedMotion="user" transition={SPRING}>{children}</MotionConfig>
}
