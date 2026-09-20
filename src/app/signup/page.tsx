import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { getDepartments } from '@/lib/content/queries'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a PTI account to access campus news.',
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const [{ error }, departments] = await Promise.all([searchParams, getDepartments()])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/images/pti-logo.png"
              alt="PTI"
              width={200}
              height={60}
              className="h-10 w-auto"
            />
          </Link>
          <h1 className="mt-6 font-sans text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-slate-500">
            Sign up to access campus news, events and announcements.
          </p>
        </div>

        <SignUpForm error={error} departments={departments} />

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-700 hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-400">
          <Link href="/" className="hover:underline">
            ← Back to the public site
          </Link>
        </p>
      </div>
    </div>
  )
}
