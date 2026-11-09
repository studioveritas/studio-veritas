import { Services } from '@/components/services'
import { workView } from '@/lib/work-view'
import { SERVICE_AREAS } from '@/components/services-data'

const DESCRIPTION = 'Brand strategy, brand world design and innovation: what Studio Veritas does, from insight and positioning to identity, packaging and new concepts.'

export const metadata = {
  title: 'Services — Studio Veritas',
  description: DESCRIPTION,
  alternates: { canonical: '/services' },
  openGraph: { title: 'Services — Studio Veritas', description: DESCRIPTION, url: '/services', siteName: 'Studio Veritas', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Services — Studio Veritas', description: DESCRIPTION },
}

export default function ServicesPage() {
  // Each area's related tiles, public work only, resolved on the server (lib/work-view.js).
  const { items } = workView('public')
  const related = Object.fromEntries(
    SERVICE_AREAS.map((a: { id: string; work: string[] }) => [
      a.id,
      a.work.map((slug) => items.find((w: { slug: string; href: string | null }) => w.slug === slug && w.href)).filter(Boolean),
    ])
  )
  return <Services related={related} />
}
