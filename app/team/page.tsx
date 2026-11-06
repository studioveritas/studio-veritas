import { Team } from '@/components/team'

export const metadata = {
  title: 'Team — Studio Veritas',
  description: 'Meet Guillaume Furminger and Ali Marmaduke: big-agency strategy and creative talent, working directly with companies and agencies.',
  alternates: { canonical: '/team' },
  openGraph: { title: 'Team — Studio Veritas', description: 'Meet Guillaume Furminger and Ali Marmaduke: big-agency strategy and creative talent, working directly with companies and agencies.', url: '/team', siteName: 'Studio Veritas', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Team — Studio Veritas', description: 'Meet Guillaume Furminger and Ali Marmaduke: big-agency strategy and creative talent, working directly with companies and agencies.' },
}

export default function TeamPage() {
  return <Team />
}
