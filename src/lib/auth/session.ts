import { findDemoUserById, type UserRole } from './demo-users';

/**
 * Edge-safe session helpers.
 *
 * This module is imported by both the middleware (edge runtime) and server
 * actions, so it must not import `next/headers`. Cookie reading/writing lives
 * in `server.ts`.
 *
 * The session cookie is self-contained: it holds the signed-in user's details
 * encoded as base64url JSON. That matters because a newly registered user
 * (from the sign-up form) only exists in the Node server's memory and would not
 * be visible to the edge middleware — carrying the payload in the cookie means
 * the middleware can resolve the session without any lookup. This is
 * deliberately unsigned demo plumbing, not a real session mechanism; proper
 * signed sessions arrive with the real auth work.
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

const ROLES: UserRole[] = ['admin', 'lecturer', 'student'];

export function encodeSession(user: SessionUser): string {
  return toBase64Url(JSON.stringify(user));
}

export function decodeSession(token: string | undefined | null): SessionUser | null {
  if (!token) return null;

  // Primary path: the self-contained payload cookie.
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as Partial<SessionUser>;
    if (
      parsed &&
      typeof parsed.id === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.email === 'string' &&
      typeof parsed.role === 'string' &&
      ROLES.includes(parsed.role as UserRole)
    ) {
      return parsed as SessionUser;
    }
  } catch {
    // Not a payload cookie — fall through to the legacy id lookup.
  }

  // Legacy path: cookie held a bare hardcoded-user id.
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

// --- base64url helpers, UTF-8 safe, available in both edge and Node runtimes ---

function toBase64Url(input: string): string {
  const binary = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const percentEncoded = Array.from(binary)
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
    .join('');
  return decodeURIComponent(percentEncoded);
}
