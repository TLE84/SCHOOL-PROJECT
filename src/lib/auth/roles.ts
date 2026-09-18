/** Account roles, shared by the demo accounts and Supabase Auth. */

export type UserRole = 'admin' | 'lecturer' | 'student';

/** Roles a visitor may choose when signing up — administrators are never self-registered. */
export type SignupRole = Exclude<UserRole, 'admin'>;

export const USER_ROLES: readonly UserRole[] = ['admin', 'lecturer', 'student'];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  lecturer: 'Lecturer',
  student: 'Student',
};
