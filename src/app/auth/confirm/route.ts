import type { EmailOtpType, User } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { isSupabaseAuthEnabled } from '@/utils/supabase/config'
import { createClient } from '@/utils/supabase/server'
import { homePathForRole } from '@/lib/auth/session'
import { sessionUserFromSupabase } from '@/lib/auth/supabase-user'
import { trySyncProfile } from '@/lib/auth/profile'

/**
 * Landing point for Supabase email links (sign-up confirmation, and any other
 * email OTP such as a password reset). Handles both link styles:
 *
 *  - `?code=…` — Supabase's default "Confirm your signup" template. Supabase
 *    has already verified the address before redirecting here; the code just
 *    turns it into a session, which only works in the browser that signed up.
 *  - `?token_hash=…&type=…` — the server-side template Supabase recommends
 *    for SSR apps, which works from any browser.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!isSupabaseAuthEnabled() || searchParams.get('error')) {
    redirect('/login?error=confirm')
  }

  const supabase = await createClient()
  let user: User | null = null

  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) user = data.user
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    // The address is already confirmed by now; if the session can't be created
    // here (e.g. the link was opened in a different browser), they just sign in.
    if (error) redirect('/login?notice=confirmed')
    user = data.user
  }

  if (!user) {
    redirect('/login?error=confirm')
  }

  const sessionUser = sessionUserFromSupabase(user)
  await trySyncProfile(sessionUser)
  redirect(safeNext(searchParams.get('next')) ?? homePathForRole(sessionUser.role))
}

/** Only follow same-site relative paths, never `//evil.example` or absolute URLs. */
function safeNext(next: string | null): string | null {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : null
}
