import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCertificateCourses, getDepartments } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Departments',
  description: 'Academic departments and programmes at the Petroleum Training Institute.',
};

export default async function DepartmentsPage() {
  const [departments, certificates] = await Promise.all([
    getDepartments(),
    getCertificateCourses(),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title="Departments"
        description="The institute's academic departments, alongside its short certificate programmes."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Departments' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((department) => (
          <article
            key={department.id}
            className="group relative flex flex-col bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
          >
            {department.abbreviation && (
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-green-700">
                {department.abbreviation}
              </p>
            )}
            <h2 className="font-sans text-xl font-bold text-slate-900 mb-3 leading-snug">
              <Link
                href={`/departments/${department.slug}`}
                className="after:absolute after:inset-0 group-hover:text-green-700 transition-colors"
              >
                {department.name}
              </Link>
            </h2>
            {department.description && (
              <p className="text-slate-600 leading-relaxed mb-6">{department.description}</p>
            )}
            <span
              aria-hidden="true"
              className="mt-auto flex items-center gap-2 text-green-700 font-sans font-bold text-sm uppercase tracking-wide"
            >
              Read news <ArrowRight size={16} />
            </span>
          </article>
        ))}
      </div>

      {certificates.length > 0 && (
        <section aria-labelledby="certificate-courses" className="mt-20">
          <h2
            id="certificate-courses"
            className="font-sans text-2xl font-bold text-slate-900 mb-3 border-l-4 border-green-700 pl-4"
          >
            Certificate Courses
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8 max-w-3xl">
            Short certificate programmes offered alongside the academic departments.
          </p>
          <ul className="flex flex-wrap gap-4">
            {certificates.map((course) => (
              <li
                key={course.id}
                className="rounded-xl border border-slate-200 bg-white px-6 py-4 font-sans font-bold text-slate-900 shadow-sm"
              >
                {course.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
