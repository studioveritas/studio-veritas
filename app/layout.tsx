import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const dynamic = 'force-dynamic'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#D8FF00',
}

// TODO: replace with your real production domain before deploying.
const SITE_URL = 'https://REPLACE-WITH-YOUR-DOMAIN.com'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || SITE_URL),
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
    // Add /public/og-image.png (1200x630) for this to render — not yet supplied.
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Veritas — Creative Strategy',
    description:
      'Good strategy starts with hard questions. We find the truth that makes brands matter.',
    images: ['/og-image.png'],
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
        <ChunkLoadErrorHandler />
        <SpeedInsights />
      </body>
    </html>
  )
}
