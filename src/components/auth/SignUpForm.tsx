import { signUp } from '@/lib/auth/actions'

const errorMessages: Record<string, string> = {
  missing: 'Please fill in your name, email and password.',
  email: 'Please enter a valid email address.',
  password: 'Your password must be at least 6 characters.',
  exists: 'An account with that email already exists. Try signing in instead.',
}

export function SignUpForm({ error }: { error?: string }) {
  const message = error ? errorMessages[error] ?? 'Something went wrong. Please try again.' : null

  return (
    <form className="flex flex-col gap-5">
      {message && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-colors"
          placeholder="Ada Lovelace"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
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
          minLength={6}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-colors"
          placeholder="At least 6 characters"
        />
      </div>
      <button
        formAction={signUp}
        className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 transition-colors mt-2"
      >
        Create account
      </button>
    </form>
  )
}
