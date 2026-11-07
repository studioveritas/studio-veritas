import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case-study'
import { caseStudyView } from '@/lib/work-view'
import { requireClient, isClient } from '@/lib/client-auth'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  // Titles of private work stay private too.
  if (!(await isClient())) return { title: 'Client space — Studio Veritas' }
  const view = caseStudyView(slug, 'client')
  if (!view) return {}
  const { work } = view
  return {
    title: `${work.client}: ${work.sub} — Studio Veritas`,
    // Public case studies point search engines at their public page.
    ...((work as { private?: boolean }).private ? {} : { alternates: { canonical: `/work/${work.slug}` } }),
  }
}

export default async function ClientCaseStudyPage({ params }: Props) {
  const { slug } = await params
  await requireClient(`/clients/work/${slug}`)
  const view = caseStudyView(slug, 'client')
  if (!view) notFound()
  return <CaseStudy {...view} />
}
