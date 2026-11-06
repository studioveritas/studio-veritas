import { Process } from '@/components/process'

export const metadata = {
  title: 'Principles — Studio Veritas',
  description: 'Truthful, Noticeable, Memorable: the three principles Studio Veritas tests every idea against.',
  alternates: { canonical: '/principles' },
  openGraph: { title: 'Principles — Studio Veritas', description: 'Truthful, Noticeable, Memorable: the three principles Studio Veritas tests every idea against.', url: '/principles', siteName: 'Studio Veritas', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Principles — Studio Veritas', description: 'Truthful, Noticeable, Memorable: the three principles Studio Veritas tests every idea against.' },
}

export default function ProcessPage() {
  return <Process />
}
