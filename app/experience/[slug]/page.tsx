import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case-study'
import { CASE_STUDIES, getCaseStudy, caseSubheading } from '@/components/work-data'

type Props = { params: Promise<{ slug: string }> }

// Every published case study is pre-rendered, along with its share image
// (opengraph-image.tsx in this folder).
export function generateStaticParams() {
  return CASE_STUDIES.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const work = getCaseStudy(slug)
  if (!work) return {}
  const title = `${work.client}: ${caseSubheading(work)} — Studio Veritas`
  const truth = work.caseStudy?.sections.find((s: { heading: string }) => s.heading === 'Truth')?.body
  const description = truth ? `${truth} A Studio Veritas case study.` : `${work.subheading}. A Studio Veritas case study.`
  const url = `/experience/${work.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Studio Veritas', type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// Only projects with a published case study have a page; anything else is a 404.
export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  if (!getCaseStudy(slug)) notFound()
  return <CaseStudy slug={slug} />
}
