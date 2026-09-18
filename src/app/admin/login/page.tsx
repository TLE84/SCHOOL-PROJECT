import Link from 'next/link'
import { SignInForm } from '@/components/auth/SignInForm'
import { DemoCredentials } from '@/components/auth/DemoCredentials'
import { isSupabaseAuthEnabled } from '@/utils/supabase/config'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>
}) {
  const { error, notice } = await searchParams
  // Demo accounts (and the pre-filled demo admin email) only exist without Supabase.
  const demoMode = !isSupabaseAuthEnabled()

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2">Sign in to manage campus news and articles.</p>
        </div>

        <SignInForm
          origin="admin"
          error={error}
          notice={notice}
          defaultEmail={demoMode ? 'admin@pti.edu.ng' : undefined}
        />

        {demoMode && <DemoCredentials roles={['admin']} />}

        <p className="mt-6 text-center text-sm text-slate-500">
          Student or lecturer?{' '}
          <Link href="/login" className="font-medium text-green-700 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
