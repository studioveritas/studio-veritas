// Share image for each case study: the hero photo with the case study's black
// title box, so a shared link reads like the page itself. New case studies get
// one automatically.

import { ImageResponse } from 'next/og'
import { CASE_STUDIES, getCaseStudy, caseSubheading } from '@/components/work-data'
import { CASE_STUDY_HEROES } from '@/components/case-images'
import { OG_SIZE, OG_TYPE, ogFonts, TitleBox, imageData } from '@/lib/og'

export const size = OG_SIZE
export const contentType = OG_TYPE
export const alt = 'Studio Veritas case study'

export function generateStaticParams() {
  return CASE_STUDIES.map((w) => ({ slug: w.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = getCaseStudy(slug)
  const hero = work ? await imageData(work.caseStudy?.hero, CASE_STUDY_HEROES as Record<string, string>) : null
  const fonts = await ogFonts()

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#141414', fontFamily: 'Plex', position: 'relative' }}>
        {hero && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="" width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }} />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 100%)',
          }}
        />
        <div style={{ position: 'absolute', left: 48, bottom: 48, display: 'flex' }}>
          <TitleBox
            kicker="Studio Veritas · Case study"
            name={work ? work.name : 'Experience'}
            line={work ? caseSubheading(work) : 'Selected work'}
          />
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
