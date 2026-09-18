import { demoUsers, roleLabels, type UserRole } from '@/lib/auth/demo-users'

export const dynamic = 'force-dynamic'

const roleBadge: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  lecturer: 'bg-blue-100 text-blue-700',
  student: 'bg-green-100 text-green-700',
}

export default function AdminUsersPage() {
  const counts = demoUsers.reduce(
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
            {demoUsers.map((user) => (
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
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {user.department ?? user.jobTitle ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        User accounts are hardcoded demo data. Adding, editing and removing users
        arrives with the database-backed auth layer.
      </p>
    </div>
  )
}
