// /llms.txt (llmstxt.org): a plain-text summary of the site for AI crawlers.
// The Experience section is generated from components/work-data.js, so new
// case studies appear here automatically. Edit the fixed text below directly.

import { workForLlms } from '@/lib/work-text'
import { newsForLlms } from '@/lib/news-text'

export const dynamic = 'force-static'

const HEAD = `# Studio Veritas

> Studio Veritas is a creative strategy studio. Good strategy starts with
> hard questions — the studio finds the truth that makes brands matter.
> Slogan: "The truth will set you free."

## About

Studio Veritas gets under the brief to find the real problem and the
deeper need. It looks at the company, the category, and culture — what's
changing, what's working, what isn't — and finds the tension where big
ideas are born and growth happens. The studio works with companies and
agencies that need clear thinking, a sharp point of view, and creative
that's built on truth and made to work in the real world.

## Services

- **For companies**: Works directly with brand, marketing, innovation and
  design teams on strategic and creative projects.
- **For agencies**: Works as a freelance strategy, creative and design
  team for extra thinking, different perspectives, or specialist
  capability.

`

const TAIL = `## Contact

Contact page: /contact
Email: info@studio-veritas.com
LinkedIn: https://www.linkedin.com/company/team-studio-veritas
Team: Guillaume Furminger + Ali Marmaduke
`

export function GET() {
  return new Response(`${HEAD}${workForLlms()}\n\n${newsForLlms()}\n\n${TAIL}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
