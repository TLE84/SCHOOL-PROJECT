import type { Metadata } from 'next';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Pagination } from '@/components/ui/Pagination';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pill } from '@/components/ui/Pill';
import { getArticles, getCategories } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'News',
  description: 'The latest news, updates and stories from the Petroleum Training Institute.',
};

export default async function NewsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const requestedPage = Number.parseInt(page ?? '1', 10);

  const [{ items, page: currentPage, totalPages, total }, categories] = await Promise.all([
    getArticles({ page: Number.isNaN(requestedPage) ? 1 : requestedPage }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title="News"
        description="Reporting on research, academics, student life and industry partnership across the institute."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />

      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((category) => (
          <Pill key={category.slug} label={category.name} href={`/category/${category.slug}`} variant="outline" />
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-lg text-slate-600">No articles have been published yet.</p>
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            Page {currentPage} of {totalPages}, {total} articles in total.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/news" />
          )}
        </>
      )}
    </div>
  );
}
