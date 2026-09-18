import { NextResponse, type NextRequest } from 'next/server'
import { decodeSession, homePathForRole, SESSION_COOKIE, type SessionUser } from '@/lib/auth/session'
import { isSupabaseAuthEnabled } from '@/utils/supabase/config'
import { updateSession, withSessionCookies } from '@/utils/supabase/proxy'

/**
 * Session refresh and route protection (Next.js 16 `proxy`, formerly middleware).
 *
 * With Supabase configured, the session comes from Supabase (refreshed here on
 * every request); otherwise from the demo cookie. Either way the same rules
 * gate the two private areas:
 *   - /admin   → administrators only
 *   - /portal  → any signed-in user (students, lecturers, admins)
 *
 * Pages and server actions re-check on their own — this is the first line,
 * not the only one.
 */
export async function proxy(request: NextRequest) {
  let response: NextResponse
  let user: SessionUser | null

  if (isSupabaseAuthEnabled()) {
    ;({ response, user } = await updateSession(request))
  } else {
    response = NextResponse.next()
    user = decodeSession(request.cookies.get(SESSION_COOKIE)?.value)
  }

  const redirectTo = (path: string) =>
    withSessionCookies(NextResponse.redirect(new URL(path, request.url)), response)

  const { pathname } = request.nextUrl
  const isAdminArea = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'
  const isPortalArea = pathname.startsWith('/portal')
  const isLogin = pathname === '/login'
  const isSignup = pathname === '/signup'

  // Already signed in and visiting a login or sign-up page → send to their home.
  if (user && (isLogin || isAdminLogin || isSignup)) {
    return redirectTo(homePathForRole(user.role))
  }

  // Admin area (except its login page) requires an administrator.
  if (isAdminArea && !isAdminLogin) {
    if (!user) return redirectTo('/admin/login')
    if (user.role !== 'admin') return redirectTo('/portal')
  }

  // Portal requires any signed-in user.
  if (isPortalArea && !user) {
    return redirectTo('/login')
  }

  return response
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
