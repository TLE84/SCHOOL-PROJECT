/**
 * Supabase connection settings.
 *
 * Auth runs on Supabase when both the project URL and the publishable key are
 * present; otherwise the app falls back to the hardcoded demo accounts. The
 * publishable key is read from `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, or the
 * older `NEXT_PUBLIC_SUPABASE_ANON_KEY` name, so either dashboard naming works.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time: after changing them on
 * Vercel, redeploy for the change to take effect.
 */

export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && publishableKey ? { url, publishableKey } : null;
}

export function isSupabaseAuthEnabled(): boolean {
  return getSupabaseConfig() !== null;
}

export function requireSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  return config;
}
