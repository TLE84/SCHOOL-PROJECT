import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { getArticles, getDepartmentBySlug, getDepartments } from '@/lib/content/queries';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map((department) => ({ slug: department.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);

  if (!department) return { title: 'Department not found' };

  return {
    title: department.name,
    description:
      department.description ??
      `News from the Department of ${department.name} at the Petroleum Training Institute.`,
  };
}

export default async function DepartmentPage({ params }: Params) {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);

  if (!department) notFound();

  const { items } = await getArticles({ departmentSlug: slug, perPage: 12 });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title={
          department.abbreviation ? `${department.name} (${department.abbreviation})` : department.name
        }
        description={department.description}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Departments', href: '/departments' },
          { label: department.abbreviation ?? department.name },
        ]}
      />

      <h2 className="font-sans text-2xl font-bold text-slate-900 mb-8">Latest from this department</h2>

      {items.length === 0 ? (
        <p className="text-lg text-slate-600">No stories have been filed for this department yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
