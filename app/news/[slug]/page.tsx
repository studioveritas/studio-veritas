import { notFound } from 'next/navigation'
import { NewsArticle } from '@/components/news-article'
import { ARTICLES, getArticle } from '@/components/news-data'
import { clip } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return ARTICLES.map((a: { slug: string }) => ({ slug: a.slug }))
}

const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase())

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  const title = `${titleCase(a.name)}: ${a.title} — Studio Veritas`
  const description = clip(a.sections?.[0]?.body || 'News + Insights from Studio Veritas.')
  const url = `/news/${a.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Studio Veritas', type: 'article', images: [{ url: a.tile }] },
    twitter: { card: 'summary_large_image', title, description, images: [a.tile] },
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getArticle(slug)) notFound()
  return <NewsArticle slug={slug} />
}
