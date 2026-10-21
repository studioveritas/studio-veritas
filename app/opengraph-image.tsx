// Default share image for the site (home and any page without its own):
// the landing sky with the black wordmark, as on the home page.

import { ImageResponse } from 'next/og'
import { LANDING_IMG_DESKTOP, LOGO_SRC_BLACK } from '@/components/media'
import { OG_SIZE, OG_TYPE, ogFonts } from '@/lib/og'

export const size = OG_SIZE
export const contentType = OG_TYPE
export const alt = 'Studio Veritas: growth in truth'

export default async function Image() {
  const fonts = await ogFonts()
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative', fontFamily: 'Plex' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LANDING_IMG_DESKTOP} alt="" width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC_BLACK} alt="Studio Veritas" width={560} height={133} style={{ width: 560, height: 133 }} />
          <div style={{ marginTop: 26, fontSize: 30, fontWeight: 500, letterSpacing: 6, color: '#000', textTransform: 'uppercase' }}>Growth in truth</div>
          <div style={{ marginTop: 12, fontSize: 24, fontWeight: 400, color: '#000' }}>Freelance team for strategy + design + innovation</div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
