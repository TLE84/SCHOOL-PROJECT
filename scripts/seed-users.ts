/**
 * Create the standard Supabase accounts: 1 admin, 2 lecturers, 2 students.
 *
 *   npm run auth:seed-users                       # create any that are missing
 *   npm run auth:seed-users -- --reset-passwords  # also issue new passwords for existing ones
 *
 * The people (names, emails, roles, departments) mirror the demo accounts in
 * src/lib/auth/demo-users.ts, but NOT their passwords: those were public on
 * the demo login page. Each account gets a freshly generated password, printed
 * once here and never stored in the repo. Accounts are created already
 * confirmed, so no emails are sent.
 *
 * If `npm run db:seed` already created a byline-only profile for someone who
 * now has an account (e.g. Iyango Dorcas), their articles move to the account
 * and the duplicate profile is removed, so each person is one user.
 */
import { randomInt } from 'node:crypto';
import type { User } from '@supabase/supabase-js';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '../src/db';
import { articles, users } from '../src/db/schema';
import { demoUsers } from '../src/lib/auth/demo-users';
import { syncProfile } from '../src/lib/auth/profile';
import { sessionUserFromSupabase } from '../src/lib/auth/supabase-user';
import { createScriptAdminClient } from './supabase-admin';

/**
 * Credit articles from byline-only profiles (no role, no account) with this
 * person's name to their account, then delete those duplicate profiles.
 * Returns how many articles moved.
 *
 * Not a transaction (the pooler client cannot run one — see src/db/index.ts),
 * but safe without: the articles move first, and the foreign key refuses the
 * delete while anything still references a byline, so a failure part-way
 * leaves valid data that a re-run finishes.
 */
async function adoptBylines(accountId: string, name: string): Promise<number> {
  if (!isDatabaseConfigured()) return 0;

  const db = getDb();
  const bylines = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.name, name), isNull(users.role)));
  if (bylines.length === 0) return 0;

  const bylineIds = bylines.map((byline) => byline.id);
  const moved = await db
    .update(articles)
    .set({ authorId: accountId })
    .where(inArray(articles.authorId, bylineIds))
    .returning({ id: articles.id });
  await db.delete(users).where(inArray(users.id, bylineIds));
  return moved.length;
}

// No 0/o/1/l/i, so passwords can be read aloud or retyped without mistakes.
const ALPHABET = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** e.g. "Xk7m-Qp3v-Hn8t-Wd2c" — 16 random characters, ~90 bits. */
function generatePassword(): string {
  return Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join(''),
  ).join('-');
}

async function main() {
  const resetPasswords = process.argv.includes('--reset-passwords');
  const admin = createScriptAdminClient();

  const { data: existing, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;
  const byEmail = new Map(existing.users.map((user) => [user.email?.toLowerCase(), user]));

  const rows: { role: string; name: string; email: string; password: string }[] = [];

  for (const person of demoUsers) {
    const app_metadata = { role: person.role, ...(person.jobTitle && { job_title: person.jobTitle }) };
    const user_metadata = { full_name: person.name, ...(person.department && { department: person.department }) };
    const current = byEmail.get(person.email.toLowerCase());

    let account: User;
    let password = '(unchanged — run with --reset-passwords for a new one)';

    if (!current) {
      password = generatePassword();
      const { data, error } = await admin.auth.admin.createUser({
        email: person.email,
        password,
        email_confirm: true,
        app_metadata,
        user_metadata,
      });
      if (error) throw new Error(`${person.email}: ${error.message}`);
      account = data.user;
    } else {
      if (resetPasswords) password = generatePassword();
      const { data, error } = await admin.auth.admin.updateUserById(current.id, {
        app_metadata: { ...current.app_metadata, ...app_metadata },
        user_metadata: { ...current.user_metadata, ...user_metadata },
        ...(resetPasswords && { password }),
      });
      if (error) throw new Error(`${person.email}: ${error.message}`);
      account = data.user;
    }

    // Profile row, so lecturers and the admin show up as article authors.
    await syncProfile(sessionUserFromSupabase(account));
    const moved = await adoptBylines(account.id, person.name);
    if (moved > 0) console.log(`${person.name}: ${moved} article(s) moved from a duplicate byline profile.`);
    rows.push({ role: person.role, name: person.name, email: person.email, password });
  }

  console.log('\nSupabase accounts:\n');
  console.table(rows);
  console.log('Store these somewhere safe — the passwords are not saved anywhere else.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Seeding users failed:', error);
  process.exit(1);
});
