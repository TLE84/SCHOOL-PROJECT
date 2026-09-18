/**
 * Set a Supabase account's role.
 *
 *   npm run auth:set-role -- someone@pti.edu.ng admin
 *
 * Roles live in the account's `app_metadata`, which only the service role key
 * can change — this is the one way to create an administrator (sign-up only
 * offers student or lecturer). The person should sign out and back in for the
 * new role to reach their session everywhere.
 */
import { createClient } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '../src/db';
import { users } from '../src/db/schema';
import { isUserRole, USER_ROLES } from '../src/lib/auth/roles';

async function main() {
  const [email, role] = process.argv.slice(2);
  if (!email || !isUserRole(role)) {
    console.error(`Usage: npm run auth:set-role -- <email> <${USER_ROLES.join('|')}>`);
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local.');
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // No lookup-by-email in the admin API, so page through the accounts.
  const wanted = email.trim().toLowerCase();
  let account = null;
  for (let page = 1; !account; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    account = data.users.find((user) => user.email?.toLowerCase() === wanted) ?? null;
    if (data.users.length < 1000) break;
  }
  if (!account) {
    console.error(`No account found for ${email}. They need to sign up first.`);
    process.exit(1);
  }

  const { error } = await admin.auth.admin.updateUserById(account.id, {
    app_metadata: { ...account.app_metadata, role },
  });
  if (error) throw error;

  // Keep the mirrored profile row's display role in step, if there is one.
  if (isDatabaseConfigured()) {
    await getDb().update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, account.id));
  }

  const previous = account.app_metadata?.role ?? 'student (default)';
  console.log(`${account.email}: ${previous} → ${role}.`);
  if (!account.email_confirmed_at) {
    console.log('Note: this account has not confirmed its email yet, so it cannot sign in until it does.');
  }
  console.log('They should sign out and back in to pick up the new role.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Failed to set role:', error);
  process.exit(1);
});
