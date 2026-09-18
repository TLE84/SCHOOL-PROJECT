import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database handle.
 *
 * `src/lib/content` reads through here when `DATABASE_URL` is set and falls
 * back to the hardcoded seed data when it is not (or when the database cannot
 * be reached), so the site still renders with no environment at all.
 *
 * Deliberately lazy so importing this module never opens a socket, and
 * deliberately without a localhost default: a default turns a missing
 * DATABASE_URL in production into a confusing connection error rather than an
 * obvious configuration one.
 *
 * On Supabase, use the transaction pooler URI (port 6543). The direct
 * `db.<ref>.supabase.co` host is IPv6-only, which Vercel cannot reach.
 */
let client: ReturnType<typeof postgres> | undefined;
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not set. Add it to the environment before using the database.',
      );
    }
    const options: postgres.Options<Record<string, never>> & { max_pipeline: number } = {
      // The transaction pooler does not support prepared statements.
      prepare: false,
      // A small pool per server instance. Pooler client connections are cheap
      // (Supavisor multiplexes them onto a few Postgres backends), and with
      // pipelining off (below) a single connection would make concurrent
      // requests on the same instance queue behind each other.
      max: 5,
      // postgres.js pipelines concurrent queries down one connection by
      // default. Supabase's transaction pooler (Supavisor) stalls on pipelined
      // queries until the 2-minute statement timeout, so any page that awaits
      // two reads with Promise.all would hang. 0 makes concurrent queries queue
      // for the connection instead. Undocumented (and untyped) but stable
      // since postgres.js 3.0 — see `max_pipeline` in its connection.js.
      //
      // Trade-off: this also stops postgres.js reserving a connection for
      // `sql.begin`, so `db.transaction()` fails with UNSAFE_TRANSACTION.
      // Nothing uses transactions today; order multi-step writes so each step
      // leaves valid data (foreign keys help), or reserve a connection.
      max_pipeline: 0,
      // Fail fast so an unreachable database falls back to seed content quickly
      // instead of holding the page for the driver's 30s default.
      connect_timeout: 10,
      idle_timeout: 20,
      ssl: requiresSsl(connectionString) ? 'require' : false,
    };
    client = postgres(connectionString, options);
    db = drizzle(client, { schema });
  }

  return db;
}

/** Remote databases get TLS; a local Postgres usually has none configured. */
function requiresSsl(connectionString: string): boolean {
  try {
    const { hostname, searchParams } = new URL(connectionString);
    if (searchParams.get('sslmode') === 'disable') return false;
    return !['localhost', '127.0.0.1', '::1'].includes(hostname);
  } catch {
    return true;
  }
}
