// Plain-text versions of the News + Insights articles, built from components/news-data.js.
// Ask Veritas and /llms.txt both use these, so a new article is known to the assistant
// and to AI crawlers as soon as it is published.

import { NEWS, ARTICLES } from '@/components/news-data'

type Section = { heading: string; body?: string; list?: string[] }
type Article = { slug: string; name: string; title: string; date?: string; comingSoon?: boolean; sections?: Section[] }

const all = NEWS as Article[]
const published = ARTICLES as Article[]

const flat = (s: string) => s.replace(/\s*\n\s*\n\s*/g, ' ').trim()
const label = (a: Article) => a.name.toLowerCase().replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase())

const sectionText = (s: Section) =>
  [s.body ? flat(s.body) : '', ...(s.list || []).map((x) => `Point: ${x}.`)].filter(Boolean).join(' ')

// For the Ask Veritas knowledge base.
export function newsForKnowledge(): string {
  const soon = all.filter((a) => a.comingSoon)
  const pieces = published
    .map((a) =>
      [
        `### ${label(a)}: "${a.title}" (site, /news/${a.slug}${a.date ? `, ${a.date}` : ''})`,
        ...(a.sections || []).map((s) => `- ${s.heading}: ${sectionText(s)}`),
      ].join('\n')
    )
    .join('\n\n')
  return `## News + Insights: In Signo Veritas (the studio's own point of view)
News + Insights (/news on studio-veritas.com, "News + Insights" in the menu) publishes In Signo Veritas, the studio's series on cultural signals. Each piece follows the same structure: The subject, The signal (evidence, each point with its source), The truth (the studio's read), Worth asking (the question it leaves brands with).
These articles ARE what Studio Veritas says and thinks on these topics. Published so far: ${published.map((a) => `${label(a)} "${a.title}"`).join('; ')}.${soon.length ? ` Coming soon: ${soon.map((a) => label(a)).join(', ')}.` : ''}

${pieces}`
}

// For /llms.txt (llmstxt.org).
export function newsForLlms(): string {
  const items = published
    .map((a) => {
      const truth = a.sections?.find((s) => s.heading.toLowerCase() === 'the truth')
      const first = truth?.body ? flat(truth.body).split(/(?<=[.?!])\s/)[0] : ''
      return `- **${label(a)}: ${a.title}** — /news/${a.slug}${first ? `. ${first}` : ''}`
    })
    .join('\n')
  return `## News + Insights (In Signo Veritas)

Page: /news. The studio's series on cultural signals: the subject, the signal (sourced evidence), the truth, and the question worth asking.

${items}`
}
