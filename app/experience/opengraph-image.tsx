// Share image for /experience: the work tiles as a 3x3 mosaic with a title box.

import { ImageResponse } from 'next/og'
import { WORK } from '@/components/work-data'
import { WORK_TILES } from '@/components/work-images'
import { OG_SIZE, OG_TYPE, ogFonts, TitleBox } from '@/lib/og'

export const size = OG_SIZE
export const contentType = OG_TYPE
export const alt = 'Studio Veritas: Experience, selected work'

export default async function Image() {
  const fonts = await ogFonts()
  const tiles = WORK.slice(0, 9).map((w) => (WORK_TILES as Record<string, string>)[w.img])

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', background: '#000', fontFamily: 'Plex', position: 'relative' }}>
        {tiles.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" width={400} height={210} style={{ width: 400, height: 210, objectFit: 'cover' }} />
        ))}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex', background: 'rgba(0,0,0,0.18)' }} />
        <div style={{ position: 'absolute', left: 48, bottom: 48, display: 'flex' }}>
          <TitleBox kicker="Studio Veritas" name="Experience" line="Selected work, brand to retail" />
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
