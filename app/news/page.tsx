import { News } from '@/components/news'

export const metadata = {
  title: 'News + Insights — Studio Veritas',
  description: 'In Signo Veritas: the cultural signals that mostly go unnoticed, and the useful truths inside them.',
  alternates: { canonical: '/news' },
}

export default function NewsPage() {
  return <News />
}
