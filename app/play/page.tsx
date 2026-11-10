import TruthInvaders from '@/components/truth-invaders/TruthInvaders'

// The secret arcade. Reached from the contact page: roll over "work" in
// "Let’s work together", it turns into PLAY, click it. Kept out of search and the sitemap.
export const metadata = {
  title: 'Truth Invaders — Studio Veritas',
  robots: { index: false, follow: false },
}

export default function PlayPage() {
  return <TruthInvaders mode="secret" exitTo="/contact" />
}
