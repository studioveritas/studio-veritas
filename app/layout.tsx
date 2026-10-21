import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import AskVeritas from '@/components/ask-veritas/AskVeritas'

export const dynamic = 'force-dynamic'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
        {/* Fonts loaded once, here, via real <link> tags — not the @import
            previously duplicated inside every page's own <style> block.
            @import is asynchronous and lower-priority than <link>, so on a
            cold production load the labels below could paint in a fallback
            font (different width/letter-spacing) before swapping to IBM
            Plex Mono, which is what was likely causing the Principles page
            labels to look shifted relative to the triangle. preconnect
            gets the connection warmed up before the stylesheet is requested. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        {children}
        {/* Ask Veritas: AI chat, opened by the outline triangle in the bottom-left corner of every page.
            Lives outside the pages, so no page code changes. See ASK-VERITAS.md. */}
        <AskVeritas trigger="triangle" side="left" />
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
