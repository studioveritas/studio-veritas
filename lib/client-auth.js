// The client space login: one shared password, set as CLIENT_PASSWORD in Vercel
// (Project → Settings → Environment Variables), then redeploy.
//
// Logging in sets a signed cookie (sv_client) that lasts 30 days. The cookie is
// signed with CLIENT_SESSION_SECRET if it is set, otherwise with the password
// itself, so changing the password logs everyone out.
// With no CLIENT_PASSWORD set, nobody can get in.

import 'server-only'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const CLIENT_COOKIE = 'sv_client'
export const SESSION_DAYS = 30

const password = () => process.env.CLIENT_PASSWORD || ''
const secret = () => process.env.CLIENT_SESSION_SECRET || password()

export const passwordIsSet = () => password().length > 0

const sha = (s) => createHash('sha256').update(String(s)).digest()
const sign = (exp) => createHmac('sha256', secret()).update(`sv-client.v1.${exp}`).digest('base64url')

export function checkPassword(input) {
  if (!passwordIsSet()) return false
  return timingSafeEqual(sha(input), sha(password()))
}

export function makeToken(now = Date.now()) {
  const exp = now + SESSION_DAYS * 24 * 60 * 60 * 1000
  return `${exp}.${sign(exp)}`
}

export function verifyToken(token) {
  if (!passwordIsSet() || typeof token !== 'string') return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || !(Number(exp) > Date.now())) return false
  const want = Buffer.from(sign(exp))
  const got = Buffer.from(sig)
  return want.length === got.length && timingSafeEqual(want, got)
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_DAYS * 24 * 60 * 60,
}

export async function isClient() {
  const jar = await cookies()
  return verifyToken(jar.get(CLIENT_COOKIE)?.value)
}

// For pages in the client space: anyone not logged in goes to the login page.
export async function requireClient(from = '/clients') {
  if (!(await isClient())) redirect(`/clients/login?from=${encodeURIComponent(from)}`)
}
