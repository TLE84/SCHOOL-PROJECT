'use client'

import { useActionState } from 'react'
import { CheckCircle } from 'lucide-react'
import { subscribeToNewsletter, type NewsletterState } from '@/app/(site)/newsletter-actions'

const initialState: NewsletterState = { status: 'idle', message: '' }

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState)

  if (state.status === 'success') {
    return (
      <div
        className="relative z-10 flex items-center gap-3 rounded-xl bg-white/10 p-5 text-white"
        role="status"
      >
        <CheckCircle size={22} className="shrink-0 text-gold" aria-hidden="true" />
        <p className="text-base font-medium">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="relative z-10 flex flex-col gap-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        required
        className="w-full rounded-xl bg-white px-5 py-4 text-base font-medium text-slate-900 shadow-inner transition-all focus:outline-none focus:ring-4 focus:ring-green-500/50"
      />
      {state.status === 'error' && (
        <p className="text-sm font-semibold text-gold" role="alert">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-gold px-6 py-4 text-base font-black uppercase tracking-wider text-slate-900 shadow-md transition-all hover:-translate-y-1 hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  )
}
