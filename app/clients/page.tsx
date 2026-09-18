import { Clients } from '@/components/clients'

export const metadata = {
  title: 'Clients — Studio Veritas',
  description: 'Brands Studio Veritas has worked with.',
  alternates: {
    canonical: '/clients',
  },
}

export default function ClientsPage() {
  return <Clients />
}
