import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import type { CampusEvent } from '@/lib/content/types';
import { formatDateBlock, formatTimeRange } from '@/lib/format';

export function EventCard({ event }: { event: CampusEvent }) {
  const { month, day } = formatDateBlock(event.startsAt);

  return (
    <article className="group relative flex flex-col sm:flex-row bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-green-700 text-white p-8 flex flex-col items-center justify-center min-w-[140px]">
        <span className="text-sm font-bold font-sans uppercase tracking-widest mb-1 text-green-100">
          {month}
        </span>
        <span className="text-5xl font-sans font-black">{day}</span>
      </div>

      <div className="p-8 flex flex-col justify-center w-full">
        <h3 className="font-sans text-2xl font-bold text-slate-900 mb-3 leading-snug">
          <Link
            href={`/events/${event.slug}`}
            className="after:absolute after:inset-0 group-hover:text-green-700 transition-colors"
          >
            {event.title}
          </Link>
        </h3>

        <div className="flex flex-col gap-2 text-sm text-slate-600 mb-6 font-sans">
          <span className="flex items-center gap-3">
            <Clock size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
            <time dateTime={event.startsAt}>{formatTimeRange(event.startsAt, event.endsAt)}</time>
          </span>
          <span className="flex items-center gap-3">
            <MapPin size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
            {event.location}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="text-green-700 font-bold font-sans text-sm uppercase tracking-wide group-hover:text-green-900 transition-colors"
        >
          Event Details &rarr;
        </span>
      </div>
    </article>
  );
}
