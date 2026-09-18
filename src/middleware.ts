import { NextResponse, type NextRequest } from 'next/server'
import { decodeSession, homePathForRole, SESSION_COOKIE } from '@/lib/auth/session'

/**
 * Route protection for the demo.
 *
 * Auth is a hardcoded, cookie-based demo (see `src/lib/auth`), so there is no
 * Supabase session refresh here — the middleware just reads the session cookie
 * and gates the two private areas:
 *   - /admin   → administrators only
 *   - /portal  → any signed-in user (students, lecturers, admins)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const user = decodeSession(request.cookies.get(SESSION_COOKIE)?.value)

  const isAdminArea = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'
  const isPortalArea = pathname.startsWith('/portal')
  const isLogin = pathname === '/login'
  const isSignup = pathname === '/signup'

  // Already signed in and visiting a login or sign-up page → send to their home.
  if (user && (isLogin || isAdminLogin || isSignup)) {
    return NextResponse.redirect(new URL(homePathForRole(user.role), request.url))
  }

  // Admin area (except its login page) requires an administrator.
  if (isAdminArea && !isAdminLogin) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }

  // Portal requires any signed-in user.
  if (isPortalArea && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
