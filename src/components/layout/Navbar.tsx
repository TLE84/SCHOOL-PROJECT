import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { navLinks } from './nav-links';

export function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-700 rounded-md flex items-center justify-center text-white font-bold font-serif shadow-sm">PTI</div>
          <div>
            <div className="font-serif font-bold text-xl text-green-900 leading-none">PTI NEWS</div>
            <div className="text-xs text-slate-500 mt-1 font-medium tracking-wide">Digital Information Hub</div>
          </div>
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
        <div className="flex items-center gap-4 sm:gap-5">
          <button aria-label="Search" className="text-slate-600 hover:text-green-600 transition-colors">
            <Search size={20} />
          </button>
          <button className="hidden sm:block bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
            Subscribe
          </button>
          <button aria-label="Account" className="hidden lg:block text-slate-600 hover:text-green-600 border border-slate-200 rounded-full p-1.5 transition-colors">
            <User size={20} />
          </button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
