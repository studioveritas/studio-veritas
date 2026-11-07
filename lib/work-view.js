// Turns components/work-data.js into exactly what a page is allowed to show,
// on the server. Browser components (work.jsx, case-study.jsx) get these plain
// objects as props and never import the data file, so a private case study's
// copy and photos only reach a visitor who is logged in to the client space.
//
// scope 'public'  → public work, links to /work/<slug>
// scope 'client'  → everything, links to /clients/work/<slug>

import 'server-only'
import { WORK, ALL_WORK, TAGS, getCaseStudy, getNeighbours, caseSubheading, caseTitle } from '@/components/work-data'
import { WORK_TILES } from '@/components/work-images'
import { CASE_STUDY_HEROES } from '@/components/case-images'

export const BASES = { public: '/work', client: '/clients/work' }
export const HOMES = { public: '/work', client: '/clients' }

const isPath = (s) => typeof s === 'string' && s.startsWith('/')

// The few case study fields the zoom/crossfade needs (masterOf in case-zoom.js).
function zoomFields(cs) {
  if (!cs) return null
  const { hero, masterPortrait, masterPosition } = cs
  return { hero: isPath(hero) ? hero : undefined, masterPortrait, masterPosition }
}

// A grid tile: no case study copy, just what the tile and the zoom use.
function tile(w, scope) {
  return {
    slug: w.slug,
    name: w.name,
    client: w.client,
    subheading: w.subheading,
    tags: w.tags || [],
    ...(w.tile ? { tile: w.tile } : {}),
    ...(w.portrait ? { portrait: w.portrait } : {}),
    src: w.portrait || (isPath(w.img) ? w.img : WORK_TILES[w.img]) || null,
    href: w.caseStudy ? `${BASES[scope]}/${w.slug}` : null,
    caseStudy: zoomFields(w.caseStudy),
    ...(scope === 'client' && w.private ? { private: true } : {}),
  }
}

export function workView(scope = 'public') {
  const list = scope === 'client' ? ALL_WORK : WORK
  const items = list.map((w) => tile(w, scope))
  return { items, tags: TAGS, home: HOMES[scope] }
}

// One case study page: the full copy, its master image resolved, and the two
// neighbours (zoom fields only) within the same scope.
export function caseStudyView(slug, scope = 'public') {
  const w = getCaseStudy(slug, scope)
  if (!w) return null
  const cs = w.caseStudy
  const { prev, next } = getNeighbours(slug, scope)
  const near = (n) => (n ? tile(n, scope) : null)
  return {
    work: {
      ...w,
      href: `${BASES[scope]}/${w.slug}`,
      title: caseTitle(w),
      sub: caseSubheading(w),
      caseStudy: { ...cs, masterSrc: isPath(cs.hero) ? cs.hero : CASE_STUDY_HEROES[cs.hero] || null },
    },
    prev: near(prev),
    next: near(next),
    home: HOMES[scope],
  }
}
