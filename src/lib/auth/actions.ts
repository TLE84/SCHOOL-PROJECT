'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { authenticateDemoUser, findDemoUserByEmail, registerDemoUser } from './demo-users';
import { createSession, destroySession } from './server';
import { homePathForRole } from './session';

/**
 * Shared sign-in action for both the portal (`/login`) and admin
 * (`/admin/login`) forms. The hidden `origin` field decides which login page
 * to bounce back to on failure; on success the user is routed by role.
 */
export async function signIn(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const origin = String(formData.get('origin') ?? 'portal');

  const user = authenticateDemoUser(email, password);

  if (!user) {
    redirect(origin === 'admin' ? '/admin/login?error=1' : '/login?error=1');
  }

  await createSession(user);
  revalidatePath('/', 'layout');
  redirect(homePathForRole(user.role));
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Register a new demo account (name, email, password) and sign the person in
 * immediately by creating their demo session. New accounts are students.
 */
export async function signUp(formData: FormData): Promise<void> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!name || !email || !password) {
    redirect('/signup?error=missing');
  }
  if (!EMAIL_PATTERN.test(email)) {
    redirect('/signup?error=email');
  }
  if (password.length < 6) {
    redirect('/signup?error=password');
  }
  if (findDemoUserByEmail(email)) {
    redirect('/signup?error=exists');
  }

  const user = registerDemoUser({ name, email, password });
  await createSession(user);
  revalidatePath('/', 'layout');
  redirect(homePathForRole(user.role));
}

export async function signOut(): Promise<void> {
  await destroySession();
  revalidatePath('/', 'layout');
  redirect('/login');
}
