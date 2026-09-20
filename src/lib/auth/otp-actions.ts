'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { siteUrl } from '@/lib/site';
import { isSupabaseAuthEnabled } from '@/utils/supabase/config';
import { createClient } from '@/utils/supabase/server';
import { trySyncProfile } from './profile';
import { homePathForRole } from './session';
import { sessionUserFromSupabase } from './supabase-user';

/**
 * Email confirmation by one-time code.
 *
 * Sign-up emails a numeric code (Supabase's "Confirm signup" template must
 * include `{{ .Token }}`) and the person types it in at /verify. No link to
 * click, so nothing depends on redirect URLs or on opening the email in the
 * same browser. Supabase decides the length — 6 or 8 digits.
 *
 * The link-based route (src/app/auth/confirm) still works for any older email
 * already in an inbox.
 */

/** Supabase issues 6- or 8-digit codes; accept either, ignoring spaces. */
const CODE_PATTERN = /^\d{6,10}$/;

function verifyPath(email: string, params: Record<string, string> = {}): string {
  const query = new URLSearchParams({ email, ...params });
  return `/verify?${query.toString()}`;
}

export async function verifyEmailCode(formData: FormData): Promise<void> {
  if (!isSupabaseAuthEnabled()) redirect('/login');

  const email = String(formData.get('email') ?? '').trim();
  const code = String(formData.get('code') ?? '').replace(/\s/g, '');

  if (!email) {
    redirect('/signup?error=missing');
  }
  if (!CODE_PATTERN.test(code)) {
    redirect(verifyPath(email, { error: 'invalid' }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' });

  if (error || !data.user) {
    // Supabase reports a wrong code and an expired one the same way; say both.
    redirect(verifyPath(email, { error: error?.code === 'over_request_rate_limit' ? 'rate' : 'invalid' }));
  }

  const user = sessionUserFromSupabase(data.user);
  await trySyncProfile(user);
  revalidatePath('/', 'layout');
  redirect(homePathForRole(user.role));
}

export async function resendEmailCode(formData: FormData): Promise<void> {
  if (!isSupabaseAuthEnabled()) redirect('/login');

  const email = String(formData.get('email') ?? '').trim();
  if (!email) {
    redirect('/signup?error=missing');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    // Only used if the email template still offers a link as well.
    options: { emailRedirectTo: `${await requestOrigin()}/auth/confirm` },
  });

  if (error) {
    const rateLimited = error.code === 'over_email_send_rate_limit' || error.code === 'over_request_rate_limit';
    if (!rateLimited) console.error('[auth] Could not resend the confirmation code', error);
    redirect(verifyPath(email, { error: rateLimited ? 'rate' : 'resend' }));
  }

  redirect(verifyPath(email, { notice: 'sent' }));
}

async function requestOrigin(): Promise<string> {
  const origin = (await headers()).get('origin');
  return origin && /^https?:\/\//.test(origin) ? origin : siteUrl;
}
