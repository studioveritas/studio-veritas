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
| **Title-box name** | The name in the black title box (optional, defaults to the tile name), e.g. `ALLBIRDS x SELFRIDGES` |
| **Title-box line** | The line under the name on the case study (optional, defaults to the tile line), e.g. `The Carbon Concept Store` |
| **Intro** | One sentence that opens the copy, above PROBLEM (optional) |
| **Tags** | Any of `Brand`, `Comms`, `Retail`, `Innovation` |
| **Copy** | Problem, Truth, Response, and The results (as a list) |
| **Hero photo** | The master image: it fills the screen behind the case study, up to 1920px wide. Landscape, 1920px wide, JPEG, ideally under 500 KB. Choose a strong, simple image with room at the bottom left for the title |
| **Tile photo** | 892 × 500 JPEG, used for share images (or crop it from the hero, see below) |
| **Portrait photo** | 4:5 JPEG, about 880 × 1100, for the Work page tile (`portrait.jpg`). Some tiles show it square, cropped from the middle |
| **Accent colour** | One colour from the brand, used for the headings in the case study, e.g. `accent: '#FF5A1F'` |
| **Extra images** | Optional, 1 to 3. Landscape JPEG, about 1600px wide, ideally under 300 KB each. Shown between the copy as you scroll |

## Steps on GitHub (no tools needed)

1. **Upload the photos.**
   - Go to the repository, then **Add file → Upload files**.
   - Drag in `hero.jpg`, `tile.jpg` and `portrait.jpg`.
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

This resizes the photo to `public/work/ketel-one/hero.jpg` (1920px wide) and crops a `tile.jpg` (892 × 500) and a 4:5 `portrait.jpg` from it.

- To use a separate tile photo, pass it as the third argument.
- To control the crop, add `left`, `right`, `top` or `bottom` as the fourth argument.

## How a case study opens

The Experience page doesn't change: clicking a tile opens the case study.

- **The master image** (`hero`) fills the screen and stays fixed behind the page with a slow drift. On screens wider than 1920px it stops at 1920px; beyond that the edges are black, with a thin hairline at the image edge. On phones held upright the portrait photo is used instead.
- **First screen:** the client and tags, the title, the title-box line in the accent colour, the intro, and Client / Discipline at the foot.
- **Scrolling down:** each section (Problem, Truth, Response) appears in a black pop-out, alternating left and right, and types out in the site's typewriter style as it comes into view. The image darkens as you scroll so the copy stays easy to read.
- **Images:** the first extra image follows Problem; the others sit side by side before The Results. Clicking an image enlarges it.
- **The Results** is a full-width pop-out with the results as a numbered list.
- **Type:** headings in the accent colour, IBM Plex Mono SemiBold, all at one size; body copy at one size in every pop-out (the same as the intro).
- **Getting around:** the X (top right) goes back to Experience, as does Escape; the side arrows and the ← → keys step through the case studies; *Next case study* sits at the foot.

## Extra images

Upload them next to the hero as `image-1.jpg`, `image-2.jpg`, `image-3.jpg` and list them inside `caseStudy`:

```js
images: [
  '/work/ketel-one/image-1.jpg',
  '/work/ketel-one/image-2.jpg',
  { src: '/work/ketel-one/image-3.jpg', alt: 'AR-enabled bottle' }, // optional description for screen readers
],
```

Or prepare them with one command: `npm run case-study-images -- ketel-one --images ~/Desktop/a.jpg ~/Desktop/b.jpg ~/Desktop/c.jpg`

## The Work page

Tiles appear in the order of `WORK`, in three columns (two on tablets, one on phones), and rise in as they scroll into view. In each run of nine, the 1st and 3rd tiles are square and the rest are 4:5; add `tile: 'square'` or `tile: 'portrait'` to an entry to choose. Nine tiles load first; LOAD MORE adds the next nine. The logo ticker under the grid uses the client logos in `components/clients-data.js`.

## Fine-tuning

Add any of these inside `caseStudy`:

- **`accent: '#FF5A1F'`**: the heading colour, taken from the brand. Pick one that reads well on black. Default: Veritas blue.
- **`masterPosition: '30% 50%'`**: which part of the master image stays in view when the screen crops it. The first number is left↔right (0% to 100%), the second is top↕bottom. Default: the centre.
- **`masterPortrait: '/work/ketel-one/portrait.jpg'`**: the master image on phones held upright. Default: the tile's portrait photo.
- **`positioning: '“A ferocious game played on the edge”'`**: the platform line, in its own pop-out after Truth, and under Platform on the first screen.
- **`resultStat: { value: '1.9M → 3.8M', label: '…' }`**: a headline figure at the top of The Results.
- `heroPosition`, `heroPositionMobile` and `heroSize` belonged to the previous case study card and are no longer used.
- **`askPrompts: ['What was the truth behind Ketel One?']`**: the question Ask Veritas suggests on the page. Default: "What was the truth behind <Client>?".

## Unpublish

Delete the `caseStudy: { … }` block. The tile returns to COMING SOON and the page returns a 404.

---

# Publishing a News + Insights article

Each article takes one entry in `components/news-data.js` and two images. Once committed, the tile appears on `/news`, the article goes live at `/news/<slug>`, the arrows include it, and it's added to the sitemap.

## What you need

| | |
|---|---|
| **Slug** | e.g. `in-signo-veritas-05` → `/news/in-signo-veritas-05` |
| **Name** | e.g. `IN SIGNO VERITAS #05` |
| **Title** | The headline, in sentence case |
| **Tile image** | 4:5 JPEG, 880 × 1100 → `public/news/<slug>/tile.jpg` |
| **Article image** | 4:5, 1080 × 1350: PNG, JPEG or animated GIF → `public/news/<slug>/image.png` (or `.jpg` / `.gif`) |
| **Copy** | ■ The subject, ■ The signal (a line plus points with sources), ■ The truth, ■ Worth asking, and an optional closing line |

## Steps

1. Upload both images to `public/news/<slug>/` (Add file → Upload files, type the folder into the path).
2. In `components/news-data.js`, copy the template at the top and fill it in. Put a blank line (`\n\n`) inside a body to start a new paragraph.
3. Commit to a new branch and open a pull request; check the Vercel preview, then merge.

## How it reads

Tiles sit in a brown monotone and come into colour on rollover (on phones, as they reach mid-screen). The article shows THE SUBJECT and THE SIGNAL; MORE types out THE TRUTH and WORTH ASKING, then the closing line, where "Get in touch" links to the Contact page. To show a tile before the article is ready, add `comingSoon: true`: it shows COMING SOON and doesn't link.
