import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client for the CLI scripts in this folder.
 *
 * supabase-js builds its Realtime client up front and throws on Node < 22,
 * which has no global WebSocket. These scripts never use Realtime, so on older
 * Node they get a placeholder transport that only errors if something actually
 * tries to open a socket. On Node 22+ the native WebSocket is used as normal.
 */
class RealtimeUnavailable {
  constructor() {
    throw new Error('Realtime is not available in CLI scripts (needs Node.js 22+).');
  }
}

export function createScriptAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local.');
    process.exit(1);
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    ...(typeof globalThis.WebSocket === 'undefined' && {
      realtime: { transport: RealtimeUnavailable as unknown as typeof WebSocket },
    }),
  });
}
