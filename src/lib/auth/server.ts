import { cookies } from 'next/headers';
import type { DemoUser } from './demo-users';
import { decodeSession, encodeSession, SESSION_COOKIE, type SessionUser } from './session';

/**
 * Server-side session helpers (read/write the session cookie).
 *
 * Kept separate from `session.ts` because this imports `next/headers`, which
 * cannot run in the edge middleware.
 */

const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function createSession(user: DemoUser): Promise<void> {
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

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
