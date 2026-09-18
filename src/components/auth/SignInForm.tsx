import { signIn } from '@/lib/auth/actions'

interface SignInFormProps {
  /** Which login page this is, so failures bounce back to the right place. */
  origin: 'admin' | 'portal'
  error?: boolean
  /** Pre-fill the email field (used by the "use this login" demo buttons). */
  defaultEmail?: string
}

export function SignInForm({ origin, error, defaultEmail }: SignInFormProps) {
  return (
    <form className="flex flex-col gap-5">
      <input type="hidden" name="origin" value={origin} />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Incorrect email or password. Please try again.
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
      <button
        formAction={signIn}
        className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 transition-colors mt-2"
      >
        Sign In
      </button>
    </form>
  )
}
