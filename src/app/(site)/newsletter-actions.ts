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

  const { alreadySubscribed } = subscribeEmail(email)
  return {
    status: 'success',
    message: alreadySubscribed
      ? 'You’re already on the list — thanks for staying subscribed!'
      : 'Thanks! You’re subscribed to PTI News updates.',
  }
}
