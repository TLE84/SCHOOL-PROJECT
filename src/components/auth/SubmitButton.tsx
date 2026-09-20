'use client'

import { useFormStatus } from 'react-dom'
import { LoaderCircle } from 'lucide-react'

interface SubmitButtonProps {
  /** The server action to run; passed through to the button's `formAction`. */
  formAction: (formData: FormData) => void | Promise<void>
  /** Label while idle, e.g. "Sign In". */
  children: React.ReactNode
  /** Label while the request is in flight, e.g. "Signing in…". */
  pendingLabel: string
  /** `block` fills the form (auth pages); `inline` hugs its label (settings). */
  variant?: 'block' | 'inline'
}

/**
 * Submit button for the auth forms that shows progress and blocks repeat
 * submissions. `useFormStatus` reports on the enclosing <form>, so the button
 * stays disabled from the first click until the server action finishes —
 * including the redirect after a successful sign-in. A disabled default button
 * also stops Enter in a field from resubmitting.
 */
export function SubmitButton({
  formAction,
  children,
  pendingLabel,
  variant = 'block',
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      formAction={formAction}
      disabled={pending}
      aria-busy={pending}
      className={`flex items-center justify-center gap-2 rounded-lg bg-green-700 font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-700/70 ${
        variant === 'block' ? 'mt-2 w-full py-2.5' : 'self-start px-5 py-2.5 text-sm'
      }`}
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  )
}
