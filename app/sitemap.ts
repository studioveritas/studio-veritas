// sitemap.xml for search engines: every page plus each published case study and article.
import type { MetadataRoute } from 'next'
import { CASE_STUDIES } from '@/components/work-data'
import { ARTICLES } from '@/components/news-data'

const BASE = 'https://www.studio-veritas.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/experience', '/news', '/team', '/process', '/contact']
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...CASE_STUDIES.map((w) => ({ url: `${BASE}/experience/${w.slug}`, changeFrequency: 'yearly' as const, priority: 0.8 })),
    ...ARTICLES.map((a: { slug: string }) => ({ url: `${BASE}/news/${a.slug}`, changeFrequency: 'yearly' as const, priority: 0.6 })),
  ]
}
