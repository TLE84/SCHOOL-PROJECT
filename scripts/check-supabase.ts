/**
 * Verify the Supabase environment in .env.local without printing any secrets.
 *
 *   npm run supabase:check
 *
 * Checks that each variable is present and actually works: the database URL
 * connects (and is the pooler, which Vercel needs), migrations have been
 * applied, the publishable key reaches Supabase Auth, the service role key has
 * admin access, and RLS stops the public Data API from reading app tables.
 */
import postgres from 'postgres';

const env = process.env;
const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY;
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');

let failures = 0;
const pass = (message: string) => console.log(`  ✔ ${message}`);
const fail = (message: string) => {
  failures++;
  console.log(`  ✘ ${message}`);
};
const warn = (message: string) => console.log(`  ! ${message}`);

async function checkDatabase() {
  console.log('Database (DATABASE_URL)');
  if (!env.DATABASE_URL) return fail('not set — the site will serve built-in seed content');

  let url: URL;
  try {
    url = new URL(env.DATABASE_URL);
  } catch {
    return fail('not a valid URL (special characters in the password must be URL-encoded)');
  }

  if (url.hostname.endsWith('.pooler.supabase.com') && url.port === '6543') {
    pass(`transaction pooler: ${url.username}@${url.host}`);
  } else if (/^db\.[a-z0-9]+\.supabase\.co$/.test(url.hostname)) {
    fail('direct connection host — IPv6-only, so Vercel cannot reach it. Use the Transaction pooler URI (port 6543).');
  } else {
    warn(`not a Supabase transaction pooler URL (${url.host}); fine for local Postgres`);
  }

  const sql = postgres(env.DATABASE_URL, { prepare: false, max: 1, ssl: 'require', connect_timeout: 15 });
  try {
    const started = Date.now();
    await sql`select 1`;
    pass(`connects (${Date.now() - started} ms)`);

    const [{ migrations }] = await sql`select count(*)::int as migrations from drizzle.__drizzle_migrations`.catch(
      () => [{ migrations: 0 }],
    );
    if (migrations > 0) pass(`${migrations} migration(s) applied`);
    else fail('no migrations applied — run `npm run db:migrate`');

    const [{ articles }] = await sql`select count(*)::int as articles from public.articles`.catch(() => [
      { articles: -1 },
    ]);
    if (articles > 0) pass(`${articles} articles`);
    else if (articles === 0) warn('no articles yet — run `npm run db:seed` to load the built-in content');

    const unprotected = await sql`
      select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`;
    if (unprotected.length === 0) pass('row-level security enabled on every public table');
    else fail(`RLS disabled on: ${unprotected.map((row) => row.relname).join(', ')}`);
  } catch (error) {
    fail(`cannot connect: ${(error as Error).message}`);
  } finally {
    await sql.end({ timeout: 1 });
  }
}

async function checkSupabase() {
  console.log('Supabase API');
  if (!supabaseUrl || !publishableKey) {
    return fail('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY not set — auth falls back to demo accounts');
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: publishableKey } });
    if (!res.ok) return fail(`publishable key rejected by Supabase Auth (HTTP ${res.status})`);
    const settings = await res.json();
    pass(`publishable key reaches Supabase Auth at ${new URL(supabaseUrl).host}`);
    if (!settings.external?.email) fail('email sign-in is disabled in Supabase Auth → Providers');
    if (settings.disable_signup) warn('sign-ups are disabled in Supabase Auth');
    if (!settings.mailer_autoconfirm) {
      warn('email confirmation is ON — new accounts must click the emailed link (Supabase’s built-in mailer allows only a few emails an hour)');
    }
  } catch (error) {
    return fail(`cannot reach ${supabaseUrl}: ${(error as Error).message}`);
  }

  // The publishable key ships to browsers, so the Data API must not expose app tables.
  const rest = await fetch(`${supabaseUrl}/rest/v1/articles?select=id&limit=1`, {
    headers: { apikey: publishableKey },
  });
  const body = rest.ok ? await rest.json() : null;
  if (Array.isArray(body) && body.length === 0) pass('public Data API cannot read app tables (RLS)');
  else if (Array.isArray(body)) fail('public Data API can read the articles table — enable RLS');
  else pass(`public Data API blocked (HTTP ${rest.status})`);

  console.log('Service role key (SUPABASE_SERVICE_ROLE_KEY)');
  if (!serviceKey) return fail('not set — sign-up roles and the admin Users page need it');
  const admin = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (admin.ok) pass('has admin access to Supabase Auth');
  else fail(`rejected (HTTP ${admin.status}) — is it this project's service_role / secret key?`);
}

async function main() {
  await checkDatabase();
  await checkSupabase();
  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
