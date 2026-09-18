import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { searchArticles } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search news and stories from the Petroleum Training Institute.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const results = query ? await searchArticles(query) : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title="Search"
        description="Find news, announcements and stories across the institute."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
      />

      <form className="mb-12 flex max-w-2xl gap-3" role="search">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="q" className="sr-only">
            Search articles
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            autoFocus
            placeholder="Search articles…"
            className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-base outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
        >
          Search
        </button>
      </form>

      {query === '' ? (
        <p className="text-lg text-slate-600">Enter a search term above to find articles.</p>
      ) : results.length === 0 ? (
        <p className="text-lg text-slate-600">
          No articles found for <span className="font-semibold text-slate-900">“{query}”</span>. Try a different term.
        </p>
      ) : (
        <>
          <p className="mb-8 text-slate-600">
            {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
            <span className="font-semibold text-slate-900">“{query}”</span>
          </p>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
