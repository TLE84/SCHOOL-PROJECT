import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSupabaseConfig } from './config'

/**
 * Supabase client for Server Components, Server Actions and Route Handlers,
 * acting as the signed-in user (publishable key + their session cookies).
 */
export async function createClient() {
  const { url, publishableKey } = requireSupabaseConfig()
  const cookieStore = await cookies()

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component, which cannot set cookies. Safe to
          // ignore: the proxy refreshes sessions before pages render.
        }
      },
    },
  })
}
