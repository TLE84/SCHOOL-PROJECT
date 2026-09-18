'use server'

import { subscribeEmail } from '@/lib/content/newsletter'

export interface NewsletterState {
  status: 'idle' | 'success' | 'error'
  message: string
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim()

  if (!EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  let alreadySubscribed: boolean
  try {
    ;({ alreadySubscribed } = await subscribeEmail(email))
  } catch (error) {
    console.error('[newsletter] Subscription failed', error)
    return { status: 'error', message: 'We couldn’t save your subscription just now. Please try again shortly.' }
  }

  return {
    status: 'success',
    message: alreadySubscribed
      ? 'You’re already on the list — thanks for staying subscribed!'
      : 'Thanks! You’re subscribed to PTI News updates.',
  }
}
