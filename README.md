# Studio Veritas

## Publishing case studies

See [CASE-STUDIES.md](CASE-STUDIES.md): a template in `components/work-data.js` plus two photos in `public/work/<slug>/`.

## What's here

A complete Next.js 16 (App Router) project. `components/experience.jsx`
is the whole interactive site; everything else is standard scaffolding
(layout, Tailwind, Prisma, API route) so it builds and runs.

**Known gaps to fill in before/after launch:**
- Share images (1200×630) are generated at build time by the
  `opengraph-image.tsx` files: the site default, /experience, and one per
  case study (photo + title box). Fonts for them live in `assets/fonts`.
- The site domain is `https://www.studio-veritas.com` (`SITE_URL` in
  `app/layout.tsx`, also used by `app/sitemap.ts` and `public/robots.txt`).
- The contact panel just opens a `mailto:` link — there's no database or
  API route behind it (an earlier version of this project scaffolded a
  Prisma-backed `/api/contact` route, but it was removed: it required
  running `npx prisma generate` before every build, and if that step was
  skipped the entire site would fail to build. Since the form was never
  wired to actually call it, it was a build-time risk for zero benefit.
  If you want real submissions, add a lightweight API route later —
  Vercel's own form/email integrations or a service like Formspree are
  simpler than reintroducing Prisma for this).

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you should see the full site.

## 2. Push it to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new empty repo on GitHub (github.com/new — don't initialize it
with a README), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/studio-veritas.git
git branch -M main
git push -u origin main
```

## 3. Deploy on Vercel (free, easiest for Next.js)

1. Go to https://vercel.com and sign up/log in with your GitHub account.
2. Click **Add New → Project**, select the `studio-veritas` repo, click **Deploy**.
   Vercel auto-detects Next.js — no config needed.
3. You'll get a live URL like `studio-veritas-xyz.vercel.app` within a minute or two.

## 4. Connect your custom domain

1. In the Vercel project, go to **Settings → Domains**.
2. Type in your domain (e.g. `studioveritas.com`) and click **Add**.
3. Vercel will show you DNS records to add. Typically:
   - An **A record** for the root domain (`@`) pointing to `76.76.21.21`
   - A **CNAME record** for `www` pointing to `cname.vercel-dns.com`
   (Vercel shows the exact current values for your domain — use those,
   they occasionally change.)
4. Go to wherever your domain is registered (GoDaddy, Namecheap,
   Cloudflare, etc.), find **DNS settings** for the domain, and add the
   records exactly as Vercel showed you.
5. DNS changes can take anywhere from a few minutes to ~48 hours to
   propagate. Vercel's dashboard will show a green checkmark once it
   detects the domain is correctly pointed and has issued an SSL
   certificate automatically.

## 5. Domain

The domain is set to `https://www.studio-veritas.com` in code.
`NEXT_PUBLIC_SITE_URL` in Vercel can override it, but is ignored unless it
holds a full `https://` URL (a leftover placeholder value is ignored too).
- Add `public/og-image.png`, `public/favicon.ico`, and
  `public/apple-icon.png` when you have them.
