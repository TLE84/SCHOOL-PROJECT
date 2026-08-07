import type { Metadata } from 'next';
import { EventCard } from '@/components/ui/EventCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { getPastEvents, getUpcomingEvents } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Ceremonies, conferences, symposia and meetings across the Petroleum Training Institute.',
};

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title="Events"
        description="Ceremonies, conferences, symposia and meetings taking place across the institute."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
      />

      <section aria-labelledby="upcoming-events" className="mb-20">
        <h2 id="upcoming-events" className="font-sans text-2xl font-bold text-slate-900 mb-8">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-lg text-slate-600">There are no events scheduled at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section aria-labelledby="past-events">
          <h2 id="past-events" className="font-sans text-2xl font-bold text-slate-900 mb-8">
            Recently held
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-90">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
