import './globals.css'
import { MotionPrefs } from '@/components/motion-prefs'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import AskVeritas from '@/components/ask-veritas/AskVeritas'
import { CASE_STUDIES, askPromptsFor } from '@/components/work-data'

// Ask Veritas's suggested questions on each public case study page.
const CASE_PROMPTS = Object.fromEntries(
  CASE_STUDIES.map((w: { slug: string; client: string }) => [w.slug, { slug: w.slug, client: w.client, prompts: askPromptsFor(w) as string[] }])
)
import { SiteNav } from '@/components/site-chrome'
import { IntroLoader } from '@/components/intro-loader'
import { ThemeSwitch } from '@/components/theme-switch'
import { SV_SUN_SCRIPT } from '@/lib/sv-sun'

// No blanket force-dynamic: public pages are pre-rendered and served from the CDN; the client
// space and /api/ask read cookies or call out, so Next renders them per request on its own.

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // no maximumScale: visitors must be able to pinch-zoom (WCAG 1.4.4)
  viewportFit: 'cover',
  themeColor: '#D8FF00',
}

// The live domain (studio-veritas.com redirects here). Canonical links and the
// absolute URLs of share images are built from it. NEXT_PUBLIC_SITE_URL can
// override it, but only when it holds a full https:// URL.
const SITE_URL = 'https://www.studio-veritas.com'
const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim()
const BASE_URL = /^https?:\/\/[^/]+/.test(envUrl) && !/replace-with/i.test(envUrl) ? envUrl : SITE_URL

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Studio Veritas — Creative Strategy',
  description:
    'Good strategy starts with hard questions. We find the truth that makes brands matter.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Studio Veritas — Creative Strategy',
    description:
      'Good strategy starts with hard questions. We find the truth that makes brands matter.',
    url: '/',
    siteName: 'Studio Veritas',
    type: 'website',
    // Share image: app/opengraph-image.tsx (each section can have its own).
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Veritas — Creative Strategy',
    description:
      'Good strategy starts with hard questions. We find the truth that makes brands matter.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts are self-hosted (app/globals.css @font-face, files in public/fonts). The two
            weights on every first screen are preloaded so text paints in IBM Plex Mono at once. */}
        <link rel="preload" href="/fonts/ibm-plex-mono-latin-500-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ibm-plex-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* The sky isn't preloaded: it's atmosphere, and on Work and case studies it would compete with the photos people came for. */}
        {/* Day / night: decided by the sun (or the visitor's toggle) before first paint — lib/sv-sun.js */}
        <script dangerouslySetInnerHTML={{ __html: SV_SUN_SCRIPT }} />
        {/* First-load sticker intro (home page, once per session). Blocking on purpose:
            it hides the chrome before the first paint. See components/intro-loader.jsx. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/sv-intro.js" data-auto="" />
      </head>
      <body>
        <MotionPrefs>
        {children}
        {/* Nav bar (Ask Veritas · wordmark · menu) that follows you down every page, plus the
            eye in the bottom-left corner. See components/site-chrome.jsx. */}
        <SiteNav />
        {/* Ask Veritas: AI chat, opened by the triangle in the nav bar; the panel opens beneath it. */}
        <AskVeritas trigger="none" side="top" casePrompts={CASE_PROMPTS} />
        <ThemeSwitch />
        <IntroLoader />
        <ChunkLoadErrorHandler />
        </MotionPrefs>
      </body>
    </html>
  )
}
