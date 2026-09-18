import { getDb, isDatabaseConfigured } from '@/db';
import { sql } from 'drizzle-orm';

/**
 * Chooses between the database and the hardcoded seed data.
 *
 * - No `DATABASE_URL` → seed data, always (zero-config demo).
 * - `DATABASE_URL` set → the database, falling back to seed data for any call
 *   that fails so a page still renders.
 *
 * When the failure means the database itself is unavailable (unreachable, bad
 * credentials, migrations not applied), a short circuit breaker serves seed
 * data for the next 30 seconds instead of making every query on every page
 * wait out its own connection timeout.
 *
 * Writes never fall back: in database mode they go to the database or fail
 * loudly (see `assertDatabaseWritable`), because quietly writing to in-memory
 * state on a serverless host would lose the data.
 */

const RETRY_AFTER_MS = 30_000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Database rows have UUID ids; seed records have ids like `art-…`. */
export function isUuid(value: string): boolean {
  return UUID.test(value);
}

interface Failure {
  at: string;
  message: string;
}

let unavailableUntil = 0;
let lastFailure: Failure | null = null;

function breakerOpen(): boolean {
  return Date.now() < unavailableUntil;
}

export async function readWithFallback<T>(
  label: string,
  fromDatabase: () => Promise<T>,
  fromSeed: () => T | Promise<T>,
): Promise<T> {
  if (!isDatabaseConfigured() || breakerOpen()) return fromSeed();

  try {
    return await fromDatabase();
  } catch (error) {
    const unavailable = isUnavailableError(error);
    const message = describeError(error);
    lastFailure = { at: new Date().toISOString(), message };
    if (unavailable) {
      unavailableUntil = Date.now() + RETRY_AFTER_MS;
      // An outage: the cause is what matters, not the (very long) SQL.
      console.error(`[content] ${label}: database unavailable (${message}); serving seed data for 30s.`);
    } else {
      // Unexpected — keep the full error and stack for debugging.
      console.error(`[content] ${label} failed; serving seed data.`, error);
    }
    return fromSeed();
  }
}

export class DatabaseUnavailableError extends Error {
  constructor() {
    super('The database is temporarily unavailable. Please try again in a moment.');
    this.name = 'DatabaseUnavailableError';
  }
}

/** Refuse a write up front while the breaker is open, rather than timing out again. */
export function assertDatabaseWritable(): void {
  if (breakerOpen()) throw new DatabaseUnavailableError();
}

export interface DatabaseStatus {
  configured: boolean;
  reachable: boolean | null;
  latencyMs: number | null;
  error: string | null;
  /** The most recent failed read, if any, since this server instance started. */
  lastFailure: Failure | null;
}

/** Live check for the admin settings page: can we run a query right now? */
export async function checkDatabase(): Promise<DatabaseStatus> {
  if (!isDatabaseConfigured()) {
    return { configured: false, reachable: null, latencyMs: null, error: null, lastFailure };
  }
  const started = Date.now();
  try {
    await getDb().execute(sql`select 1 from ${sql.identifier('articles')} limit 1`);
    unavailableUntil = 0;
    return { configured: true, reachable: true, latencyMs: Date.now() - started, error: null, lastFailure };
  } catch (error) {
    return { configured: true, reachable: false, latencyMs: null, error: describeError(error), lastFailure };
  }
}

// --- error classification ---

/** Driver-level codes from postgres.js / Node sockets that mean "can't reach it". */
const UNAVAILABLE_CODES = new Set([
  'CONNECT_TIMEOUT',
  'CONNECTION_CLOSED',
  'CONNECTION_ENDED',
  'CONNECTION_DESTROYED',
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
]);

/**
 * SQLSTATEs that mean the database as a whole is unusable, not that one query
 * was wrong: connection exceptions (08xxx), shutdowns (57P0x), too many
 * connections, bad credentials or database name, a pooler-side error (XX000,
 * e.g. Supabase's "tenant not found"), and tables that do not exist yet
 * because migrations have not been run.
 */
function isUnavailableSqlState(code: string): boolean {
  return (
    code.startsWith('08') ||
    code.startsWith('57P') ||
    ['53300', '28P01', '28000', '3D000', 'XX000', '42P01'].includes(code)
  );
}

function isUnavailableError(error: unknown): boolean {
  for (let current = error; current; current = (current as { cause?: unknown }).cause) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === 'string' && (UNAVAILABLE_CODES.has(code) || isUnavailableSqlState(code))) {
      return true;
    }
  }
  return false;
}

/** The innermost message — Drizzle wraps the driver error, which is the useful part. */
function describeError(error: unknown): string {
  let current = error as { message?: string; cause?: unknown; code?: string } | undefined;
  while (current?.cause) current = current.cause as typeof current;
  const code = current?.code ? `${current.code}: ` : '';
  return `${code}${current?.message ?? String(error)}`;
}
