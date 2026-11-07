import { Work } from '@/components/work'
import { ClientBar } from '@/components/client-bar'
import { workView } from '@/lib/work-view'
import { requireClient } from '@/lib/client-auth'

export const metadata = { title: 'Client space — Studio Veritas' }

// The full suite: every case study, public and client-only, in the Work grid.
export default async function ClientSpacePage() {
  await requireClient('/clients')
  const { items, tags } = workView('client')
  return (
    <Work items={items} tags={tags} label="Client space">
      <ClientBar privateCount={items.filter((w: { private?: boolean }) => w.private).length} />
    </Work>
  )
}
