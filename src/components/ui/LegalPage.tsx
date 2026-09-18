import { PageHeader } from '@/components/ui/PageHeader';

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  description: string;
  sections: LegalSection[];
}

export function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader
        title={title}
        description={description}
        crumbs={[{ label: 'Home', href: '/' }, { label: title }]}
      />

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-sans text-xl font-bold text-slate-900">{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index} className="mt-3 leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-400">
        This is placeholder content for the demo and is not a binding legal statement.
      </p>
    </div>
  );
}
