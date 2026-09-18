import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Home } from 'lucide-react'

/**
 * Global custom 404, shown for unmatched URLs and any notFound() that reaches
 * the root. It renders inside the bare root layout (no site navbar/footer), so
 * it is self-contained. In-site 404s (e.g. an unknown article slug) use
 * (site)/not-found.tsx instead, which keeps the site chrome.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16 text-center font-sans">
      <Link href="/" className="mb-10 inline-flex items-center justify-center">
        <Image src="/images/pti-logo.png" alt="PTI" width={220} height={64} className="h-12 w-auto" priority />
      </Link>

      <p className="text-7xl font-bold tracking-tight text-green-700 sm:text-8xl">404</p>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        This page could not be found
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-600">
        The page may have been moved, or the link that brought you here may be out of date.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-green-800"
        >
          <Home size={18} aria-hidden="true" /> Back to home
        </Link>
        <Link
          href="/news"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-green-600 hover:text-green-700"
        >
          Browse all news <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  )
}
