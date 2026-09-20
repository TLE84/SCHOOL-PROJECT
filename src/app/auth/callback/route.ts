import type { NextRequest } from 'next/server'
import { handleEmailLink } from '@/lib/auth/email-link'

/**
 * Alias of /auth/confirm.
 *
 * `/auth/callback` is the path most Supabase examples use, so it is the one
 * likely to be sitting in a project's Redirect URLs list. Accepting both means
 * a stale entry lands on a working page instead of a 404.
 */
export async function GET(request: NextRequest) {
  return handleEmailLink(request)
}
