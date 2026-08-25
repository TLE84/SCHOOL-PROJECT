import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Pagination } from '@/components/ui/Pagination';
import { PageHeader } from '@/components/ui/PageHeader';
import { getArticles, getCategories, getCategoryBySlug } from '@/lib/content/queries';

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: 'Category not found' };

  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const requestedPage = Number.parseInt(page ?? '1', 10);
  const { items, page: currentPage, totalPages } = await getArticles({
    categorySlug: slug,
    page: Number.isNaN(requestedPage) ? 1 : requestedPage,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title={category.name}
        description={category.description}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label: category.name },
        ]}
      />

      {items.length === 0 ? (
        <p className="text-lg text-slate-600">No articles have been published in this category yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/category/${slug}`}
            />
          )}
        </>
      )}
    </div>
  );
}
