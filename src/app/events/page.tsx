import type { Metadata } from 'next';
import { EventCard } from '@/components/ui/EventCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { getUpcomingEvents } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Ceremonies, exhibitions, seminars and fixtures across the Petroleum Training Institute.',
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <PageHeader
        title="Events"
        description="Ceremonies, exhibitions, seminars and fixtures taking place across the institute."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
      />

      {events.length === 0 ? (
        <p className="text-lg text-slate-600">There are no events scheduled at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
