import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case-study'
import { getCaseStudy } from '@/components/work-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const work = getCaseStudy(slug)
  if (!work) return {}
  return {
    title: `${work.client} — Studio Veritas`,
    description: `${work.subheading}. A Studio Veritas case study.`,
    alternates: { canonical: `/experience/${work.slug}` },
  }
}

// Only projects with a published case study have a page; anything else is a 404.
export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  if (!getCaseStudy(slug)) notFound()
  return <CaseStudy slug={slug} />
}
