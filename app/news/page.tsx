import { News } from '@/components/news'
import { ARTICLES } from '@/components/news-data'

const BASE = 'https://www.studio-veritas.com'
const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase())

// Tells search engines this page is the In Signo Veritas series: one entry per published article.
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'In Signo Veritas — News + Insights from Studio Veritas',
  description: 'The cultural signals that mostly go unnoticed, and the useful truths inside them.',
  url: `${BASE}/news`,
  publisher: { '@type': 'Organization', name: 'Studio Veritas', url: BASE },
  blogPost: ARTICLES.map((a: { slug: string; name: string; title: string; date?: string; tile?: string }) => ({
    '@type': 'BlogPosting',
    headline: `${titleCase(a.name)}: ${a.title}`,
    url: `${BASE}/news/${a.slug}`,
    ...(a.date ? { datePublished: a.date } : {}),
    ...(a.tile ? { image: `${BASE}${a.tile}` } : {}),
    author: { '@type': 'Organization', name: 'Studio Veritas' },
  })),
}

export const metadata = {
  title: 'News + Insights — Studio Veritas',
  description: 'In Signo Veritas: the cultural signals that mostly go unnoticed, and the useful truths inside them.',
  alternates: { canonical: '/news' },
  openGraph: { title: 'News + Insights — Studio Veritas', description: 'In Signo Veritas: the cultural signals that mostly go unnoticed, and the useful truths inside them.', url: '/news', siteName: 'Studio Veritas', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'News + Insights — Studio Veritas', description: 'In Signo Veritas: the cultural signals that mostly go unnoticed, and the useful truths inside them.' },
}

export default function NewsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <News />
    </>
  )
}
