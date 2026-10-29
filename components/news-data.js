// News + Insights: every article on /news, in the order shown.
// Each entry is a tile on /news and a page at /news/<slug>.
//
// ─── TEMPLATE (copy from { to }, ) ───────────────────────────────────────────
//  {
//    slug: 'in-signo-veritas-05',                  // the web address: /news/in-signo-veritas-05
//    name: 'IN SIGNO VERITAS #05',                 // on the tile and the black title box
//    title: 'The headline',                        // the line under the name
//    date: '2026-11-03',                           // optional, YYYY-MM-DD
//    tile: '/news/in-signo-veritas-05/tile.jpg',   // the tile image (4:5, JPEG, 880 x 1100)
//    image: '/news/in-signo-veritas-05/image.png', // the article image: PNG, JPEG or GIF (4:5, 1080 x 1350)
//    imageAlt: 'What the image shows',             // for screen readers
//    askPrompts: ['What does Studio Veritas say about …?'], // optional: Ask Veritas suggests this on the article
//    // comingSoon: true,                          // shows the tile as COMING SOON, with no page yet
//    sections: [
//      { heading: 'The subject', body: 'The opening paragraph.' },
//      { heading: 'The signal', body: 'One line.', list: ['A point (Source, 2026)', 'Another point (Source, 2026)'] },
//      { heading: 'The truth', body: 'First paragraph.\n\nSecond paragraph.' },
//      { heading: 'Worth asking', body: 'The question to leave the reader with.' },
//    ],
//    cta: 'Want to know what your customers really think? Get in touch.', // optional closing line; "Get in touch" links to Contact
//  },
// ────────────────────────────────────────────────────────────────────────────
// The page shows THE SUBJECT and THE SIGNAL; MORE types out THE TRUTH and everything after it.
// Headings show in capitals with ■ in front. A blank line (\n\n) inside a body starts a new paragraph.
// Text rules are the same as the case studies: straight quotes around the text, curly ’ “ ” inside it.

// The heading MORE reveals from.
export const REVEAL_FROM = 'The truth'

const CTA = 'Want to know what your customers really think? Ready for the unfiltered truth? Get in touch.'

export const NEWS = [
  {
    slug: 'in-signo-veritas-01',
    name: 'IN SIGNO VERITAS #01',
    title: 'Your customers have stopped talking to you. Something else is answering for them.',
    tile: '/news/in-signo-veritas-01/tile.jpg',
    askPrompts: ['What does Studio Veritas say about AI in customer research?'],
    image: '/news/in-signo-veritas-01/image.jpg',
    imageAlt: 'People crossing a street seen from above, each tagged with a red detection box',
    sections: [
      {
        heading: 'The subject',
        body: 'Change shows up in culture long before it reaches the brief. At Studio Veritas, we collect the signals that mostly go unnoticed, and highlight the useful truths inside them.',
      },
      {
        heading: 'The signal',
        body: 'People are using AI to write the responses they give researchers.',
        list: [
          'A third of online research participants say they use AI to help answer open questions, and AI answers read more uniform and more positive (Stanford, NYU and Cornell, 2025)',
          'Writing online has become less varied since ChatGPT launched (University of Southern California, 2026)',
          'After an AI rewrite, a model guesses the writer’s age right 26% of the time, down from 35% (University of Southern California, 2026)',
        ],
      },
      {
        heading: 'The truth',
        body: 'We’re listening closer and harder than ever to audiences, but there’s less of the real person’s voice to hear. Insight lives in the edges: the complaints and oddities, the raw material, the things that don’t always make sense. Now people’s voices are filtered through the same few AI models, so their answers come back cleaner, calmer and more alike. And researchers often use AI to summarize those responses, putting two layers of AI between them and the people they’re trying to hear.',
      },
      {
        heading: 'Worth asking',
        body: 'If your research is AI talking to AI, who exactly are you listening to?\n\nWe go out and talk to real people because they have opinions they’d never type raw into a survey.',
      },
    ],
    cta: 'Want to know what your customers really think? Get in touch.',
  },
  {
    slug: 'in-signo-veritas-02',
    name: 'IN SIGNO VERITAS #02',
    title: 'Is it design or disguise?',
    tile: '/news/in-signo-veritas-02/tile.jpg',
    askPrompts: ['What does Studio Veritas say about cute AI branding?'],
    image: '/news/in-signo-veritas-02/image.png',
    imageAlt: 'A classical statue’s face rendered in black and white dots',
    sections: [
      {
        heading: 'The subject',
        body: 'AI’s makers say their tech could end the world. Then they dress it up like a bunny in headphones. The gap between cute branding and killer tech is getting uncomfortable.',
      },
      {
        heading: 'The signal',
        body: 'AI companies are telling two stories at once.',
        list: [
          'In 2023, the heads of OpenAI, Anthropic and Google DeepMind signed a statement ranking the “risk of extinction from AI” alongside pandemics and nuclear war (Center for AI Safety, 2023)',
          'Now OpenAI’s new “dots” agents each come with a character, from a triangle in a bow tie to a bunny in headphones (Fast Company, 2026)',
          'Anthropic skipped the mascot but went for retro warmth, with a “Keep thinking” campaign that calls Claude “a thinking partner” (Adweek, 2025)',
          'OpenAI and Anthropic have both filed for IPOs. OpenAI’s CFO calls it good hygiene to “look and feel and act” like a public company (CNBC, 2026)',
        ],
      },
      {
        heading: 'The truth',
        body: 'The more dangerous AI’s makers say it is, the cuter they make it look. To governments, it’s the most powerful technology we’ve ever built. To users, it’s a cloud in a beret.\n\nBoth stories do a job.\n\nThe warning earns the money, the power and the seat at policy tables. The face makes it small enough to keep in your pocket. Too big to ignore, too cute to fear. With IPOs coming, investors need to believe both.\n\nJapan knows this move. Cute mascots soften police, tax offices, even nuclear power. In the 1990s a nuclear agency made Pluto Kun, a cartoon plutonium mascot, to calm public fear. It got pulled. A cute face on a frightening thing works until people notice the gap.',
      },
      {
        heading: 'Worth asking',
        body: 'When a brand softens something powerful, is it helping people understand it, or helping them stop asking?',
      },
    ],
    cta: CTA,
  },
  {
    slug: 'in-signo-veritas-03',
    name: 'IN SIGNO VERITAS #03',
    title: 'Will fans actually remember your brand?',
    tile: '/news/in-signo-veritas-03/tile.jpg',
    askPrompts: ['What does Studio Veritas say about sponsorship?'],
    image: '/news/in-signo-veritas-03/image.jpg',
    imageAlt: 'Football fans in Japan and Netherlands shirts celebrating in the stands',
    sections: [
      {
        heading: 'The subject',
        body: 'A bigger sponsorship deal doesn’t guarantee fans will remember you.\n\nBrands spend a fortune to be seen at sporting events. But ask fans who the sponsors were, and paying the most is no guarantee they’ll name you.',
      },
      {
        heading: 'The signal',
        body: 'Fans’ memory of sponsors doesn’t simply follow the money.',
        list: [
          'Among UK adults interested in the 2026 World Cup, Walkers made the biggest gain in advertising impact of any sponsor brand, ahead of adidas and Budweiser (YouGov BrandIndex)',
          'Shown a list of brands, fans at a baseball stadium correctly picked 57% of the team’s sponsors. They also picked 40% of brands that weren’t sponsors at all (Columbia University and Baylor University, Journal of Advertising Research)',
        ],
      },
      {
        heading: 'The truth',
        body: 'Fans remember sponsors that earn their place in the game.\n\nSponsorship is mostly sold on visibility: bigger boards, better spots, a higher tier on the partner page. It’s easy to price and easy to report back on.\n\nBut what most fans remember is something else. In a 2026 study, researchers asked fans at a minor league baseball stadium in the US to pick out the home team’s sponsors. Spending more helped, but how well a brand seemed to fit the team predicted recognition better. One of the best-recognised sponsors was not among the highest spenders. It was a local ceiling fan maker that presented a “Hunter Fan of the Game” with a ceiling fan(!) at every game.\n\nLast summer, Walkers built its World Cup sponsorship around fans. It ran a Fan of the Match competition with tickets to England and Scotland games, and invited fans into a WhatsApp group where Beckham, Messi and other football stars planned a World Cup watch party.\n\nNone of that comes with the sponsorship package. The rights buy you a place in the stadium. But earning a place in audience minds takes more than just money.',
      },
      {
        heading: 'Worth asking',
        body: 'How much of your sponsorship budget buys visibility, and how much earns a place in fans’ minds?\n\nWhat’s the “Fan of the Game” in your sponsorship? The small thing your brand does every match that fans actually remember.',
      },
    ],
    cta: CTA,
  },
  {
    slug: 'in-signo-veritas-04',
    name: 'IN SIGNO VERITAS #04',
    title: 'CMOs want to put brand first, but they’re losing the power to do it',
    tile: '/news/in-signo-veritas-04/tile.jpg',
    askPrompts: ['What does Studio Veritas say about brand and the CMO’s influence?'],
    image: '/news/in-signo-veritas-04/image.jpg',
    imageAlt: 'An On “Dream On.” banner across the front of the New York Stock Exchange',
    sections: [
      {
        heading: 'The subject',
        body: 'McKinsey asked 500 European CMOs what matters most to them in 2026, and brand came out on top. That sounds like good news. But over the same period, marketers have been losing their say in a lot of the decisions that shape how people see a brand.',
      },
      {
        heading: 'The signal',
        body: 'Brand is climbing the priority list while marketing’s influence is shrinking.',
        list: [
          'Branding ranked first of 20 priorities among 500 European marketing leaders. Generative AI came 17th (McKinsey, State of Marketing Europe 2026)',
          'Only a quarter of marketers now have a say on pricing, down from 34% a year earlier. Involvement in product decisions fell from nearly half to just over a third (Marketing Week Career & Salary Survey, 2026)',
          'Fewer than half of CMOs say marketing operates with a high degree of autonomy (Bloomberg Media and Lippincott, CMO Outlook 2026)',
        ],
      },
      {
        heading: 'The truth',
        body: 'People judge a brand by what a company does, but marketing mostly only gets to decide what it says.\n\nFour out of five conversations about brands don’t mention the advertising at all (Keller Fay Group). A lot of what people say comes from their own experience instead: what they paid, whether the product did its job, and how they were treated when something went wrong.\n\nThose are the decisions marketing is being pushed away from. So when a company says brand is its top priority, in practice that often means a new campaign, a refreshed logo or a new tone of voice. That work matters, but it’s only a small part of how people actually experience a brand.\n\nIt usually goes something like this. The price goes up, or the product changes to save money, and then marketing gets the brief to explain it to customers.\n\nGetting a seat back at those tables is hard. Most finance teams aren’t about to hand over pricing. What marketing can do is make the brand clear enough that the people setting prices, building products and handling complaints can use it too. If they can’t tell what the brand would do in their situation, they’ll make the call without it.',
      },
      {
        heading: 'Worth asking',
        body: 'Pick one decision coming up outside marketing, like a price change or a new product. Could the team making it use your brand strategy to decide?\n\nIf not, what would your brand strategy need to tell them?',
      },
    ],
  },
  {
    slug: 'in-signo-veritas-05',
    name: 'IN SIGNO VERITAS #05',
    title: 'Coming this week',
    tile: '/news/in-signo-veritas-05/tile.jpg',
    comingSoon: true,
  },
]

// Ask Veritas suggests these: on /news, and on each article (its own, or a default).
export const NEWS_PROMPTS = ['What does Studio Veritas say about sponsorship?']
export const askPromptsForArticle = (a) => a.askPrompts || [`What’s the truth in ${a.name.toLowerCase().replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase())}?`]

export const ARTICLES = NEWS.filter((n) => !n.comingSoon)
export const getArticle = (slug) => ARTICLES.find((n) => n.slug === slug) || null
export function getArticleNeighbours(slug) {
  const i = ARTICLES.findIndex((n) => n.slug === slug)
  return { prev: i > 0 ? ARTICLES[i - 1] : null, next: i >= 0 && i < ARTICLES.length - 1 ? ARTICLES[i + 1] : null }
}
