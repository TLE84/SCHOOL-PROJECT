import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { getAllEventSlugs, getEventBySlug, getUpcomingEvents } from '@/lib/content/queries';
import { formatDate, formatTimeRange } from '@/lib/format';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: 'Event not found' };

  return { title: event.title, description: event.description };
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const others = (await getUpcomingEvents()).filter((item) => item.slug !== event.slug).slice(0, 3);

  const details = [
    { Icon: Calendar, label: 'Date', value: formatDate(event.startsAt), dateTime: event.startsAt },
    { Icon: Clock, label: 'Time', value: formatTimeRange(event.startsAt, event.endsAt) },
    { Icon: MapPin, label: 'Location', value: event.location },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
      <PageHeader
        title={event.title}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
          { label: event.title },
        ]}
      />

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-200 py-8 mb-12 font-sans">
        {details.map(({ Icon, label, value, dateTime }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon size={20} className="text-green-700 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</dt>
              <dd className="text-slate-900 font-medium mt-1">
                {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <p className="text-xl text-slate-700 leading-relaxed font-serif mb-16">{event.description}</p>

      {others.length > 0 && (
        <section aria-labelledby="other-events">
          <h2 id="other-events" className="font-sans text-2xl font-bold text-slate-900 mb-6">
            Other upcoming events
          </h2>
          <ul className="flex flex-col divide-y divide-slate-200 border-y border-slate-200">
            {others.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/events/${item.slug}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-5 group"
                >
                  <span className="font-sans font-bold text-slate-900 group-hover:text-green-700 transition-colors">
                    {item.title}
                  </span>
                  <time dateTime={item.startsAt} className="text-sm text-slate-500 font-sans">
                    {formatDate(item.startsAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
