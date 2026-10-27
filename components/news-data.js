// News + Insights: every article on /news, in the order shown (newest first).
// Each entry is a tile on /news and a page at /news/<slug>.
//
// ─── TEMPLATE (copy from { to }, ) ───────────────────────────────────────────
//  {
//    slug: 'in-signo-veritas-06',                  // the web address: /news/in-signo-veritas-06
//    name: 'IN SIGNO VERITAS #06',                 // on the tile and the black title box
//    title: 'Personality, what personality',       // the line under the name
//    date: '2026-11-03',                           // optional, YYYY-MM-DD
//    tile: '/news/in-signo-veritas-06/tile.jpg',   // the tile image (4:5 or square, JPEG, about 880 x 1100)
//    image: '/news/in-signo-veritas-06/image.gif', // the article image: PNG, JPEG or GIF (portrait, about 930 x 1214)
//    imageAlt: 'What the image shows',             // for screen readers
//    // comingSoon: true,                          // shows the tile as COMING SOON, with no page yet
//    // intro: 'A different opening line.',        // optional: replaces the standard series intro
//    sections: [
//      { heading: 'The signal', body: 'One paragraph.', list: ['A point (Source, 2026)', 'Another point (Source, 2026)'] },
//      { heading: 'The truth', body: 'One or two paragraphs.' },
//      { heading: 'Worth asking', body: 'The question to leave the reader with.' },
//    ],
//  },
// ────────────────────────────────────────────────────────────────────────────
// The page shows the opening line, the standard intro and every section before
// WORTH ASKING; MORE types out the rest. Headings show in capitals with ■ in front.
// Text rules are the same as the case studies: straight quotes around the text,
// curly ’ “ ” inside it.

export const SERIES_INTRO =
  'Change shows up in culture long before it reaches the brief. At Studio Veritas, we collect the signals that mostly go unnoticed, and highlight the useful truths inside them.'

// The headings that stay hidden until MORE is pressed.
export const REVEAL_FROM = 'Worth asking'

const TO_COME = 'Copy to come.'

export const NEWS = [
  {
    slug: 'in-signo-veritas-01',
    name: 'IN SIGNO VERITAS #01',
    title: 'Title here…',
    tile: '/news/in-signo-veritas-01/tile.jpg',
    image: '/news/in-signo-veritas-01/image.png',
    imageAlt: 'Stand-in image',
    sections: [
      { heading: 'The signal', body: TO_COME },
      { heading: 'The truth', body: TO_COME },
      { heading: 'Worth asking', body: TO_COME },
    ],
  },
  {
    slug: 'in-signo-veritas-02',
    name: 'IN SIGNO VERITAS #02',
    title: 'Personality, what personality',
    tile: '/news/in-signo-veritas-02/tile.jpg',
    image: '/news/in-signo-veritas-02/image.png',
    imageAlt: 'Stand-in image',
    sections: [
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
      { heading: 'Worth asking', body: TO_COME },
    ],
  },
  {
    slug: 'in-signo-veritas-03',
    name: 'IN SIGNO VERITAS #03',
    title: 'Title here…',
    tile: '/news/in-signo-veritas-03/tile.jpg',
    image: '/news/in-signo-veritas-03/image.gif',
    imageAlt: 'Stand-in animated image',
    sections: [
      { heading: 'The signal', body: TO_COME },
      { heading: 'The truth', body: TO_COME },
      { heading: 'Worth asking', body: TO_COME },
    ],
  },
  {
    slug: 'in-signo-veritas-04',
    name: 'IN SIGNO VERITAS #04',
    title: 'Title here…',
    tile: '/news/in-signo-veritas-04/tile.jpg',
    image: '/news/in-signo-veritas-04/image.png',
    imageAlt: 'Stand-in image',
    sections: [
      { heading: 'The signal', body: TO_COME },
      { heading: 'The truth', body: TO_COME },
      { heading: 'Worth asking', body: TO_COME },
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

export const ARTICLES = NEWS.filter((n) => !n.comingSoon)
export const getArticle = (slug) => ARTICLES.find((n) => n.slug === slug) || null
export function getArticleNeighbours(slug) {
  const i = ARTICLES.findIndex((n) => n.slug === slug)
  return { prev: i > 0 ? ARTICLES[i - 1] : null, next: i >= 0 && i < ARTICLES.length - 1 ? ARTICLES[i + 1] : null }
}
