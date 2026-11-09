// The Services page copy, in one place. Used by the page (components/services.jsx),
// /llms.txt, the JSON-LD on /services and Ask Veritas's knowledge, so a change here shows everywhere.
//
// Each area:
//   id / anchor   /services?service=<id> or /services#<anchor> opens the page with that area expanded
//   tag           the Work page filter its "See all … work" link opens (/work?tag=<tag>)
//   work          slugs from components/work-data.js. Private or missing work is left out automatically.

export const SERVICE_AREAS = [
  {
    id: 'strategy',
    anchor: 'brand-strategy',
    title: 'Brand strategy',
    desc: 'Insight, positioning, platform, architecture and voice',
    tag: 'Brand',
    items: [
      ['Insight & research', 'We start with your data. Where it leaves gaps, we fill them with our own research.'],
      ['Positioning', 'Where your brand can win, and why.'],
      ['Brand platform', 'The central idea that every part of your brand builds on.'],
      ['Portfolio & architecture', 'How your brands, sub-brands and products fit together.'],
      ['Proposition design', 'What each offer says, to whom, and how it stands apart.'],
      ['Brand voice & messaging', 'How your brand sounds and what it keeps saying.'],
      ['Brand principles', 'Simple rules that guide every brand decision and touch point.'],
    ],
    work: ['icebreaker', 'windhoek'],
  },
  {
    id: 'world',
    anchor: 'brand-world-design',
    title: 'Brand world design',
    desc: 'Design platform, identity, packaging and retail',
    tag: 'Retail',
    items: [
      ['Design platform', 'The idea every design choice comes back to.'],
      ['Identity', 'Logo, typography, colour and imagery, built as one system.'],
      ['Packaging', 'Packs that make the brand clear on shelf and at home.'],
      ['Retail & brand experience', 'How the brand shows up in store and in physical spaces.'],
      ['Design systems & guidelines', 'Tools that keep the brand consistent wherever it’s used.'],
    ],
    work: ['asics-cps', 'canyon'],
  },
  {
    id: 'innovation',
    anchor: 'innovation',
    title: 'Innovation',
    desc: 'Opportunities, pipeline, concepts and visualisation',
    tag: 'Innovation',
    items: [
      ['Opportunity spaces', 'What people are missing, and where your brand and capabilities can meet those needs.'],
      ['Innovation strategy & pipeline', 'Which opportunities to pursue first, and how they fit together over time.'],
      ['Concept design', 'Turning opportunities into clear product and service ideas.'],
      ['Visualisation', 'Making concepts real enough to test with people and sell in internally.'],
    ],
    work: ['zagg', 'pacmodo'],
  },
]

// Plain text, for /llms.txt and Ask Veritas.
export function servicesText() {
  return SERVICE_AREAS.map((a, i) =>
    [
      `### (${i + 1}) ${a.title} — /services?service=${a.id}`,
      ...a.items.map(([name, body]) => `- ${name}: ${body}`),
    ].join('\n')
  ).join('\n\n')
}
