import { Contact } from '@/components/contact'

export const metadata = {
  title: 'Contact — Studio Veritas',
  description: 'Contact Studio Veritas, your team for strategy, design and innovation. Email info@studio-veritas.com.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact — Studio Veritas', description: 'Contact Studio Veritas, your team for strategy, design and innovation. Email info@studio-veritas.com.', url: '/contact', siteName: 'Studio Veritas', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Contact — Studio Veritas', description: 'Contact Studio Veritas, your team for strategy, design and innovation. Email info@studio-veritas.com.' },
}

export default function ContactPage() {
  return <Contact />
}
