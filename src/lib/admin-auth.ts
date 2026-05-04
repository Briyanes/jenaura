import { cookies } from 'next/headers'
import { env } from './env-validation'

const ADMIN_COOKIE_NAME = 'jenaura_admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function createAdminSession() {
  const cookieStore = await cookies()
  const sessionToken = crypto.randomUUID()

  cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/admin',
  })

  return sessionToken
}

export async function verifyAdminSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)

  if (!sessionToken) {
    return null
  }

  // In production, you should verify this against a database or Redis
  // For now, we'll just check if the token exists
  return sessionToken.value
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === env.adminPassword
}
