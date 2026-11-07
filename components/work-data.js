// Studio Veritas: Experience (selected work) and case studies.
//
// SERVER ONLY. This file is never sent to visitors' browsers (the build fails if
// a browser component imports it), so private case studies stay private: pages
// hand components just the work they're allowed to show (lib/work-view.js).
//
// ─── PUBLIC OR CLIENT-ONLY ───────────────────────────────────────────────────
// Add  private: true,  under a project's slug to move it behind the client login.
// Private work disappears from the public Work page, /work/<slug>, the sitemap,
// share images, Ask Veritas and /llms.txt, and shows only in the client space
// (/clients, password protected). Delete the line to make it public again.
//
// This one list drives everything: the Experience grid and its filters, each
// case study page, the prev/next arrows, page titles, share images, the
// sitemap, Ask Veritas's knowledge and /llms.txt. Step-by-step guide:
// CASE-STUDIES.md in the project root.
//
// ─── PUBLISH A CASE STUDY ────────────────────────────────────────────────────
// 1. Upload the photos to public/work/<slug>/ :
//      hero.jpg  the master image (fills the screen behind the case study), landscape, 1920px wide
//      tile.jpg  the grid tile, 892 x 500 (any landscape crop works)
//      image-1.jpg … image-3.jpg  optional extra images, landscape, about 1600px wide
// 2. Find the project below (or add it where it should sit in the grid) and
//    replace its line with the template, filled in. Keep the quote marks and
//    commas exactly as they are. To use an apostrophe or quote mark inside the
//    text, use the curly ones (’ “ ”).
// 3. Commit. The tile turns into a link and the page goes live.
//
// ─── TEMPLATE (copy from { to }, ) ───────────────────────────────────────────
//  {
//    slug: 'ketel-one',                           // the web address: /work/ketel-one
//    name: 'KETEL ONE',                           // on the tile and the title box
//    client: 'Ketel One',                         // brand name, as written normally
//    subheading: 'Reframing the cocktail moment', // the line under the tile
//    img: '/work/ketel-one/tile.jpg',
//    portrait: '/work/ketel-one/portrait.jpg',  // the Work page tile, 4:5 portrait (about 880 x 1100)
//    tags: ['Brand', 'Comms'],                    // any of: Brand, Comms, Retail, Innovation
//    caseStudy: {
//      title: 'KETEL ONE',                        // name in the title box (delete to use the tile's)
//      subheading: 'Reframe The Possible',        // line in the title box (delete to use the tile's)
//      intro: 'One-sentence summary.',            // opens the copy, above Problem (optional)
//      hero: '/work/ketel-one/hero.jpg',          // the master image, full screen behind the case study
//      accent: '#FF5B36',                         // heading colour, from the brand
//      images: [                                  // optional: up to 3, shown between the copy
//        '/work/ketel-one/image-1.jpg',
//        '/work/ketel-one/image-2.jpg',
//        '/work/ketel-one/image-3.jpg',
//      ],
//      sections: [
//        { heading: 'Problem', body: 'Paste the problem here.' },
//        { heading: 'Truth', body: 'Paste the truth here.' },
//        { heading: 'Response', body: 'Paste the response here.' },
//        {
//          heading: 'The results',
//          list: [
//            'First result.',
//            'Second result.',
//            'Add or remove lines as needed.',
//          ],
//        },
//      ],
//    },
//  },
//
// Optional inside caseStudy:
//   heroPosition: '70% 50%'        which part of the photo stays in view (left-right, top-bottom)
//   heroPositionMobile: '60% 50%'  the same for phones
//   heroSize: 'cover'              how the photo fills the card (default 'cover')
//   accent: '#FF5A1F'              colour of the headings in the case study (from the brand; default Veritas blue)
//   masterPosition: '30% 50%'      which part of the master image stays in view in the full-screen case study
//   masterPortrait: '/work/<slug>/portrait.jpg'  master image on phones held upright (default: the tile portrait)
//   positioning: '“…”'             optional: the platform line, in its own pop-out after Truth
//   resultStat: { value: '1.9M → 3.8M', label: '…' }  optional headline figure in The Results
//   askPrompts: ['What was the truth behind Ketel One?', 'A second question']
//                                  questions Ask Veritas suggests on the page
// ─────────────────────────────────────────────────────────────────────────────
//
// Older entries use keys ('windhoek', 'seedlipHero') for photos embedded in
// components/work-images.js and components/case-images.js; both ways work.

import 'server-only'

const ALL = [
  {
    slug: 'windhoek',
    name: 'WINDHOEK',
    client: 'Windhoek',
    subheading: "Quality doesn't have to look German",
    img: 'windhoek',
    portrait: '/work/windhoek/portrait.jpg',
    tags: ['Brand'],
    caseStudy: {
      // Hero: the photo is drawn at 126.3% of the card's height and placed at
      // these percentages, which reproduces the crop in the design at 1920x1080
      // (template-matched against the original photo). Mobile keeps the bottle
      // in view instead.
      hero: '/work/windhoek/hero.jpg',
      accent: '#C9A44C', // Windhoek gold
      masterPosition: '30% 50%',
      images: [
        { src: "/work/windhoek/image-1.jpg", alt: "Friends toasting with Windhoek at an outdoor braai" },
        { src: "/work/windhoek/image-2.jpg", alt: "Windhoek packaging pattern" },
      ],
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
  {
    slug: "gallagher-prem",
    name: "PREM",
    client: "Premiership Rugby",
    subheading: "A platform for the raw spectacle",
    img: "prem",
    portrait: '/work/gallagher-prem/portrait.jpg',
    tags: ["Brand", "Comms"],
    caseStudy: {
      title: "GALLAGHER PREM",
      subheading: "Rugby Reimagined",
      intro: "A ferocious new brand platform that breaks rugby out of its traditional bubble to compete directly in the modern high-octane entertainment market.",
      hero: "/work/gallagher-prem/hero.jpg",
      accent: '#FF5A1F', // Ferocious Orange
      positioning: '“A ferocious game played on the edge”',
      resultStat: { value: '1.9M → 3.8M', label: 'Weekly reach the experience ecosystem was engineered to deliver: doubling the league’s audience.' },
      images: [
        { src: "/work/gallagher-prem/image-1.jpg", alt: "Gallagher PREM posters on a London street wall" },
        { src: "/work/gallagher-prem/image-2.jpg", alt: "Match action from a Gallagher PREM game" },
        { src: "/work/gallagher-prem/image-3.jpg", alt: "The Gallagher PREM logo" },
      ],
      askPrompts: ["What was the truth behind Gallagher PREM?", "How did PREM set out to double its audience?"],
      sections: [
        { heading: "Problem", body: "In a crowded world of entertainment options, rugby was struggling to command attention and stay top of mind. The sport remained confined to a traditional rugby bubble, failing to consistently amplify the visceral truth of its physicality to attract casual, thrill-seeking sports fans." },
        { heading: "Truth", body: "To win hearts today, sport must be a social event and a source of adrenaline; fans crave action-packed experiences centred around heroes, unpredictable momentum shifts, and extreme rivalries." },
        { heading: "Response", body: "The competition was radically transformed into Gallagher PREM, anchored by the brand positioning: \"A ferocious game played on the edge\". We replaced polished sports tropes with an unapologetically raw design system featuring a high-contrast palette of Ferocious Orange and Gallagher Blue, dynamic adrenaline-inspired patterns, and gritty, close-up photography that puts fans directly in the action. This visual world was paired with a bold, visceral tone of voice deployed across broadcast, social media, and in-stadium environments." },
        {
          heading: 'The results',
          list: [
            "Established a bold new benchmark for rugby as the most relentless, electrifying competition in the sport's history.",
            "Built a comprehensive ecosystem of experience design engineered to double the league’s weekly reach from 1.9 million to 3.8 million viewers.",
            "Delivered a vivid, digital-first brand experience that successfully captures the true essence and unpolished beauty of the game.",
          ],
        },
      ],
    },
  },
  {
    slug: "jordan-wings",
    private: true,
    name: "JORDAN WINGS",
    client: "Jordan Brand",
    subheading: "Mentorship as the truth behind the mythology",
    img: "jordan",
    portrait: '/work/jordan-wings/portrait.jpg',
    tags: ["Comms", "Innovation"],
    caseStudy: {
      subheading: "Paris Launch",
      intro: "Dismantling Systemic Barriers: Engineered a definitive operational toolkit and cultural ecosystem to establish Jordan as a purpose-driven brand in EMEA.",
      hero: "/work/jordan-wings/hero.jpg",
      accent: '#F5D10A', // Wings yellow
      images: [
        { src: "/work/jordan-wings/image-1.jpg", alt: "A young player on a Paris court, with the Jordan Wings logo" },
        { src: "/work/jordan-wings/image-2.jpg", alt: "About Jordan Wings: programme page" },
        { src: "/work/jordan-wings/image-3.jpg", alt: "Jordan Wings mission statement" },
      ],
      askPrompts: ["What was the truth behind Jordan Wings?", "Who did Jordan Wings partner with in Paris?"],
      sections: [
        { heading: "Problem", body: "Underserved youth in Paris face severe systemic friction, where future success is dictated by access to opportunity rather than raw aptitude. Within the city, youth unemployment reaches 20.9%—double the national average—while deep-rooted cultural stigmas heavily penalise academic failure. The brand required an uncompromising, unified framework to combat these local inequities and permanently shift the narrative for disadvantaged communities." },
        { heading: "Truth", body: "Education transcends traditional schooling; it demands holistic access to creative outlets, digital art, and soft skills to shatter socio-economic and mental barriers." },
        { heading: "Response", body: "We engineered the Jordan Wings EMEA Toolkit, a centralised launch platform designed to standardise community impact communications and equip internal stakeholders. The Paris launch anchored this initiative through strategic alliances with three embedded cultural institutions: LE BAL, Casa93, and Prométhée Education. This localised ecosystem operationalised 365-day mentorships, specialised design curricula, and internships to directly rewrite the trajectory of marginalised youth." },
        {
          heading: 'The results',
          list: [
            "Transformed Jordan into a purpose-driven entity within EMEA, targeting over 10,000 meaningful student interactions annually in Paris by 2024.",
            "Codified internal brand messaging, approved statistics, and program guidelines into a singular, deployable launch toolkit.",
            "Fortified a global legacy that has already funded 8,080 semesters and awarded 1,850 students worldwide.",
          ],
        },
      ],
    },
  },
  {
    slug: 'seedlip',
    private: true,
    name: 'SEEDLIP',
    client: 'Seedlip',
    subheading: 'What to drink when you’re not drinking',
    img: 'seedlip',
    portrait: '/work/seedlip/portrait.jpg',
    tags: ['Brand', 'Comms', 'Innovation'],
    caseStudy: {
      // The case study's title box carries the platform name; the tile keeps its line.
      subheading: 'Hello Curious',
      hero: '/work/seedlip/hero.jpg',
      accent: '#E98A4F', // Seedlip copper-orange
      images: [
        { src: "/work/seedlip/image-1.jpg", alt: "Orange and ice, close up" },
        { src: "/work/seedlip/image-2.jpg", alt: "Seedlip: Serve with Tonic" },
        { src: "/work/seedlip/image-3.jpg", alt: "Detail of the Seedlip label illustration" },
      ],
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
  {
    slug: "allbirds",
    private: true,
    name: "ALLBIRDS",
    client: "Allbirds",
    subheading: "Nature knows better than we do",
    img: "/work/allbirds/tile.jpg",
    portrait: '/work/allbirds/portrait.jpg',
    tags: ["Retail"],
    caseStudy: {
      title: "ALLBIRDS x SELFRIDGES",
      subheading: "The Carbon Concept Store",
      intro: "Materialised the invisible cost of carbon to force radical industry accountability and drive high-value omni-channel growth.",
      hero: "/work/allbirds/hero.jpg",
      accent: '#A8C79B', // natural sage
      images: [
        { src: "/work/allbirds/image-1.jpg", alt: "The Allbirds carbon concept store at Selfridges" },
        { src: "/work/allbirds/image-2.jpg", alt: "The carbon timeline wall in store" },
        { src: "/work/allbirds/image-3.jpg", alt: "A sphere showing what 1kg of carbon dioxide looks like" },
      ],
      askPrompts: ["What was the truth behind the Carbon Concept Store?", "How did Allbirds make carbon visible?"],
      sections: [
        { heading: "Problem", body: "The global fashion industry masks a devastating environmental footprint behind opaque supply chains. While consumers increasingly demand sustainable options, carbon tracking remains a complicated, abstract metric that fails to influence point-of-sale behaviour. Allbirds needed to cut through this category confusion to launch their first UK concession in Selfridges. The challenge was twofold: mandate radical accountability for an environmentally unfriendly industry, and convert a discerning London audience into high-value omni-channel customers." },
        { heading: "Truth", body: "Carbon is invisible, making it easy to ignore. To fundamentally shift consumer behaviour, we had to weaponise transparency by making emissions a physical, unavoidable retail experience." },
        { heading: "Response", body: "We engineered the Carbon Concept Store in the heart of Selfridges’ Wonder Room. We stripped away passive sustainability messaging, replacing it with to-scale, three-dimensional visualisations of carbon. We anchored the space with tactile, deconstructed displays of natural raw materials—Merino wool, eucalyptus, and sugarcane—to codify material innovation. Every product featured an exact carbon footprint label, culminating in the showcase of the M0.0NSHOT net-zero shoe. We enforced absolute accountability for the build itself, tracking, measuring, and offsetting the exact CO2 score of the installation's entire supply chain." },
        {
          heading: 'The results',
          list: [
            "Secured premium positioning as a Selfridges ‘Project Earth’ brand within the elite ‘For Nature’ category.",
            "Accelerated aggressive UK retail expansion, acquiring more new customers in London than any other market outside New York City.",
            "Captured high-value omni-channel shoppers who spend 1.5x more than single-channel consumers.",
            "Propelled Allbirds past the $1 billion milestone in lifetime net revenue.",
          ],
        },
      ],
    },
  },
  { slug: 'canyon', name: 'CANYON', client: 'Canyon', subheading: 'Power ON:Game ON', img: 'canyon', portrait: '/work/canyon/portrait.jpg', tags: ['Comms'] },
  {
    slug: "uber-social-impact",
    private: true,
    name: "UBER SOCIAL IMPACT",
    client: "Uber",
    subheading: "Thanking the everyday giants",
    img: "uber",
    portrait: '/work/uber-social-impact/portrait.jpg',
    tags: ["Comms"],
    caseStudy: {
      title: "UBER",
      subheading: "Global Social Impact",
      intro: "Re-engineered Uber’s global brand perception by transforming an invisible workforce into the celebrated centre of the business.",
      hero: "/work/uber-social-impact/hero.jpg",
      accent: '#06C167', // Uber green
      images: [
        { src: "/work/uber-social-impact/image-1.jpg", alt: "“Thank you Antwyan” billboard" },
        { src: "/work/uber-social-impact/image-2.jpg", alt: "A driver beside his thank-you mural" },
        { src: "/work/uber-social-impact/image-3.jpg", alt: "A driver seen in the rear-view mirror" },
      ],
      askPrompts: ["What was the truth behind Everyday Giants?", "How did Uber thank its drivers and couriers?"],
      sections: [
        { heading: "Problem", body: "The global pandemic revealed a sharp commercial friction: Uber relied entirely on a frontline of drivers and couriers, yet 70% of US drivers felt unheard by the platform. The brand faced a critical trust deficit, trapped by an outdated corporate narrative that prioritised frictionless tech over human respect, rendering its essential workforce completely invisible." },
        { heading: "Truth", body: "True appreciation demands more than financial compensation; it requires structural respect and visibility. The strategic unlock inverted Uber’s traditional brand architecture, forcing the company to lead with social impact and human storytelling rather than top-down corporate brand messaging." },
        { heading: "Response", body: "We codified a multi-year, global Social Impact Platform that permanently shifted Uber’s operational posture. We launched the \"Everyday Giants\" platform, stripping away corporate polish to broadcast authentic earner stories captured globally in partnership with Noor Images. The ecosystem integrated external omni-channel broadcasting—including hand-painted murals and placements in Time magazine’s ‘Person of the Year’—with internal mechanics like a frictionless in-app gratitude system." },
        {
          heading: 'The results',
          list: [
            "Executed an omni-channel global campaign spanning TVC, social, digital, OOH, and major press publications including The New York Times and Washington Post.",
            "Installed five massive, hand-painted murals across four major U.S. cities to immortalise hero earners.",
            "Institutionalised a unified external tone of voice that successfully shifted Uber's overarching narrative from frictionless mobility to forward movement.",
          ],
        },
      ],
    },
  },
  {
    slug: "icebreaker",
    name: "ICEBREAKER",
    client: "Icebreaker",
    subheading: "A natural alternative to synthetic",
    img: "icebreaker",
    portrait: "/work/icebreaker/portrait.jpg",
    tags: ["Brand"],
    caseStudy: {
      subheading: "The Endless Pursuit of Progress",
      intro: "Putting performance, not sustainability, at the heart of a natural-fibre brand.",
      hero: "/work/icebreaker/hero.jpg",
      positioning: "“The Endless Pursuit of Progress”",
      accent: "#F2A33A",
      images: [
        { src: "/work/icebreaker/image-1.jpg", alt: "Be More Merino: So it took 6 months to develop your fancy synthetic fibre? Try 6 million years of evolution." },
        { src: "/work/icebreaker/image-2.jpg", alt: "Be More Merino: Ever seen merino sweat on the mountain? Neither have we." },
      ],
      askPrompts: ["What was the truth behind Icebreaker?", "What is Be More Merino?"],
      sections: [
        { heading: "Problem", body: "icebreaker, a VF Corporation brand, was so focused on the functional features of its merino wool and natural fabric technologies that it had lost sight of its brand. Users rated it highly, but non-users weren’t engaging, so icebreaker was turning into a commodity brand and losing share to cheaper, less sustainable competitors. Leaning on sustainability couldn’t fix that, because people don’t associate it with peak performance. They don’t pay top dollar for icebreaker because it’s natural. They pay because it helps them perform."},
        { heading: "Truth", body: "Performance isn’t a peak you reach. It’s progress you never stop pursuing. That’s true for icebreaker’s athletes, whose pursuit of performance doesn’t end at the summit or the season. And it’s true for icebreaker itself, which keeps pushing what natural fibres can do through fabric innovation."},
        { heading: "Response", body: "To win consideration among athletes who didn’t know icebreaker, give retailers a better story to tell and stand out in outdoor apparel, we defined what performance means to icebreaker and built four things:", list: ["A clear positioning: not just another outdoor apparel brand but a performance fabric innovation company, with natural fibres in every product.", "A brand platform: The Endless Pursuit of Progress, which put performance rather than sustainability at the heart of the brand.", "A design idea: Determination in Nature, which set the direction for the updated brand world.", "A campaign idea: Be More Merino. Outdoor enthusiasts are pulled between the natural life they crave and the “civilised” lives they actually live. On the mountain they feel at home, but nothing is more at home there than the merino sheep, built through evolution to stoically withstand the elements. The campaign tied icebreaker to that resilient attitude and launched in SS23 for new consumers in North America, EMEA, New Zealand/Australia and China."]},
        { heading: "The results", list: ["Be More Merino launched globally across OOH, social, digital and in-store.", "The campaign drove brand awareness and incremental sales growth."]},
      ],
    },
  },
  {
    slug: "ketel-one",
    private: true,
    name: "KETEL ONE",
    client: "Ketel One",
    subheading: "Reframing the cocktail moment",
    img: "ketel",
    portrait: '/work/ketel-one/portrait.jpg',
    tags: ["Comms"],
    caseStudy: {
      subheading: "Reframe The Possible",
      intro: "Unifying a fragmented portfolio to command the elevated global cocktail occasion.",
      hero: "/work/ketel-one/hero.jpg",
      accent: '#FF5B36', // cocktail orange-red
      images: [
        { src: "/work/ketel-one/image-1.jpg", alt: "Ketel One: Mix up your ordinary" },
        { src: "/work/ketel-one/image-2.jpg", alt: "Choose your cocktail moment, on iPad" },
        { src: "/work/ketel-one/image-3.jpg", alt: "Flowers behind wet glass" },
      ],
      askPrompts: ["What was the truth behind Ketel One?", "What is Reframe the Possible?"],
      sections: [
        { heading: "Problem", body: "Despite a rich heritage and premium product, Ketel One lacked a definitive cultural narrative, losing ground to competitors with aggressive, clear positioning. The core commercial friction stemmed from a fractured portfolio: Vodka and Botanical product lines operated in silos, splitting the brand across disconnected audiences and visual worlds. Ketel One required a singular platform to bridge these divides and establish indispensable brand meaning." },
        { heading: "Truth", body: "Modern discerning consumers do not just purchase spirits; they seek out brands that empower them to curate and distinguish their personal experiences. We codified Ketel One’s independent \"discovery\" mindset, transforming the brand from a static liquid into an active catalyst that invites consumers to elevate their ordinary routines into extraordinary moments." },
        { heading: "Response", body: "We engineered \"Reframe the Possible,\" an uncompromising creative vehicle. We hijacked the Ketel One 'K', positioning it as a visual frame and literal threshold into an aspirational lifestyle. The omni-channel execution anchored the brand in culture: a continuous-shot first-person brand film drove visceral engagement, localised OOH challenged specific cities to reinvent classic cocktails, and AR-enabled bottles transformed packaging into interactive portals. We further deepened cultural resonance by launching \"The Power of No,\" a social responsibility initiative promoting mindful discernment." },
        {
          heading: 'The results',
          list: [
            "Unified the Vodka and Botanical lines under one resilient, multi-year communications platform.",
            "Replaced passive brand broadcasting with active, culturally relevant consumer conversations.",
            "Successfully established Ketel One as synonymous with elevated cocktail experiences globally.",
          ],
        },
      ],
    },
  },
  {
    slug: "pacmodo",
    name: "PACMODO",
    client: "Pacmodo",
    subheading: "The backpack for any possible future",
    img: "/work/pacmodo/tile.jpg",
    portrait: "/work/pacmodo/portrait.jpg",
    tags: ["Brand", "Innovation"],
    caseStudy: {
      subheading: "Imagine That",
      intro: "A brand, built in three months for a Kickstarter launch, for busy people who want to be ready for anything.",
      hero: "/work/pacmodo/hero.jpg",
      accent: "#F26B2A",
      images: [
        { src: "/work/pacmodo/image-1.jpg", alt: "Pacmodo exhibition stand: Ready when you are" },
        { src: "/work/pacmodo/image-2.jpg", alt: "Pacmodo billboard: Possibility comes standard" },
      ],
      resultStat: { value: "3×", label: "its Kickstarter goal: $31,699 raised against a $10,000 target in 32 days." },
      askPrompts: ["What was the truth behind Pacmodo?", "Who are the Scheduled Adventure Seekers?"],
      sections: [
        { heading: "Problem", body: "Two product designers left Nike to build something new: a modular backpack for commuting, outdoor adventure and travel. The product was solid, but the category wasn’t. Backpacks are saturated with technical claims and “adventure” lifestyle clichés, and haven’t seen a worthwhile innovation since the zipper. With three months until its Kickstarter launch, Pacmodo needed to connect a smart product with the people who needed it, and stand for something truthful, memorable and noticeable in a crowded category."},
        { heading: "Truth", body: "The average American adult owns 5 backpacks. No one really wants another traditional pack. They want a pack designed to help them cope with their busy everyday lives and still go on adventures. To prepare for anything."},
        { heading: "Response", body: "From that, we built:", list: ["A brand muse: the Scheduled Adventure Seekers. They’re busy urban professionals and parents of young children who bring order to the chaos of daily life so they can make room for more adventure. They believe preparation leads to the best experiences.", "A brand strategy: encourage time-poor, anxious professionals to embrace the uncertainty of adventure by playfully helping them prepare for it. The proposition: the backpack designed to help you prepare for any possible future. Brand essence: Innovation for anticipation.", "A brand idea: What if? It expresses Pacmodo’s belief in questioning the status quo and switching modes to do something unexpected. Tagline: Imagine that.", "A brand identity, landing page and social content for the Kickstarter launch."]},
        { heading: "The results", list: ["Funded at more than three times its goal: $31,699 raised against a $10,000 target in 32 days.", "103 backers, with an average pledge of $308.", "Named a Kickstarter “Project We Love”.", "The campaign led to a second crowdfunding launch in Japan on Makuake."]},
      ],
    },
  },
  {
    slug: "albert-heijn-care",
    private: true,
    name: "ALBERT HEIJN CARE",
    client: "Albert Heijn",
    subheading: "Feed your body beautifully",
    img: "/work/albert-heijn-care/tile.jpg",
    portrait: "/work/albert-heijn-care/portrait.jpg",
    tags: ["Brand", "Retail"],
    caseStudy: {
      title: "ALBERT HEIJN CARE",
      subheading: "Feed Your Body Beautifully",
      intro: "A portfolio architecture that turned more than 300 products into one family shoppers can read by need.",
      hero: "/work/albert-heijn-care/hero.jpg",
      accent: "#F08FB0",
      askPrompts: ["What was the truth behind Albert Heijn Care?", "How is the Care range organised?"],
      sections: [
        { heading: "Problem", body: "Care, Albert Heijn’s exclusive personal care brand since 2018, was built as an affordable alternative to A-brands. Albert Heijn wanted it to become an “affordable luxury” range rooted in its food expertise, under a new proposition: “Feed your body beautifully.” But with more than 300 products and no structure beneath the proposition, the range had no clear logic for designers or shoppers."},
        { heading: "Truth", body: "People don’t care for themselves in one way. They nourish, indulge and play, often in the same routine. A morning vitamin, an indulgent hand soap and a playful hair serum all serve different needs, so a single, uniform range can’t speak to all of them."},
        { heading: "Response", body: "We developed a portfolio architecture that gave each need its own pillar: supplements nourish, food-inspired body care indulges, and the Gen Z range plays. One design rule runs through all three: the more food-connected ingredients in the product, the more layered the pack. Shared brand anchors and a proprietary form language hold it together as one family, giving shoppers a shelf they can read by need and Albert Heijn a clear rationale for growth."},
        { heading: "The results", list: ["Scaled across Europe: Care is being rolled out to other Ahold Delhaize supermarket brands across Europe."]},
      ],
    },
  },
  {
    slug: "zagg",
    name: "ZAGG",
    client: "Heineken",
    subheading: "Our kind of energy",
    img: "/work/zagg/tile.jpg",
    portrait: "/work/zagg/portrait.jpg",
    tags: ["Brand", "Innovation"],
    caseStudy: {
      title: "ZAGG",
      subheading: "Our Kind of Energy",
      intro: "An energy drink for Africa, brewed with malt for energy that lasts as long as the hustle.",
      hero: "/work/zagg/hero.jpg",
      positioning: "“Our kind of energy”",
      accent: "#FFC72C",
      images: [
        { src: "/work/zagg/image-1.jpg", alt: "ZAGG mural: When the world zigs… we zagg" },
        { src: "/work/zagg/image-2.jpg", alt: "A can of ZAGG, powered by malt" },
      ],
      resultStat: { value: "46%", label: "of Nigeria’s energy drink market in six months." },
      askPrompts: ["What was the truth behind ZAGG?", "What is Our kind of energy?"],
      sections: [
        { heading: "Problem", body: "Heineken wanted an energy drink for Nigeria, and then the rest of Africa. Every energy drink on the shelf sold the same imported fantasy: a quick hit of wings, raging animals and bedroom bragging, pitched at young Africans as if they were kids. None of it matched how they actually live, with long days spent building businesses, careers and side hustles."},
        { heading: "Truth", body: "Other energy drinks sell a quick rush. Africa’s young cities run on stamina. ZAGG is brewed with malt, a traditional African ingredient that releases energy slowly, so it lasts as long as the hustle does."},
        { heading: "Response", body: "We worked with ethnographic researchers in Nigeria, South Africa and Egypt to understand what energy means to young Africans. That became ZAGG: real energy for real movers to go their own way. The brand idea: Our kind of energy. We made the name, the tagline, the strategy, the ideology, the voice and the manifesto. Next to ZAGG, every other can on the shelf looked imported."},
        { heading: "The results", list: ["46% of Nigeria’s energy drink market in six months.", "Stores sold out.", "“Our kind of energy” became the launch campaign.", "Named Innovative Brand of the Year at the Industry Summit Awards 2022."]},
      ],
    },
  },
]

// Everything, for the client space (behind the login).
export const ALL_WORK = ALL
export const ALL_CASE_STUDIES = ALL.filter((w) => w.caseStudy)

// Public work only. Everything outside the client space uses these, so private
// work can't leak into public pages, the sitemap, share images or Ask Veritas.
export const WORK = ALL.filter((w) => !w.private)
export const CASE_STUDIES = WORK.filter((w) => w.caseStudy)
export const PRIVATE_SLUGS = ALL.filter((w) => w.private).map((w) => w.slug)

// Filters on the Experience page, in this order. A filter only shows when at
// least one project carries its tag, so tags can be added here ahead of the work.
export const TAGS = ['Brand', 'Comms', 'Retail', 'Innovation']

// The line under the name in a case study's title box (falls back to the tile's).
export function caseSubheading(work) {
  return work.caseStudy?.subheading || work.subheading
}

// The name in a case study's title box (falls back to the tile's name).
export function caseTitle(work) {
  return work.caseStudy?.title || work.name
}

// Questions Ask Veritas suggests on a case study page.
export function askPromptsFor(work) {
  return work.caseStudy?.askPrompts || [`What was the truth behind ${work.client}?`]
}

// scope 'public' (default) or 'client' (the client space: everything).
const scoped = (scope) => (scope === 'client' ? ALL_CASE_STUDIES : CASE_STUDIES)

export function getCaseStudy(slug, scope = 'public') {
  return scoped(scope).find((w) => w.slug === slug) || null
}

// Neighbours among published case studies, in grid order. Null at either end,
// which the arrows show as an outline triangle (nothing further that way).
export function getNeighbours(slug, scope = 'public') {
  const list = scoped(scope)
  const i = list.findIndex((w) => w.slug === slug)
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  }
}
