import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { getSessionUser } from '@/lib/auth/server'
import { signOut } from '@/lib/auth/actions'
import { roleLabels } from '@/lib/auth/demo-users'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()

  // Middleware already gates this, but guard here too so `user` is never null.
  if (!user) {
    redirect('/login')
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/portal" className="flex items-center gap-3">
            <Image
              src="/images/pti-logo.png"
              alt="PTI"
              width={200}
              height={60}
              className="h-8 w-auto"
            />
            <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
              Campus News Portal
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
              Public site
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                {initials}
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-slate-800">{user.name}</div>
                <div className="text-xs text-slate-500">{roleLabels[user.role]}</div>
              </div>
            </div>
            <form action={signOut}>
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-600"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
