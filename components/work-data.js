// Studio Veritas: Experience (selected work) and case studies.
//
// One list drives the Experience grid, each case study page, the case-study
// prev/next arrows, page titles, and the structured data search engines read.
// Text only, so server code (routes, metadata) can import it without pulling
// in the image data. Tile images are looked up by `img` in components/work-images.js, case study
// heroes by `caseStudy.hero` in components/case-images.js.
//
// `tags` drive the filters on the Experience page (see TAGS below).
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
    tags: ['Brand'],
    caseStudy: {
      // Hero: the photo is drawn at 126.3% of the card's height and placed at
      // these percentages, which reproduces the crop in the design at 1920x1080
      // (template-matched against the original photo). Mobile keeps the bottle
      // in view instead.
      hero: 'windhoekHero',
      heroSize: 'auto 126.3%',
      heroPosition: '1.7% 48.5%',
      heroPositionMobile: '64% 50%',
      askPrompts: ['What was the truth behind Windhoek?', 'How did the Windhoek rebrand perform?'],
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
  { slug: 'prem', name: 'PREM', client: 'Premiership Rugby', subheading: 'A platform the the raw spectacle', img: 'prem', tags: ['Brand', 'Comms'] },
  { slug: 'jordan-wings', name: 'JORDAN WINGS', client: 'Jordan Brand', subheading: 'Mentorship as the truth behind the mythology', img: 'jordan', tags: ['Comms', 'Innovation'] },
  {
    slug: 'seedlip',
    name: 'SEEDLIP',
    client: 'Seedlip',
    subheading: 'What to drink when you’re not drinking',
    img: 'seedlip',
    tags: ['Brand', 'Comms', 'Innovation'],
    caseStudy: {
      // The case study's title box carries the platform name; the tile keeps its line.
      subheading: 'Hello Curious',
      hero: 'seedlipHero',
      // A touch larger than the card and anchored right, so the SEEDLIP wordmark
      // sits fully behind the copy and the bottle and serve stay in view.
      heroSize: 'auto 104%',
      heroPosition: '100% 50%',
      heroPositionMobile: '62% 50%',
      askPrompts: ['What was the truth behind Seedlip?', 'What is Hello Curious?'],
      sections: [
        {
          heading: 'Problem',
          body:
            'Despite creating the non-alcoholic spirits category, Seedlip faced growing consumer friction as the market crowded: drinkers were confused about what it actually tasted like, how to serve it, and why it commanded a premium price point. Framed largely by absence—what it wasn’t—the brand risked being perceived as an expensive, diluted substitute rather than an elevated spirit in its own right.',
        },
        {
          heading: 'Truth',
          body:
            'Adults choosing not to drink alcohol aren’t looking for an apology or a compromised mimicry of booze; they are looking for sophisticated sensory pleasure. Non-alcoholic drinking shouldn’t be defined by sobriety or restriction, but by curiosity and an appetite for complex flavour.',
        },
        {
          heading: 'Response',
          body:
            'Launched the global brand platform “Hello Curious”, reframing Seedlip from a zero-proof compromise into an invitation to explore botanical distillation. We traded defensive category education for an evocative sensory world: mapping intricate natural ingredients directly to distinct flavour profiles, standardising iconic high-ball serve rituals across on-trade and retail, and deploying a modular visual system engineered to dominate key seasonal moments from Dry January through summer terrace drinking.',
        },
        {
          heading: 'The results',
          list: [
            'Solidified Seedlip’s position as the definitive global benchmark and market leader in the premium non-alcoholic spirits sector.',
            'Successfully demystified the serve ritual across on-trade and off-trade, driving double-digit trial and repeat purchase globally.',
            'Anchored peak cultural and seasonal drinking periods with a modular global toolkit deployed across experiential, digital, and retail touchpoints in over 20 international markets.',
            'Protected luxury price realisation and shelf authority following the brand’s global rollout under Diageo’s portfolio.',
          ],
        },
      ],
    },
  },
  { slug: 'allbirds', name: 'ALLBIRDS', client: 'Allbirds', subheading: 'Nature knows better then we do', img: 'allbirds', tags: ['Retail'] },
  { slug: 'canyon', name: 'CANYON', client: 'Canyon', subheading: 'Power ON:Game ON', img: 'canyon', tags: ['Comms'] },
  { slug: 'uber-social-impact', name: 'UBER SOCIAL IMPACT', client: 'Uber', subheading: 'Thanking the everyday giants', img: 'uber', tags: ['Comms'] },
  { slug: 'icebreaker', name: 'ICEBREAKER', client: 'Icebreaker', subheading: 'A natural alternative to synthetic', img: 'icebreaker', tags: ['Brand'] },
  { slug: 'ketel-one', name: 'KETEL ONE', client: 'Ketel One', subheading: 'Reframing the cocktail moment', img: 'ketel', tags: ['Comms'] },
]

export const CASE_STUDIES = WORK.filter((w) => w.caseStudy)

// Filters on the Experience page, in this order. A filter only shows when at
// least one project carries its tag, so tags can be added here ahead of the work.
export const TAGS = ['Brand', 'Comms', 'Retail', 'Innovation']

// The line under the name in a case study's title box (falls back to the tile's).
export function caseSubheading(work) {
  return work.caseStudy?.subheading || work.subheading
}

// Questions Ask Veritas suggests on a case study page.
export function askPromptsFor(work) {
  return work.caseStudy?.askPrompts || [`What was the truth behind ${work.client}?`]
}

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
