'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getDepartments } from '@/lib/content/queries';
import { createAdminClient } from '@/utils/supabase/admin';
import { isSupabaseAuthEnabled } from '@/utils/supabase/config';
import { createClient } from '@/utils/supabase/server';
import { authenticateDemoUser, findDemoUserById, updateDemoUser } from './demo-users';
import { trySyncProfile } from './profile';
import { createDemoSession, getSessionUser } from './server';
import { sessionUserFromSupabase } from './supabase-user';
import type { SessionUser } from './session';

/**
 * Profile settings a signed-in person can change themselves.
 *
 * Name and department live in Supabase `user_metadata`, which the account may
 * edit. Job title lives in `app_metadata`, which it may not — so that update
 * goes through the service role key, and only for staff editing their own
 * account. Roles are never editable here: that is `npm run auth:set-role`.
 */

const MIN_PASSWORD_LENGTH = 6;

/** Only same-site paths, so a crafted form cannot bounce someone off-site. */
function safeRedirect(value: FormDataEntryValue | null): string {
  const path = String(value ?? '');
  return path.startsWith('/') && !path.startsWith('//') ? path : '/portal/settings';
}

async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  return user;
}

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireUser();
  const back = safeRedirect(formData.get('redirectTo'));
  const name = String(formData.get('name') ?? '').trim();
  const department = String(formData.get('department') ?? '').trim();
  // Students cannot give themselves a job title; the field is staff-only.
  const jobTitle = user.role === 'student' ? undefined : String(formData.get('jobTitle') ?? '').trim();

  if (!name) {
    redirect(`${back}?error=name`);
  }
  if (department && !(await isKnownDepartment(department))) {
    redirect(`${back}?error=department`);
  }

  if (isSupabaseAuthEnabled()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: name, department: department || null },
    });
    if (error || !data.user) {
      console.error('[profile] Could not save profile details', error);
      redirect(`${back}?error=failed`);
    }

    let updated = data.user;
    if (jobTitle !== undefined) {
      const admin = createAdminClient();
      if (admin) {
        const { data: staff, error: staffError } = await admin.auth.admin.updateUserById(user.id, {
          app_metadata: { ...updated.app_metadata, job_title: jobTitle || null },
        });
        if (staffError) console.error('[profile] Could not save the job title', staffError);
        else if (staff.user) updated = staff.user;
      }
    }

    await trySyncProfile(sessionUserFromSupabase(updated));
  } else {
    const demoUser = updateDemoUser(user.id, { name, department, jobTitle });
    if (!demoUser) {
      redirect(`${back}?error=failed`);
    }
    // The demo session cookie carries the profile, so re-issue it.
    await createDemoSession(demoUser);
  }

  revalidatePath('/', 'layout');
  redirect(`${back}?updated=profile`);
}

export async function updatePassword(formData: FormData): Promise<void> {
  const user = await requireUser();
  const back = safeRedirect(formData.get('redirectTo'));
  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    redirect(`${back}?error=pw-weak`);
  }
  if (newPassword !== confirmPassword) {
    redirect(`${back}?error=pw-mismatch`);
  }

  if (isSupabaseAuthEnabled()) {
    const supabase = await createClient();
    // Confirm it is really them: a stolen session alone must not be enough to
    // take over the account by changing its password.
    const { error: currentError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (currentError) {
      redirect(`${back}?error=pw-current`);
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error('[profile] Could not change the password', error);
      redirect(`${back}?error=${error.code === 'same_password' ? 'pw-same' : 'pw-failed'}`);
    }
  } else {
    if (!authenticateDemoUser(user.email, currentPassword)) {
      redirect(`${back}?error=pw-current`);
    }
    if (!findDemoUserById(user.id) || !updateDemoUser(user.id, { password: newPassword })) {
      redirect(`${back}?error=pw-failed`);
    }
  }

  redirect(`${back}?updated=password`);
}

async function isKnownDepartment(name: string): Promise<boolean> {
  const departments = await getDepartments();
  return departments.some((department) => department.name === name);
}
