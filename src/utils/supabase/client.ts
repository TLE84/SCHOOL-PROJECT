import { createBrowserClient } from '@supabase/ssr'
import { requireSupabaseConfig } from './config'

/** Supabase client for Client Components (publishable key only — never the secret). */
export function createClient() {
  const { url, publishableKey } = requireSupabaseConfig()
  return createBrowserClient(url, publishableKey)
}
