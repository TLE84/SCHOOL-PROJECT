'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { authenticateDemoUser } from './demo-users';
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

export async function signOut(): Promise<void> {
  await destroySession();
  revalidatePath('/', 'layout');
  redirect('/login');
}
