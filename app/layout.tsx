import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'

export const dynamic = 'force-dynamic'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f0f3d',
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
      <head />
      <body>
        {children}
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
