import { findDemoUserById, type UserRole } from './demo-users';

/**
 * Edge-safe session helpers.
 *
 * This module is imported by both the middleware (edge runtime) and server
 * actions, so it must not import `next/headers`. It only knows how to turn a
 * raw cookie value into a resolved user. Cookie reading/writing lives in
 * `server.ts`.
 *
 * The session cookie simply holds the demo user's id. This is deliberately
 * unsigned demo plumbing — good enough to gate the demo, not a real session
 * mechanism. Proper signed sessions arrive with the real auth work.
 */

export const SESSION_COOKIE = 'pti_demo_session';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jobTitle?: string;
  department?: string;
}

export function decodeSession(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  const user = findDemoUserById(token);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    jobTitle: user.jobTitle,
    department: user.department,
  };
}

/** Where a user lands after signing in, based on their role. */
export function homePathForRole(role: UserRole): string {
  return role === 'admin' ? '/admin' : '/portal';
}
