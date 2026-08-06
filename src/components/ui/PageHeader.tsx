import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
}

export function PageHeader({ title, description, crumbs }: PageHeaderProps) {
  return (
    <header className="mb-12">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-sans font-medium tracking-wide uppercase">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-3">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-green-700 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-bold" aria-current="page">
                    {crumb.label}
                  </span>
                )}
                {index < crumbs.length - 1 && (
                  <ChevronRight size={14} className="text-slate-300" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <h1 className="font-sans text-4xl md:text-5xl font-bold text-slate-900 tracking-tight border-l-4 border-green-700 pl-4">
        {title}
      </h1>

      {description && (
        <p className="mt-6 max-w-3xl text-lg text-slate-600 leading-relaxed">{description}</p>
      )}
    </header>
  );
}
