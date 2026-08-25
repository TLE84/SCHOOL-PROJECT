import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-3xl text-center">
      <p className="font-sans text-sm font-bold uppercase tracking-widest text-green-700 mb-4">
        Error 404
      </p>
      <h1 className="font-sans text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
        We couldn&apos;t find that page
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        The page may have been moved, or the link that brought you here may be out of date.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center font-sans">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md font-semibold transition-colors shadow-sm"
        >
          Back to home
        </Link>
        <Link
          href="/news"
          className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:border-green-600 hover:text-green-700 px-6 py-3 rounded-md font-semibold transition-colors"
        >
          Browse all news <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
