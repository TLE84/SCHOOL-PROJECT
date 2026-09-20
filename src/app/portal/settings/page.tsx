import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/server'
import { getDepartments } from '@/lib/content/queries'
import { ProfileSettingsForm } from '@/components/auth/ProfileSettingsForm'
import { PasswordSettingsForm } from '@/components/auth/PasswordSettingsForm'

export const metadata: Metadata = {
  title: 'Profile Settings',
}

export const dynamic = 'force-dynamic'

export default async function PortalSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>
}) {
  const [user, departments, { updated, error }] = await Promise.all([
    getSessionUser(),
    getDepartments(),
    searchParams,
  ])

  // The proxy gates /portal, but never render this on a null user.
  if (!user) redirect('/login')

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile settings</h1>
        <p className="mt-1 text-slate-500">Update your details and password.</p>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">Your details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your name appears on your comments; your department helps staff know who you are.
          </p>
        </div>
        <ProfileSettingsForm
          user={user}
          departments={departments}
          redirectTo="/portal/settings"
          updated={updated}
          error={error}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">Password</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose something you don&rsquo;t use anywhere else.
          </p>
        </div>
        <PasswordSettingsForm redirectTo="/portal/settings" updated={updated} error={error} />
      </section>
    </div>
  )
}
