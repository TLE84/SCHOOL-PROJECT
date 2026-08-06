'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { audienceLinks, navLinks } from './nav-links';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  // Close when navigating to a new route. Adjusting state during render is the
  // documented pattern for reacting to a changed value; doing it in an effect
  // instead renders the stale open panel first, then immediately re-renders.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // While open: Escape closes, and the page behind must not scroll.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Move focus into the panel on open and back to the toggle on close. The
  // `hasOpened` guard stops this from stealing focus on first render.
  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    } else if (hasOpened.current) {
      toggleRef.current?.focus();
    }
  }, [open]);

  // Keep Tab cycling inside the panel while it is open.
  const trapFocus = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="lg:hidden text-slate-700 hover:text-green-700 transition-colors"
      >
        <Menu size={26} />
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        inert={!open}
        onKeyDown={trapFocus}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl',
          'transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <span className="font-serif text-lg font-bold text-green-900">PTI NEWS</span>
          <button
            type="button"
            data-autofocus
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-green-700"
          >
            <X size={24} />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-6 py-4 font-sans">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'block border-b border-slate-100 py-4 text-lg font-bold transition-colors',
                    isActive(link.href)
                      ? 'text-green-700'
                      : 'text-slate-800 hover:text-green-700',
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Quick Links
          </p>
          <ul className="flex flex-wrap gap-2">
            {audienceLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-green-50 hover:text-green-700"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-5 font-sans">
          <Link
            href="#"
            className="flex flex-1 items-center justify-center rounded-md bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            Subscribe
          </Link>
          <Link
            href="#"
            aria-label="Account"
            className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition-colors hover:text-green-700"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </>
  );
}
