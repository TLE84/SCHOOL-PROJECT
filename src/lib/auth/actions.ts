'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isSupabaseAuthEnabled } from '@/utils/supabase/config';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { siteUrl } from '@/lib/site';
import { getDepartments } from '@/lib/content/queries';
import { authenticateDemoUser, findDemoUserByEmail, registerDemoUser } from './demo-users';
import { createDemoSession, destroyDemoSession } from './server';
import { homePathForRole } from './session';
import { sessionUserFromSupabase } from './supabase-user';
import { trySyncProfile } from './profile';
import type { SignupRole } from './roles';

/**
 * Sign-in, sign-up and sign-out for both auth backends: Supabase Auth when it
 * is configured, the hardcoded demo accounts otherwise.
 */

function loginPath(origin: string, error: string): string {
  return `${origin === 'admin' ? '/admin/login' : '/login'}?error=${error}`;
}

/**
 * Shared sign-in action for both the portal (`/login`) and admin
 * (`/admin/login`) forms. The hidden `origin` field decides which login page
 * to bounce back to on failure; on success the user is routed by role.
 */
export async function signIn(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const origin = String(formData.get('origin') ?? 'portal');

  if (isSupabaseAuthEnabled()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      redirect(loginPath(origin, error?.code === 'email_not_confirmed' ? 'unconfirmed' : 'credentials'));
    }

    const user = sessionUserFromSupabase(data.user);
    await trySyncProfile(user);
    revalidatePath('/', 'layout');
    redirect(homePathForRole(user.role));
  }

  const user = authenticateDemoUser(email, password);
  if (!user) {
    redirect(loginPath(origin, 'credentials'));
  }

  await createDemoSession(user);
  revalidatePath('/', 'layout');
  redirect(homePathForRole(user.role));
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Supabase Auth error codes → the `?error=` keys the sign-up form explains. */
const SIGNUP_ERRORS: Record<string, string> = {
  user_already_exists: 'exists',
  email_exists: 'exists',
  weak_password: 'password',
  email_address_invalid: 'email',
  over_email_send_rate_limit: 'rate',
  over_request_rate_limit: 'rate',
  signup_disabled: 'disabled',
  // Supabase's built-in mailer only delivers to members of the project's
  // organisation; anyone else needs custom SMTP (or confirmation turned off).
  email_address_not_authorized: 'undeliverable',
};

/**
 * Register an account (name, email, password, student-or-lecturer role).
 *
 * Supabase: the account is created with Supabase Auth, and the chosen role is
 * written to `app_metadata` with the service role key — users can edit their
 * own `user_metadata` but not `app_metadata`, so nobody can grant themselves a
 * role later. If the project requires email confirmation (the default), the
 * person is asked to check their inbox; otherwise they are signed straight in.
 *
 * Demo: an in-memory account, signed in immediately.
 */
export async function signUp(formData: FormData): Promise<void> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const role = String(formData.get('role') ?? '');
  const department = String(formData.get('department') ?? '').trim();

  if (!name || !email || !password) {
    redirect('/signup?error=missing');
  }
  if (!EMAIL_PATTERN.test(email)) {
    redirect('/signup?error=email');
  }
  if (password.length < 6) {
    redirect('/signup?error=password');
  }
  if (role !== 'student' && role !== 'lecturer') {
    redirect('/signup?error=role');
  }
  if (!(await isKnownDepartment(department))) {
    redirect('/signup?error=department');
  }

  if (isSupabaseAuthEnabled()) {
    await signUpWithSupabase({ name, email, password, role, department });
    return;
  }

  if (findDemoUserByEmail(email)) {
    redirect('/signup?error=exists');
  }

  const user = registerDemoUser({ name, email, password, role: role as SignupRole, department });
  await createDemoSession(user);
  revalidatePath('/', 'layout');
  redirect(homePathForRole(user.role));
}

/** Only a department the site actually lists may be stored on a profile. */
async function isKnownDepartment(name: string): Promise<boolean> {
  if (!name) return false;
  const departments = await getDepartments();
  return departments.some((department) => department.name === name);
}

async function signUpWithSupabase(input: {
  name: string;
  email: string;
  password: string;
  role: SignupRole;
  department: string;
}): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.name, department: input.department },
      emailRedirectTo: `${await requestOrigin()}/auth/confirm`,
    },
  });

  if (error) {
    const key = (error.code && SIGNUP_ERRORS[error.code]) ?? 'unknown';
    if (key === 'unknown') console.error('[auth] Supabase sign-up failed', error);
    if (key === 'undeliverable') {
      console.error(
        '[auth] Supabase could not send the confirmation email. Configure custom SMTP (Auth → SMTP Settings) or turn off "Confirm email" (Auth → Providers → Email).',
      );
    }
    redirect(`/signup?error=${key}`);
  }

  // With email confirmation on, Supabase answers a sign-up for an existing
  // address with a user that has no identities (so it doesn't leak who has an
  // account). Don't touch that account.
  if (!data.user || data.user.identities?.length === 0) {
    redirect('/signup?error=exists');
  }

  const roleAssigned = await assignRole(data.user.id, input.role);

  if (data.session) {
    // Email confirmation is off: they are signed in already. Refresh so the
    // access token carries the role that was just assigned.
    if (roleAssigned) await supabase.auth.refreshSession();
    const user = sessionUserFromSupabase({
      ...data.user,
      app_metadata: { ...data.user.app_metadata, ...(roleAssigned && { role: input.role }) },
    });
    await trySyncProfile(user);
    revalidatePath('/', 'layout');
    redirect(homePathForRole(user.role));
  }

  redirect('/login?notice=check-email');
}

/** Set the account's role in `app_metadata` (service role only). */
async function assignRole(userId: string, role: SignupRole): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) {
    console.warn(
      '[auth] SUPABASE_SERVICE_ROLE_KEY is not set, so the chosen role was not saved; the account defaults to student.',
    );
    return false;
  }
  const { error } = await admin.auth.admin.updateUserById(userId, { app_metadata: { role } });
  if (error) {
    console.error('[auth] Could not save the new account role; it defaults to student.', error);
    return false;
  }
  return true;
}

/**
 * Where the confirmation email should send people back to: the deployment
 * they signed up on (so previews work), else the canonical site URL. Supabase
 * only honours URLs on its Redirect URLs allow-list, so this cannot be abused
 * to send confirmation links elsewhere.
 */
async function requestOrigin(): Promise<string> {
  const origin = (await headers()).get('origin');
  return origin && /^https?:\/\//.test(origin) ? origin : siteUrl;
}

export async function signOut(): Promise<void> {
  if (isSupabaseAuthEnabled()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  // Clear any leftover demo cookie too, whichever backend is active.
  await destroyDemoSession();
  revalidatePath('/', 'layout');
  redirect('/login');
}
