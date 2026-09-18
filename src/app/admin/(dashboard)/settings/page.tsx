import { getSessionUser } from '@/lib/auth/server'
import { roleLabels } from '@/lib/auth/demo-users'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-slate-900 font-medium">{value}</p>
    </div>
  )
}

export default async function AdminSettingsPage() {
  const user = await getSessionUser()

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Your account and site configuration.</p>
      </div>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Account</h2>
          <p className="text-sm text-slate-500 mt-1">The administrator you are signed in as.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Name" value={user?.name ?? 'Administrator'} />
          <Field label="Email" value={user?.email ?? '—'} />
          <Field label="Role" value={user ? roleLabels[user.role] : 'Administrator'} />
          {user?.jobTitle && <Field label="Job title" value={user.jobTitle} />}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Site</h2>
          <p className="text-sm text-slate-500 mt-1">Public-facing platform details.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Site name" value="PTI News" />
          <Field label="Institution" value="Petroleum Training Institute, Effurun" />
          <Field label="Canonical URL" value={siteUrl} />
          <Field label="Articles per page" value="6" />
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Settings are read-only in the demo. Editable, persisted settings arrive
        with the database-backed layer.
      </p>
    </div>
  )
}
