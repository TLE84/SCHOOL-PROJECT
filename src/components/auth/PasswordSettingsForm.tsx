import { updatePassword } from '@/lib/auth/profile-actions'
import { FormMessage } from './FormMessage'
import { SubmitButton } from './SubmitButton'

const errorMessages: Record<string, string> = {
  'pw-current': 'That current password is not correct.',
  'pw-mismatch': 'The two new passwords do not match.',
  'pw-weak': 'Your new password must be at least 6 characters.',
  'pw-same': 'Your new password must be different from the current one.',
  'pw-failed': 'We couldn’t change your password just now. Please try again.',
}

interface PasswordSettingsFormProps {
  redirectTo: string
  updated?: string
  error?: string
}

/** Change your own password, confirming the current one first. */
export function PasswordSettingsForm({ redirectTo, updated, error }: PasswordSettingsFormProps) {
  return (
    <form action={updatePassword} className="flex flex-col gap-5 p-6">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <FormMessage
        error={error && errorMessages[error]}
        success={updated === 'password' ? 'Your password has been changed.' : undefined}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="currentPassword">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="newPassword">
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      <SubmitButton formAction={updatePassword} pendingLabel="Updating…" variant="inline">
        Update password
      </SubmitButton>
    </form>
  )
}
