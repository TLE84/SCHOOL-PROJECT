import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { getDepartments } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Departments',
  description: 'Academic departments and programmes at the Petroleum Training Institute.',
};

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title="Departments"
        description="Programmes across engineering, science and general studies, each with its own teaching staff, laboratories and industry links."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Departments' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((department) => (
          <article
            key={department.id}
            className="group relative flex flex-col bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
          >
            <h2 className="font-sans text-xl font-bold text-slate-900 mb-3 leading-snug">
              <Link
                href={`/departments/${department.slug}`}
                className="after:absolute after:inset-0 group-hover:text-green-700 transition-colors"
              >
                {department.name}
              </Link>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">{department.description}</p>
            <span
              aria-hidden="true"
              className="mt-auto flex items-center gap-2 text-green-700 font-sans font-bold text-sm uppercase tracking-wide"
            >
              Read news <ArrowRight size={16} />
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
