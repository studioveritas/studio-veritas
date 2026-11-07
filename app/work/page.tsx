import { Work } from '@/components/work'
import { workView } from '@/lib/work-view'
import { CASE_STUDIES } from '@/components/work-data'

const DESC = `Selected case studies by Studio Veritas: ${CASE_STUDIES.map((w: { client: string }) => w.client).join(', ')}.`

export const metadata = {
  title: 'Work — Studio Veritas',
  description: DESC,
  alternates: { canonical: '/work' },
  openGraph: { title: 'Work — Studio Veritas', description: DESC, url: '/work', siteName: 'Studio Veritas', type: 'website' },
  twitter: { card: 'summary_large_image' },
}

export default function ExperiencePage() {
  const { items, tags } = workView('public')
  return <Work items={items} tags={tags} />
}
