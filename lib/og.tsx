// Shared pieces for the social preview images (1200x630) that LinkedIn, X,
// WhatsApp, Slack etc. show when a Studio Veritas link is shared.
// Each route's opengraph-image.tsx renders one of these with next/og at build time.

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_TYPE = 'image/png'
export const BLUE = '#5683DD'

export async function ogFonts() {
  const dir = join(process.cwd(), 'assets/fonts')
  const [regular, medium, bold] = await Promise.all([
    readFile(join(dir, 'IBMPlexMono-Regular.woff')),
    readFile(join(dir, 'IBMPlexMono-Medium.woff')),
    readFile(join(dir, 'IBMPlexMono-Bold.woff')),
  ])
  return [
    { name: 'Plex', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Plex', data: medium, weight: 500 as const, style: 'normal' as const },
    { name: 'Plex', data: bold, weight: 700 as const, style: 'normal' as const },
  ]
}

// The black title box from the case study pages: a kicker, the name, the line.
export function TitleBox({ kicker, name, line }: { kicker: string; name: string; line: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 640,
        padding: '26px 34px 30px',
        background: '#101010',
        borderRadius: 6,
        color: '#fff',
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: 3.4, color: BLUE, textTransform: 'uppercase' }}>{kicker}</div>
      <div style={{ marginTop: 14, fontSize: 64, fontWeight: 700, lineHeight: 1, textTransform: 'uppercase' }}>{name}</div>
      <div style={{ marginTop: 14, fontSize: 28, fontWeight: 400, lineHeight: 1.25 }}>{line}</div>
    </div>
  )
}
