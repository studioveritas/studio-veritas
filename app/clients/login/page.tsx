import { redirect } from 'next/navigation'
import { ClientLogin } from '@/components/client-login'
import { isClient } from '@/lib/client-auth'

export const metadata = {
  title: 'Client login — Studio Veritas',
  description: 'The Studio Veritas client space: the full suite of case studies, for clients and partners.',
}

export default async function ClientLoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams
  if (await isClient()) redirect('/clients')
  return <ClientLogin from={from || '/clients'} />
}
