// The client space: password protected (lib/client-auth.js, proxy.ts) and kept
// out of search engines.
export const metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return children
}
