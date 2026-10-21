// Studio Veritas: Experience (selected work) and case studies.
//
// One list drives the Experience grid, each case study page, the case-study
// prev/next arrows, page titles, and the structured data search engines read.
// Text only, so server code (routes, metadata) can import it without pulling
// in the image data. Images are looked up by `img` in components/work-images.js.
//
// To publish a case study: give the project a `caseStudy` object. Its tile then
// links to /experience/<slug> instead of showing COMING SOON, and the arrows on
// the case study pages step through every project that has one, in grid order.

export const WORK = [
  {
    slug: 'windhoek',
    name: 'WINDHOEK',
    client: 'Windhoek',
    subheading: "Quality doesn't have to look German",
    img: 'windhoek',
    caseStudy: {
      // Hero: the photo is drawn at 126.3% of the card's height and placed at
      // these percentages, which reproduces the crop in the design at 1920x1080
      // (template-matched against the original photo). Mobile keeps the bottle
      // in view instead.
      hero: 'windhoekHero',
      heroSize: 'auto 126.3%',
      heroPosition: '1.7% 48.5%',
      heroPositionMobile: '64% 50%',
      sections: [
        {
          heading: 'Problem',
          body:
            'Windhoek was a respected quality beer in South Africa and Namibia, but its cues (Reinheitsgebot, Germanic naming, colonial-era visual language) coded quality as foreign rather than African, muting its relevance to most African drinkers.',
        },
        {
          heading: 'Truth',
          body: "Quality doesn't have to look German to be real. Africa has its own premium codes.",
        },
        {
          heading: 'Response',
          body:
            'The redesign and repositioning traded inherited European quality signifiers for local, premium African ones, repositioning Windhoek as proof that African-made can mean world-class.',
        },
        {
          heading: 'The results',
          list: [
            '“Windhoek\'s recovery was aided by the investment in refreshing the Windhoek brand." -Namibia Breweries Limited',
            '2024: Windhoek gained 2% market share following the rebrand.',
            'H2 2024: Windhoek Lager and Draught drove 58.9% of total beer volume in Namibia.',
            'Net revenue grew 19.8%.',
            'Operating profit grew 10.6%.',
            'Windhoek Lager later posted the strongest volume growth of any beer in the African portfolio.',
          ],
        },
      ],
    },
  },
  { slug: 'prem', name: 'PREM', client: 'Premiership Rugby', subheading: 'A platform the the raw spectacle', img: 'prem' },
  { slug: 'jordan-wings', name: 'JORDAN WINGS', client: 'Jordan Brand', subheading: 'Mentorship as the truth behind the mythology', img: 'jordan' },
  { slug: 'seedlip', name: 'SEEDLIP', client: 'Seedlip', subheading: 'What to drink when you’re not drinking', img: 'seedlip' },
  { slug: 'allbirds', name: 'ALLBIRDS', client: 'Allbirds', subheading: 'Nature knows better then we do', img: 'allbirds' },
  { slug: 'canyon', name: 'CANYON', client: 'Canyon', subheading: 'Power ON:Game ON', img: 'canyon' },
  { slug: 'uber', name: 'UBER', client: 'Uber', subheading: 'The city, always in motion', img: 'uber' },
  { slug: 'icebreaker', name: 'ICEBREAKER', client: 'Icebreaker', subheading: 'A natural alternative to synthetic', img: 'icebreaker' },
]

export const CASE_STUDIES = WORK.filter((w) => w.caseStudy)

export function getCaseStudy(slug) {
  return CASE_STUDIES.find((w) => w.slug === slug) || null
}

// Neighbours among published case studies, in grid order. Null at either end,
// which the arrows show as an outline triangle (nothing further that way).
export function getNeighbours(slug) {
  const i = CASE_STUDIES.findIndex((w) => w.slug === slug)
  return {
    prev: i > 0 ? CASE_STUDIES[i - 1] : null,
    next: i >= 0 && i < CASE_STUDIES.length - 1 ? CASE_STUDIES[i + 1] : null,
  }
}
