import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SignInForm } from '@/components/auth/SignInForm'
import { DemoCredentials } from '@/components/auth/DemoCredentials'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Students and lecturers sign in to access PTI campus news.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

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
            Student &amp; Lecturer Sign In
          </h1>
          <p className="mt-2 text-slate-500">
            Sign in with your PTI account to access campus news.
          </p>
        </div>

        <SignInForm origin="portal" error={Boolean(error)} />

        <DemoCredentials roles={['student', 'lecturer']} />

        <p className="mt-6 text-center text-sm text-slate-500">
          Administrator?{' '}
          <Link href="/admin/login" className="font-medium text-green-700 hover:underline">
            Go to the admin portal
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
