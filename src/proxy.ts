import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple rate limiting store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT = 100 // requests per minute
const RATE_WINDOW = 60_000 // 1 minute

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin route protection — redirect to login if no session cookie
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('jenaura_admin_session')
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (record && now - record.lastReset < RATE_WINDOW) {
      if (record.count >= RATE_LIMIT) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
      record.count++
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now })
    }

    // Clean old entries to prevent memory leak
    if (rateLimitMap.size > 1000) {
      for (const [key, val] of rateLimitMap) {
        if (now - val.lastReset > RATE_WINDOW) rateLimitMap.delete(key)
      }
    }
  }

  // Security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
