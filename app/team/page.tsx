import { Team } from '@/components/team'

export const metadata = {
  title: 'Team — Studio Veritas',
  description: 'Meet the Studio Veritas team.',
  alternates: {
    canonical: '/team',
  },
}

export default function TeamPage() {
  return <Team />
}
