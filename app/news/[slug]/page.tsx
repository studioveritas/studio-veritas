import { notFound } from 'next/navigation'
import { NewsArticle } from '@/components/news-article'
import { ARTICLES, getArticle } from '@/components/news-data'

export const dynamicParams = false

export function generateStaticParams() {
  return ARTICLES.map((a: { slug: string }) => ({ slug: a.slug }))
}

const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase())

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  return {
    title: `${titleCase(a.name)}: ${a.title} — Studio Veritas`,
    description: a.sections?.[0]?.body || 'News + Insights from Studio Veritas.',
    alternates: { canonical: `/news/${a.slug}` },
    openGraph: { images: [{ url: a.tile }] },
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getArticle(slug)) notFound()
  return <NewsArticle slug={slug} />
}
