// Plain-text versions of the Experience page and case studies, built from
// components/work-data.js. Ask Veritas and /llms.txt both use these, so a new
// case study is known to the assistant and to AI crawlers as soon as it is added.

import { WORK, TAGS, caseSubheading } from '@/components/work-data'

type Section = { heading: string; body?: string; list?: string[] }
type Work = {
  slug: string
  name: string
  client: string
  subheading: string
  tags?: string[]
  caseStudy?: { title?: string; subheading?: string; intro?: string; sections: Section[] }
}

const ALL = WORK as Work[]
const CASES = ALL.filter((w) => w.caseStudy)

const sectionText = (s: Section) => (s.body ? s.body : (s.list || []).join(' '))

// For the Ask Veritas knowledge base.
export function workForKnowledge(): string {
  const list = ALL.map(
    (w) => `- ${w.client}${w.name.toUpperCase() !== w.client.toUpperCase() ? ` (${w.name})` : ''}: ${w.subheading}.${w.caseStudy ? ` Case study: "${caseSubheading(w)}" (/experience/${w.slug}).` : ''}`
  ).join('\n')
  const cases = CASES.map((w) =>
    [
      `### ${w.client} case study, "${caseSubheading(w)}" (site, /experience/${w.slug})`,
      ...(w.caseStudy!.intro ? [`- Summary: ${w.caseStudy!.intro}`] : []),
      ...w.caseStudy!.sections.map((s) => `- ${s.heading}: ${sectionText(s)}`),
    ].join('\n')
  ).join('\n\n')
  return `## Selected work (site)
The Work page (/experience on studio-veritas.com, "Work" in the menu) shows the work as tiles, filterable by ${TAGS.join(', ')}; the client logo grid is on the Client Experience page (/clients). Full case studies so far: ${CASES.map((w) => `${w.client} (/experience/${w.slug})`).join(', ')}. The others are marked "coming soon".
${list}

${cases}`
}

// For /llms.txt (llmstxt.org).
export function workForLlms(): string {
  const items = ALL.map((w) => {
    const head = `- **${w.client}** (${w.name}) — ${w.subheading}.`
    if (!w.caseStudy) return head
    const parts = [w.caseStudy.intro, ...w.caseStudy.sections.map((s) => `${s.heading}: ${sectionText(s)}`)].filter(Boolean).join(' ')
    return `${head}\n  Case study "${caseSubheading(w)}": /experience/${w.slug}. ${parts}`
  }).join('\n')
  return `## Work (selected case studies)

Page: /experience. Tiles of work, filterable by ${TAGS.join(', ')} (e.g. /experience?tag=${TAGS[0].toLowerCase()}); full case studies are linked, the rest are marked "coming soon". Client logos: /clients (Client Experience).

${items}`
}
