import { demoUsers } from '@/lib/auth/demo-users'
import { roleLabels, type UserRole } from '@/lib/auth/roles'
import { requireAdmin } from '@/lib/auth/server'
import { sessionUserFromSupabase } from '@/lib/auth/supabase-user'
import { createAdminClient } from '@/utils/supabase/admin'
import { isSupabaseAuthEnabled } from '@/utils/supabase/config'

export const dynamic = 'force-dynamic'

const roleBadge: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  lecturer: 'bg-blue-100 text-blue-700',
  student: 'bg-green-100 text-green-700',
}

interface UserRow {
  id: string
  name: string
  email: string
  role: UserRole
  detail?: string
  /** Signed up but has not clicked the confirmation link yet. */
  pending?: boolean
}

type UserList = { source: 'supabase' | 'demo'; users: UserRow[]; error?: string }

async function loadUsers(): Promise<UserList> {
  if (!isSupabaseAuthEnabled()) {
    return {
      source: 'demo',
      users: demoUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        detail: user.department ?? user.jobTitle,
      })),
    }
  }

  const admin = createAdminClient()
  if (!admin) {
    return {
      source: 'supabase',
      users: [],
      error: 'Set SUPABASE_SERVICE_ROLE_KEY on the server to list accounts.',
    }
  }

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 })
  if (error) {
    console.error('[admin] Could not list Supabase users', error)
    return { source: 'supabase', users: [], error: 'Could not load accounts from Supabase right now.' }
  }

  return {
    source: 'supabase',
    users: data.users.map((account) => {
      const user = sessionUserFromSupabase(account)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        detail: user.department ?? user.jobTitle,
        pending: !account.email_confirmed_at,
      }
    }),
  }
}

export default async function AdminUsersPage() {
  await requireAdmin()
  const { source, users, error } = await loadUsers()

  const counts = users.reduce(
    (acc, user) => {
      acc[user.role] += 1
      return acc
    },
    { admin: 0, lecturer: 0, student: 0 } as Record<UserRole, number>,
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Users</h1>
        <p className="text-slate-500 mt-1">
          People with access to the campus news platform.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.keys(counts) as UserRole[]).map((role) => (
          <div key={role} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500">{roleLabels[role]}s</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{counts[role]}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Department / Title</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-xs font-bold text-slate-500 flex items-center justify-center">
                      {user.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                    <span className="font-medium text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.email}
                  {user.pending && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      Unconfirmed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {user.detail ?? '—'}
                </td>
              </tr>
            ))}

            {users.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No accounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        {source === 'supabase' ? (
          <>
            Accounts are managed by Supabase Auth. To make someone an administrator, run{' '}
            <code className="font-mono">npm run auth:set-role -- their@email admin</code>.
          </>
        ) : (
          <>
            Showing the hardcoded demo accounts — Supabase Auth is not configured.
          </>
        )}
      </p>
    </div>
  )
}
