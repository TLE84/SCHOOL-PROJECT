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
  const misdirected = emailLinkLandedElsewhere(request)
  if (misdirected) return NextResponse.redirect(misdirected)

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

/**
 * Supabase sends email links to its own /auth/v1/verify, which then redirects
 * to `redirect_to` — but only if that URL is on the project's Redirect URLs
 * list. Otherwise it falls back to the project's Site URL, dropping people on
 * the home page (or a path that does not exist) with the token still in the
 * query. Spot that and forward it to the route that can complete it.
 */
function emailLinkLandedElsewhere(request: NextRequest): URL | null {
  const { pathname, searchParams } = request.nextUrl
  if (pathname.startsWith('/auth/')) return null

  const hasToken =
    (searchParams.has('token_hash') && searchParams.has('type')) ||
    (searchParams.has('code') && pathname === '/')
  if (!hasToken) return null

  const target = new URL('/auth/confirm', request.url)
  searchParams.forEach((value, key) => target.searchParams.set(key, value))
  return target
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
