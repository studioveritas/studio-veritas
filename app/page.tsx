import { Experience } from '@/components/experience'
import { WORK } from '@/components/work-data'

const WORK_LIST = WORK.map((w: { client: string; subheading: string }) => `${w.client} (${w.subheading})`).join(', ')

export default function Home() {
  return <Experience workList={WORK_LIST} />
}
