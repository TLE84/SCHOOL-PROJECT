import { isUserRole, type UserRole } from './roles';
import type { SessionUser } from './session';

/**
 * Map a Supabase Auth user (from `getUser()`) or verified JWT claims (from
 * `getClaims()`) onto the app's `SessionUser`.
 *
 * The role comes ONLY from `app_metadata`, which users cannot change
 * themselves — it is set server-side at sign-up (student or lecturer) or by
 * `npm run auth:set-role` (admin). `user_metadata` is user-editable, so it is
 * used for display details like the name, never for access decisions.
 */

interface SupabaseIdentity {
  id: string;
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}

export function roleFromAppMetadata(appMetadata: SupabaseIdentity['app_metadata']): UserRole {
  const role = appMetadata?.role;
  return isUserRole(role) ? role : 'student';
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function sessionUserFromSupabase(user: SupabaseIdentity): SessionUser {
  const email = user.email ?? '';
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email,
    name: text(meta.full_name) ?? text(meta.name) ?? email.split('@')[0] ?? 'Member',
    role: roleFromAppMetadata(user.app_metadata),
    jobTitle: text(user.app_metadata?.job_title),
    department: text(meta.department),
  };
}
