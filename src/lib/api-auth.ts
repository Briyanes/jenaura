import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'jenaura_admin_session'

export async function requireAdminAuth(): Promise<{ authorized: boolean; response?: NextResponse }> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  if (!session?.value) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { authorized: true }
}
