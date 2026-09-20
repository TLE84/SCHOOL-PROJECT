import type { Department } from '@/lib/content/types'
import { signUp } from '@/lib/auth/actions'
import { DepartmentSelect } from './DepartmentSelect'
import { SubmitButton } from './SubmitButton'

const errorMessages: Record<string, string> = {
  missing: 'Please fill in your name, email and password.',
  email: 'Please enter a valid email address.',
  password: 'Your password must be at least 6 characters.',
  role: 'Please choose whether you are a student or a lecturer.',
  department: 'Please choose your department.',
  exists: 'An account with that email already exists. Try signing in instead.',
  rate: 'Too many sign-up emails have been sent recently. Please try again in a little while.',
  disabled: 'New sign-ups are currently closed.',
  undeliverable: 'We couldn’t send a confirmation email to that address. Please try again later or contact the site team.',
}

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'lecturer', label: 'Lecturer' },
] as const

export function SignUpForm({ error, departments }: { error?: string; departments: Department[] }) {
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

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 mb-1">I am a</legend>
        <div className="grid grid-cols-2 gap-3">
          {roleOptions.map((option, index) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={option.value}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <span className="flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-400 peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-700 peer-focus-visible:ring-2 peer-focus-visible:ring-green-600">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Students and lecturers both belong to a department. */}
      <DepartmentSelect departments={departments} required />

      <SubmitButton formAction={signUp} pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  )
}
