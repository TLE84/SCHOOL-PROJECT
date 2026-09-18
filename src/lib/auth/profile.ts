import { getDb, isDatabaseConfigured } from '@/db';
import { users } from '@/db/schema';
import type { SessionUser } from './session';

/**
 * Keep a `public.user` row in step with a signed-in account.
 *
 * Comments, reactions and article bylines reference `public.user`, but accounts
 * live in Supabase Auth — so each account gets a mirrored profile row (same
 * id), written when they sign in and before anything that references it. The
 * mirrored `role` is only used for display (e.g. comment badges); access checks
 * always use the verified session.
 */
export async function syncProfile(user: SessionUser): Promise<void> {
  if (!isDatabaseConfigured()) return;

  await getDb()
    .insert(users)
    .values({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: true,
      role: user.role,
      jobTitle: user.jobTitle,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.jobTitle && { jobTitle: user.jobTitle }),
        updatedAt: new Date(),
      },
    });
}

/** For sign-in paths: a database hiccup must never stop someone signing in. */
export async function trySyncProfile(user: SessionUser): Promise<void> {
  try {
    await syncProfile(user);
  } catch (error) {
    console.error('[auth] Could not sync the profile row; continuing without it.', error);
  }
}
