import { requireAdmin } from '@/lib/auth/server'
import { roleLabels } from '@/lib/auth/roles'
import { checkDatabase } from '@/lib/content/source'
import { siteUrl } from '@/lib/site'
import { isSupabaseAuthEnabled } from '@/utils/supabase/config'

export const dynamic = 'force-dynamic'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-slate-900 font-medium">{value}</p>
    </div>
  )
}

function Status({ label, ok, value, detail }: { label: string; ok: boolean | null; value: string; detail?: string }) {
  const dot = ok === null ? 'bg-slate-300' : ok ? 'bg-green-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="flex items-center gap-2 text-slate-900 font-medium">
        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        {value}
      </p>
      {detail && <p className="text-xs text-slate-500 break-words">{detail}</p>}
    </div>
  )
}

export default async function AdminSettingsPage() {
  const user = await requireAdmin()
  const database = await checkDatabase()
  const supabaseAuth = isSupabaseAuthEnabled()
  const serviceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY)

  const databaseValue = !database.configured
    ? 'Not configured — serving built-in seed content'
    : database.reachable
      ? `Connected (${database.latencyMs} ms)`
      : 'Unreachable — serving built-in seed content'

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
          <Field label="Name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={roleLabels[user.role]} />
          {user.jobTitle && <Field label="Job title" value={user.jobTitle} />}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Backend status</h2>
          <p className="text-sm text-slate-500 mt-1">
            Live check of this deployment&rsquo;s database and auth configuration.
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Status
            label="Database"
            ok={database.configured ? database.reachable : null}
            value={databaseValue}
            detail={database.error ?? undefined}
          />
          <Status
            label="Authentication"
            ok={supabaseAuth ? true : null}
            value={supabaseAuth ? 'Supabase Auth' : 'Demo accounts (Supabase not configured)'}
          />
          <Status
            label="Service role key"
            ok={supabaseAuth ? serviceKey : null}
            value={serviceKey ? 'Configured (server only)' : 'Not set — sign-up roles and the Users list need it'}
          />
          {database.lastFailure && (
            <Status
              label="Last failed read on this server"
              ok={false}
              value={new Date(database.lastFailure.at).toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })}
              detail={database.lastFailure.message}
            />
          )}
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
    </div>
  )
}
