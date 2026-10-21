# Publishing a case study

Each case study takes one entry in `components/work-data.js` and two photos. Once you commit them, the following update automatically:

- the tile becomes a link
- the case study page goes live at `/experience/<slug>`
- the arrows include it
- it gets a share image for LinkedIn and others
- it's added to the sitemap
- Ask Veritas learns it and suggests a question about it
- it's added to `/llms.txt`

You can do it all in the browser on GitHub. Vercel deploys within a couple of minutes.

## What you need

| | |
|---|---|
| **Slug** | The web address, in lowercase with hyphens, e.g. `ketel-one` → `/experience/ketel-one` |
| **Name** | On the tile and the title box, e.g. `KETEL ONE` |
| **Client** | The brand as normally written, e.g. `Ketel One` |
| **Tile line** | The line under the tile, e.g. `Reframing the cocktail moment` |
| **Title-box line** | The line under the name on the case study (optional, defaults to the tile line) |
| **Tags** | Any of `Brand`, `Comms`, `Retail`, `Innovation` |
| **Copy** | Problem, Truth, Response, and The results (as a list) |
| **Hero photo** | Landscape, about 1850px wide, JPEG, ideally under 400 KB |
| **Tile photo** | 892 × 500 JPEG (or crop it from the hero, see below) |

## Steps on GitHub (no tools needed)

1. **Upload the photos.**
   - Go to the repository, then **Add file → Upload files**.
   - Drag in `hero.jpg` and `tile.jpg`.
   - Before committing, type the folder into the file path: `public/work/ketel-one/`.
   - Commit to a new branch.
2. **Add the copy.**
   - Open `components/work-data.js` and click the pencil to edit.
   - The template is at the top of the file.
   - Find the project's existing one-line entry (e.g. `{ slug: 'ketel-one', … }`) and replace that line with the template.
   - Remove the `//` at the start of each template line, then fill it in.
   - To publish a project that isn't on the grid yet, paste the template where it should sit in the grid order.
3. **Commit and open a pull request.** Vercel posts a preview link on the PR. Check the page there, then merge to put it live.

### Rules for the copy

- Text sits between straight single quotes: `'like this'`.
- Inside the text, use curly apostrophes and quotes (`’ “ ”`). A straight `'` ends the text early and breaks the build. The preview build fails safely and the live site is untouched.
- Keep the commas at the end of each line and each `{ … },` block.
- Headings are always `Problem`, `Truth`, `Response` and `The results`. The page shows them in capitals, in IBM Plex Mono SemiBold.

## Optional: prepare the photos with one command

If you have the project on your computer:

```bash
npm run case-study-images -- ketel-one ~/Desktop/ketel-hero.png
```

This resizes the photo to `public/work/ketel-one/hero.jpg` (1848px wide) and crops a `tile.jpg` (892 × 500) from it.

- To use a separate tile photo, pass it as the third argument.
- To control the crop, add `left`, `right`, `top` or `bottom` as the fourth argument.

## Fine-tuning

Add any of these inside `caseStudy`:

- **`heroPosition: '70% 50%'`**: which part of the photo stays visible beside the copy box. The first number is left↔right (0% to 100%), the second is top↕bottom. The copy box covers the left half on desktop, so move the subject right.
- **`heroPositionMobile: '60% 50%'`**: the same for phones.
- **`askPrompts: ['What was the truth behind Ketel One?']`**: the question Ask Veritas suggests on the page. Default: "What was the truth behind <Client>?".

## Unpublish

Delete the `caseStudy: { … }` block. The tile returns to COMING SOON and the page returns a 404.
