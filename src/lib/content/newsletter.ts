import { getDb, isDatabaseConfigured } from '@/db';
import { newsletterSubscribers } from '@/db/schema';
import { assertDatabaseWritable } from './source';

/**
 * Newsletter sign-ups.
 *
 * Stored in `newsletter_subscribers` when a database is configured. Without one
 * they live in memory for the life of the running server, like the rest of the
 * zero-config demo state. Emails are lower-cased so each address is stored once.
 */

const subscribers = new Set<string>();

export async function subscribeEmail(email: string): Promise<{ alreadySubscribed: boolean }> {
  const normalized = email.trim().toLowerCase();

  if (!isDatabaseConfigured()) {
    const alreadySubscribed = subscribers.has(normalized);
    subscribers.add(normalized);
    return { alreadySubscribed };
  }

  assertDatabaseWritable();
  const inserted = await getDb()
    .insert(newsletterSubscribers)
    .values({ email: normalized })
    .onConflictDoNothing({ target: newsletterSubscribers.email })
    .returning({ id: newsletterSubscribers.id });
  return { alreadySubscribed: inserted.length === 0 };
}
