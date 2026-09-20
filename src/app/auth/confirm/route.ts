import type { NextRequest } from 'next/server'
import { handleEmailLink } from '@/lib/auth/email-link'

/** Landing point for Supabase email links — see `src/lib/auth/email-link.ts`. */
export async function GET(request: NextRequest) {
  return handleEmailLink(request)
}
