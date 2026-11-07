// Guards the client space before anything is served.
//
// - /clients/**: anyone not logged in is sent to /clients/login (the pages check too).
// - /work/<private-slug>/<file>: photos of private case studies, which live in
//   public/work/, answer 404 unless the visitor is logged in.
//
// Which case studies are private comes from `private: true` in components/work-data.js.

import { NextResponse, type NextRequest } from 'next/server'
import { CLIENT_COOKIE, verifyToken } from '@/lib/client-auth'
import { PRIVATE_SLUGS } from '@/components/work-data'

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const loggedIn = verifyToken(req.cookies.get(CLIENT_COOKIE)?.value)

  if (pathname === '/clients' || pathname.startsWith('/clients/')) {
    if (loggedIn || pathname === '/clients/login' || pathname.startsWith('/clients/login/')) {
      const res = NextResponse.next()
      res.headers.set('X-Robots-Tag', 'noindex, nofollow')
      res.headers.set('Cache-Control', 'private, no-store')
      return res
    }
    const url = req.nextUrl.clone()
    url.pathname = '/clients/login'
    url.search = `?from=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  const file = pathname.match(/^\/work\/([^/]+)\/.+/)
  if (file && (PRIVATE_SLUGS as string[]).includes(file[1]) && !loggedIn) {
    return new NextResponse('Not found', { status: 404 })
  }
  if (file && (PRIVATE_SLUGS as string[]).includes(file[1])) {
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'private, no-store')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/clients', '/clients/:path*', '/work/:slug/:file*'],
}
