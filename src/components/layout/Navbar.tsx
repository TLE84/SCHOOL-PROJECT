import Link from 'next/link';
import Image from 'next/image';
import { Search, LogOut } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { navLinks } from './nav-links';
import { getSessionUser } from '@/lib/auth/server';
import { signOut } from '@/lib/auth/actions';
import { homePathForRole, type SessionUser } from '@/lib/auth/session';
import { roleLabels } from '@/lib/auth/roles';

export async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/pti-logo.png" alt="PTI Logo" width={250} height={70} className="h-12 w-auto" priority />
        </Link>

        {/* Nav Links */}
        <nav aria-label="Main" className="hidden lg:flex items-center gap-8 font-sans text-sm font-bold text-slate-800">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} className="hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 py-1">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4 font-sans">
          <Link href="/search" aria-label="Search" className="text-slate-600 hover:text-green-600 transition-colors">
            <Search size={20} />
          </Link>

          {user ? (
            <>
              <Link
                href={homePathForRole(user.role)}
                className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition-colors hover:border-green-600"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  {initials(user)}
                </span>
                <span className="text-sm font-semibold text-slate-700">{user.name.split(' ')[0]}</span>
              </Link>
              <form action={signOut}>
                <button
                  aria-label="Sign out"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-600"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-semibold text-slate-700 transition-colors hover:text-green-700"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800"
              >
                Sign up
              </Link>
            </>
          )}

          <MobileNav
            user={user ? { name: user.name, role: user.role, roleLabel: roleLabels[user.role] } : null}
          />
        </div>
      </div>
    </header>
  );
}

function initials(user: SessionUser): string {
  return user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
