#!/usr/bin/env node
// Responsive WebP copies of every Work photo, so phones download a phone-sized image.
//
//   npm run work-image-variants            (also run by case-study-images at the end)
//
// For each JPEG in public/work/<slug>/ it writes <name>-<width>.webp beside it:
//   portrait.jpg  → 440, 880        (Work grid tiles)
//   hero.jpg      → 960, 1440, 1920 (case study master)
//   image-N.jpg   → 800, 1600       (MORE IMAGERY)
// Copies of private case studies sit in the same folder, so proxy.ts guards them too.
// Files already newer than their source are skipped.

import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('This needs the "sharp" image library. Run: npm install --no-save sharp')
  process.exit(1)
}

const ROOT = 'public/work'
const WIDTHS = { portrait: [440, 880], hero: [960, 1440, 1920], image: [800, 1600] }
const kindOf = (name) => (name.startsWith('image-') ? 'image' : name)

let made = 0
for (const slug of await readdir(ROOT)) {
  const dir = join(ROOT, slug)
  if (!(await stat(dir)).isDirectory()) continue
  for (const file of await readdir(dir)) {
    const m = file.match(/^([a-z0-9-]+)\.(jpe?g|png)$/i)
    if (!m) continue
    const widths = WIDTHS[kindOf(m[1])]
    if (!widths) continue
    const src = join(dir, file)
    const srcTime = (await stat(src)).mtimeMs
    const { width: natural } = await sharp(src).metadata()
    for (const w of widths) {
      if (w > natural && w !== widths[0]) continue // never upscale (but always keep one size)
      const out = join(dir, `${m[1]}-${w}.webp`)
      const done = await stat(out).then((s) => s.mtimeMs >= srcTime).catch(() => false)
      if (done) continue
      await sharp(src).resize({ width: Math.min(w, natural) }).webp({ quality: 74, effort: 5 }).toFile(out)
      made++
    }
  }
}
console.log(`work-image-variants: ${made} file(s) written`)

// Manifest of what exists, read by lib/work-view.js (public/ files aren't on disk in Vercel functions).
import { writeFile } from 'node:fs/promises'
const manifest = {}
for (const slug of (await readdir(ROOT)).sort()) {
  const dir = join(ROOT, slug)
  if (!(await stat(dir)).isDirectory()) continue
  for (const file of (await readdir(dir)).sort()) {
    const m = file.match(/^([a-z0-9-]+?)-(\d+)\.webp$/)
    if (!m) continue
    const key = `/work/${slug}/${m[1]}`
    ;(manifest[key] ||= []).push(Number(m[2]))
  }
}
for (const k in manifest) manifest[k].sort((a, b) => a - b)
await writeFile('lib/work-image-manifest.json', JSON.stringify(manifest, null, 1) + '\n')
