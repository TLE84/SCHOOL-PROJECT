import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './config'

/**
 * Supabase client with the service role key: bypasses RLS and can manage
 * users. Server-only — the `server-only` import makes the build fail if this
 * module is ever pulled into a Client Component, so the key cannot leak into
 * the browser bundle. Never pass it a user-supplied query without checking the
 * caller is allowed to run it.
 *
 * Returns null when the key is not configured, so callers can degrade
 * gracefully (e.g. the admin Users page) instead of crashing.
 */
export function createAdminClient(): SupabaseClient | null {
  const config = getSupabaseConfig()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!config || !serviceKey) return null

  return createClient(config.url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
