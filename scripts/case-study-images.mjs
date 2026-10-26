#!/usr/bin/env node
// Prepare the two photos for a case study, at the right size and weight.
//
//   npm run case-study-images -- <slug> <hero-photo> [tile-photo] [focus]
//
//   npm run case-study-images -- ketel-one ~/Desktop/ketel.png
//   npm run case-study-images -- ketel-one ~/Desktop/ketel.png ~/Desktop/ketel-tile.jpg
//   npm run case-study-images -- ketel-one ~/Desktop/ketel.png "" right
//   npm run case-study-images -- ketel-one --images ~/Desktop/a.jpg ~/Desktop/b.jpg ~/Desktop/c.jpg
//
// Writes public/work/<slug>/hero.jpg (1848px wide) and tile.jpg (892x500,
// cropped from the tile photo, or from the hero photo if none is given).
// [focus] decides which part of the photo the tile keeps:
// centre (default), left, right, top or bottom.
// With --images, writes up to three extra images as image-1.jpg … image-3.jpg
// (1600px wide) for the MORE IMAGERY grid, and prints the lines to paste.

import { mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const imagesMode = args[1] === '--images'
const [slug, heroSrc, tileSrcArg, focusArg] = args
if (!slug || !heroSrc || (imagesMode && args.length < 3)) {
  console.error('Usage: npm run case-study-images -- <slug> <hero-photo> [tile-photo] [focus]')
  process.exit(1)
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`"${slug}" isn't a valid slug. Use lowercase letters, numbers and hyphens, e.g. ketel-one`)
  process.exit(1)
}

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('This needs the "sharp" image library. Run: npm install --no-save sharp')
  process.exit(1)
}

if (imagesMode) {
  const files = args.slice(2, 5)
  const dir = resolve('public', 'work', slug)
  await mkdir(dir, { recursive: true })
  const lines = []
  for (const [i, f] of files.entries()) {
    const out = join(dir, `image-${i + 1}.jpg`)
    await sharp(resolve(f))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .flatten({ background: '#141414' })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(out)
    lines.push(`        '/work/${slug}/image-${i + 1}.jpg',`)
  }
  if (args.length > 5) console.log('Only the first three images are used.')
  console.log(`Done. Add inside caseStudy:\n      images: [\n${lines.join('\n')}\n      ],`)
  process.exit(0)
}

const focus = { left: 'west', right: 'east', top: 'north', bottom: 'south' }[focusArg] || 'centre'
const outDir = resolve('public', 'work', slug)
await mkdir(outDir, { recursive: true })

const hero = join(outDir, 'hero.jpg')
await sharp(resolve(heroSrc))
  .rotate()
  .resize({ width: 1848, withoutEnlargement: true })
  .flatten({ background: '#141414' })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(hero)

const tile = join(outDir, 'tile.jpg')
await sharp(resolve(tileSrcArg || heroSrc))
  .rotate()
  .resize(892, 500, { fit: 'cover', position: focus })
  .flatten({ background: '#141414' })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(tile)

console.log(`Done:
  public/work/${slug}/hero.jpg   ->  hero: '/work/${slug}/hero.jpg'
  public/work/${slug}/tile.jpg   ->  img:  '/work/${slug}/tile.jpg'`)
