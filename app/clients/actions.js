'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CLIENT_COOKIE, checkPassword, cookieOptions, makeToken, passwordIsSet } from '@/lib/client-auth'

// Only ever send people back into the client space.
const safeFrom = (from) => (typeof from === 'string' && /^\/clients(\/[\w/-]*)?$/.test(from) && !from.startsWith('/clients/login') ? from : '/clients')

export async function login(_prev, formData) {
  if (!passwordIsSet()) return { error: 'The client space isn’t open yet. Email info@studio-veritas.com for access.' }
  const ok = checkPassword(String(formData.get('password') || ''))
  if (!ok) {
    // Slows down anyone guessing.
    await new Promise((r) => setTimeout(r, 900))
    return { error: 'That password isn’t right. Try again, or email info@studio-veritas.com.' }
  }
  const jar = await cookies()
  jar.set(CLIENT_COOKIE, makeToken(), cookieOptions)
  redirect(safeFrom(formData.get('from')))
}

export async function logout() {
  const jar = await cookies()
  jar.delete(CLIENT_COOKIE)
  redirect('/clients/login')
}
