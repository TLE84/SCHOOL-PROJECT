import { signIn } from '@/lib/auth/actions'
import { SubmitButton } from './SubmitButton'

const errorMessages: Record<string, string> = {
  credentials: 'Incorrect email or password. Please try again.',
  unconfirmed: 'Please confirm your email address first — check your inbox for the link.',
  confirm: 'That confirmation link is invalid or has expired. Try signing in, or sign up again.',
}

const noticeMessages: Record<string, string> = {
  'check-email': 'Almost done — we’ve emailed you a confirmation link. Confirm your address, then sign in.',
  confirmed: 'Your email is confirmed. Sign in to continue.',
}

interface SignInFormProps {
  /** Which login page this is, so failures bounce back to the right place. */
  origin: 'admin' | 'portal'
  /** `?error=` key from a failed attempt. */
  error?: string
  /** `?notice=` key, e.g. after sign-up or email confirmation. */
  notice?: string
  /** Pre-fill the email field (used by the "use this login" demo buttons). */
  defaultEmail?: string
}

export function SignInForm({ origin, error, notice, defaultEmail }: SignInFormProps) {
  const errorMessage = error ? errorMessages[error] ?? errorMessages.credentials : null
  const noticeMessage = notice ? noticeMessages[notice] : null

  return (
    <form className="flex flex-col gap-5">
      <input type="hidden" name="origin" value={origin} />

      {errorMessage && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      {!errorMessage && noticeMessage && (
        <div role="status" className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {noticeMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-colors"
          placeholder="you@pti.edu.ng"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-colors"
        />
      </div>
      <SubmitButton formAction={signIn} pendingLabel="Signing in…">
        Sign In
      </SubmitButton>
    </form>
  )
}
