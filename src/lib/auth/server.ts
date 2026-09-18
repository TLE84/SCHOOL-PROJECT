import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isSupabaseAuthEnabled } from '@/utils/supabase/config';
import { createClient } from '@/utils/supabase/server';
import type { DemoUser } from './demo-users';
import { decodeSession, encodeSession, SESSION_COOKIE, type SessionUser } from './session';
import { sessionUserFromSupabase } from './supabase-user';

/**
 * Server-side session access (Server Components, Server Actions, Route Handlers).
 *
 * Kept separate from `session.ts` because this imports `next/headers`, which
 * the proxy cannot use.
 */

const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/**
 * The signed-in user, or null. Cached per request, so the navbar, page and
 * layout share one lookup.
 *
 * With Supabase configured this asks Supabase Auth (`getUser()` validates the
 * token with the auth server, so a revoked session or changed role is seen
 * immediately) and ignores the demo cookie entirely. Without Supabase it reads
 * the demo cookie.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  if (isSupabaseAuthEnabled()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      return sessionUserFromSupabase(data.user);
    } catch (error) {
      console.error('[auth] Supabase session lookup failed; treating the visitor as signed out.', error);
      return null;
    }
  }

  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
});

/**
 * For admin pages that fetch privileged data (e.g. with the service role key).
 * Layouts and pages render in parallel, so a page cannot rely on its layout's
 * redirect having run first — it checks for itself.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'admin') redirect('/portal');
  return user;
}

// --- demo-mode cookie (only used when Supabase Auth is not configured) ---

export async function createDemoSession(user: DemoUser): Promise<void> {
  const store = await cookies();
  const payload: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    jobTitle: user.jobTitle,
    department: user.department,
  };
  store.set(SESSION_COOKIE, encodeSession(payload), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function destroyDemoSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
