/**
 * Hardcoded demo accounts.
 *
 * These exist so the demo can be signed into without a live auth provider.
 * Passwords are stored in plain text on purpose — this is throwaway demo data,
 * NOT a real credential store. When Supabase/database auth is wired in, this
 * file and the helpers in `src/lib/auth` are what get replaced.
 */

export type UserRole = 'admin' | 'lecturer' | 'student';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  /** Plain text — demo only. */
  password: string;
  role: UserRole;
  jobTitle?: string;
  department?: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: 'user-admin',
    name: 'Iyango Dorcas',
    email: 'admin@pti.edu.ng',
    password: 'admin123',
    role: 'admin',
    jobTitle: 'News Administrator',
  },
  {
    id: 'user-lecturer-onoji',
    name: 'Dr. Samuel E. Onoji',
    email: 'lecturer@pti.edu.ng',
    password: 'lecturer123',
    role: 'lecturer',
    jobTitle: 'Senior Lecturer',
    department: 'Petroleum Engineering and Geosciences',
  },
  {
    id: 'user-lecturer-okafor',
    name: 'Dr. Amaka Okafor',
    email: 'amaka.okafor@pti.edu.ng',
    password: 'lecturer123',
    role: 'lecturer',
    jobTitle: 'Lecturer',
    department: 'Computer Science and Information Technology',
  },
  {
    id: 'user-student-kenneth',
    name: 'Kenneth Awhawbera',
    email: 'student@pti.edu.ng',
    password: 'student123',
    role: 'student',
    department: 'Computer Science and Information Technology',
  },
  {
    id: 'user-student-blessing',
    name: 'Blessing Okowa',
    email: 'blessing.okowa@pti.edu.ng',
    password: 'student123',
    role: 'student',
    department: 'Welding Engineering and Offshore Technology',
  },
];

/** Case-insensitive credential check against the demo accounts. */
export function authenticateDemoUser(email: string, password: string): DemoUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    demoUsers.find((user) => user.email.toLowerCase() === normalized && user.password === password) ??
    null
  );
}

export function findDemoUserById(id: string): DemoUser | null {
  return demoUsers.find((user) => user.id === id) ?? null;
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  lecturer: 'Lecturer',
  student: 'Student',
};
