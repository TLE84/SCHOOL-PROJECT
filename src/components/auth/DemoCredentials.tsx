import { demoUsers } from '@/lib/auth/demo-users'
import { roleLabels, type UserRole } from '@/lib/auth/roles'

const roleStyles: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  lecturer: 'bg-blue-100 text-blue-700',
  student: 'bg-green-100 text-green-700',
}

/**
 * A read-only cheat sheet of the demo accounts, shown on the login pages so a
 * demo can be signed into without hunting for credentials. Only rendered when
 * Supabase Auth is not configured — with it on, these accounts don't work.
 */
export function DemoCredentials({ roles }: { roles?: UserRole[] }) {
  const users = roles ? demoUsers.filter((user) => roles.includes(user.role)) : demoUsers

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Demo logins
      </p>
      <ul className="mt-3 space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleStyles[user.role]}`}
                >
                  {roleLabels[user.role]}
                </span>
                <span className="truncate font-medium text-slate-700">{user.name}</span>
              </div>
              <code className="mt-1 block truncate text-xs text-slate-500">
                {user.email} · {user.password}
              </code>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Hardcoded demo accounts. Copy an email and password into the form above.
      </p>
    </div>
  )
}
