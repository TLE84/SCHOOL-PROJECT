import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database handle.
 *
 * Nothing renders from here yet — pages read through `src/lib/content`, which
 * is seed-backed. This is the connection those queries will move onto.
 *
 * Deliberately lazy so importing this module never opens a socket, and
 * deliberately without a localhost default: a default turns a missing
 * DATABASE_URL in production into a confusing connection error rather than an
 * obvious configuration one.
 */
let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not set. Add it to the environment before using the database.',
      );
    }
    client = postgres(connectionString, { prepare: false });
  }

  return drizzle(client, { schema });
}
