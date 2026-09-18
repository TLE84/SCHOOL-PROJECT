import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sessionUserFromSupabase } from '@/lib/auth/supabase-user'
import type { SessionUser } from '@/lib/auth/session'
import { requireSupabaseConfig } from './config'

/**
 * Refresh the Supabase session for this request and report who is signed in.
 *
 * Runs in the proxy before every page. Any refreshed auth cookies are written
 * to the returned `response`; callers that redirect instead must carry them
 * over (see `withSessionCookies`) or the refreshed session is lost.
 *
 * The user comes from `getClaims()`, which verifies the access token's
 * signature rather than trusting the cookie. If Supabase cannot be reached the
 * visitor is treated as signed out — never as the demo user.
 */
export async function updateSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: SessionUser | null }> {
  const { url, publishableKey } = requireSupabaseConfig()
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        // Responses that set auth cookies must not be cached and shared.
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value))
      },
    },
  })

  let user: SessionUser | null = null
  try {
    const { data } = await supabase.auth.getClaims()
    const claims = data?.claims
    if (claims?.sub) {
      user = sessionUserFromSupabase({
        id: claims.sub,
        email: claims.email,
        app_metadata: claims.app_metadata,
        user_metadata: claims.user_metadata,
      })
    }
  } catch (error) {
    console.error('[auth] Could not verify the Supabase session; treating the visitor as signed out.', error)
  }

  return { response, user }
}

/** Copy auth cookies and no-cache headers from the session response onto a redirect. */
export function withSessionCookies(target: NextResponse, source: NextResponse): NextResponse {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie))
  const cacheControl = source.headers.get('cache-control')
  if (cacheControl) target.headers.set('cache-control', cacheControl)
  return target
}
