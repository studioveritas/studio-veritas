import { Clients } from '@/components/clients'

export const metadata = {
  title: 'Client Experience — Studio Veritas',
  description: 'Brands Studio Veritas has worked with.',
  alternates: {
    canonical: '/clients',
  },
}

export default function ClientsPage() {
  return <Clients />
}
