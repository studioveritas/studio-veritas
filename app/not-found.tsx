import TruthInvaders from '@/components/truth-invaders/TruthInvaders'

// Every page that doesn't exist (and every notFound() call) opens Truth Invaders
// on its "ERROR 404 · PAGE NOT FOUND" title screen. ESC goes home.
export const metadata = {
  title: '404 — Lost in space | Studio Veritas',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      {/* screen readers and crawlers get a real heading and a way out; the game is canvas */}
      <h1 className="sr-only">Page not found. <a href="/">Back to Studio Veritas</a></h1>
      <TruthInvaders mode="404" exitTo="/" />
    </>
  )
}
