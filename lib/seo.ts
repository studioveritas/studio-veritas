// Search snippets: Google shows roughly 155–160 characters of a meta description.
// clip() keeps the first paragraph and trims it at a word boundary so snippets never cut mid-word.
export function clip(text: string, max = 158): string {
  const first = String(text || '').split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim()
  if (first.length <= max) return first
  const cut = first.slice(0, max - 1)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.–—-]+$/, '') + '…'
}
