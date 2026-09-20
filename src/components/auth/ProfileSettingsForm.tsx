import type { Department } from '@/lib/content/types'
import { updateProfile } from '@/lib/auth/profile-actions'
import { roleLabels } from '@/lib/auth/roles'
import type { SessionUser } from '@/lib/auth/session'
import { DepartmentSelect } from './DepartmentSelect'
import { FormMessage } from './FormMessage'
import { SubmitButton } from './SubmitButton'

const errorMessages: Record<string, string> = {
  name: 'Please enter your full name.',
  department: 'Please choose a department from the list.',
  failed: 'We couldn’t save your details just now. Please try again.',
}

interface ProfileSettingsFormProps {
  user: SessionUser
  departments: Department[]
  /** Where to return after saving — this page. */
  redirectTo: string
  /** `?updated=` and `?error=` from the page's search params. */
  updated?: string
  error?: string
}

/** Edit your own name, department and (for staff) job title. */
export function ProfileSettingsForm({
  user,
  departments,
  redirectTo,
  updated,
  error,
}: ProfileSettingsFormProps) {
  const isStudent = user.role === 'student'

  return (
    <form action={updateProfile} className="flex flex-col gap-5 p-6">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <FormMessage
        error={error && errorMessages[error]}
        success={updated === 'profile' ? 'Your profile has been updated.' : undefined}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={user.name}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
        />
      </div>

      <DepartmentSelect departments={departments} defaultValue={user.department} />

      {!isStudent && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="jobTitle">
            Job title <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            maxLength={100}
            defaultValue={user.jobTitle ?? ''}
            placeholder="Senior Lecturer"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
          />
          <p className="mt-1 text-xs text-slate-500">Shown with your name on articles you write.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-500">Email</p>
          <p className="font-medium text-slate-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Role</p>
          <p className="font-medium text-slate-900">{roleLabels[user.role]}</p>
        </div>
      </div>
      <p className="-mt-2 text-xs text-slate-500">
        Your email address and role are set by the site administrators.
      </p>

      <SubmitButton formAction={updateProfile} pendingLabel="Saving…" variant="inline">
        Save changes
      </SubmitButton>
    </form>
  )
}
