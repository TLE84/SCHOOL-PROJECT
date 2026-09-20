import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { VerifyCodeForm } from '@/components/auth/VerifyCodeForm'
import { getSessionUser } from '@/lib/auth/server'
import { homePathForRole } from '@/lib/auth/session'
import { isSupabaseAuthEnabled } from '@/utils/supabase/config'

export const metadata: Metadata = {
  title: 'Confirm your email',
  description: 'Enter the code we emailed you to finish creating your PTI account.',
}

export const dynamic = 'force-dynamic'

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; notice?: string }>
}) {
  const { email, error, notice } = await searchParams

  // Demo mode has no email confirmation, and a signed-in visitor has nothing
  // left to confirm.
  if (!isSupabaseAuthEnabled()) redirect('/login')
  const user = await getSessionUser()
  if (user) redirect(homePathForRole(user.role))
  if (!email) redirect('/signup')

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image src="/images/pti-logo.png" alt="PTI" width={200} height={60} className="h-10 w-auto" />
          </Link>
          <h1 className="mt-6 font-sans text-2xl font-bold tracking-tight text-slate-900">
            Confirm your email
          </h1>
          <p className="mt-2 text-slate-500">
            We sent a verification code to <span className="font-medium text-slate-700">{email}</span>. Enter
            it below to finish setting up your account.
          </p>
        </div>

        <VerifyCodeForm email={email} error={error} notice={notice} />

        <p className="mt-6 text-center text-sm text-slate-500">
          Wrong address?{' '}
          <Link href="/signup" className="font-medium text-green-700 hover:underline">
            Sign up again
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-400">
          <Link href="/login" className="hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
