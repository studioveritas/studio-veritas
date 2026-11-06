import { News } from '@/components/news'

export const metadata = {
  title: 'News + Insights — Studio Veritas',
  description: 'In Signo Veritas: the cultural signals that mostly go unnoticed, and the useful truths inside them.',
  alternates: { canonical: '/news' },
  openGraph: { title: 'News + Insights — Studio Veritas', description: 'In Signo Veritas: the cultural signals that mostly go unnoticed, and the useful truths inside them.', url: '/news', siteName: 'Studio Veritas', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'News + Insights — Studio Veritas', description: 'In Signo Veritas: the cultural signals that mostly go unnoticed, and the useful truths inside them.' },
}

export default function NewsPage() {
  return <News />
}
