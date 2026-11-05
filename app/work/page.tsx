import { Work } from '@/components/work'

export const metadata = {
  title: 'Work — Studio Veritas',
  description: 'Selected work by Studio Veritas: Windhoek, Premiership Rugby, Jordan Wings, Seedlip, Allbirds, Canyon, Uber Social Impact, Icebreaker and Ketel One.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Work — Studio Veritas',
    description: 'Selected work: Windhoek, Seedlip, Premiership Rugby, Jordan Wings, Allbirds, Canyon, Uber, Icebreaker and Ketel One.',
    url: '/work',
    siteName: 'Studio Veritas',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function ExperiencePage() {
  return <Work />
}
