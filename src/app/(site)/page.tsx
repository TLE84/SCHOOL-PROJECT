import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { EventCard } from '@/components/ui/EventCard';
import { Pill } from '@/components/ui/Pill';
import {
  getArticles,
  getFeaturedArticle,
  getTrendingArticles,
  getUpcomingEvents,
} from '@/lib/content/queries';
import { formatDate } from '@/lib/format';

export default async function LandingPage() {
  const featured = await getFeaturedArticle();

  const [trending, latest, events] = await Promise.all([
    getTrendingArticles(2, featured?.slug),
    getArticles({ perPage: 3, excludeSlug: featured?.slug }),
    getUpcomingEvents(2),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-7xl">
      {/* Featured Hero Section */}
      {featured && (
        <section aria-labelledby="lead-story" className="mb-24">
          <h2 id="lead-story" className="sr-only">Lead story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* min-h + items-end (rather than a fixed height with an absolutely
                positioned overlay) so a long headline grows the card instead of
                being clipped by overflow-hidden. */}
            <div className="lg:col-span-8 relative flex items-end min-h-[450px] lg:min-h-[500px] rounded-2xl overflow-hidden group shadow-lg">
              {featured.featuredImage && (
                <Image
                  src={featured.featuredImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30" />
              <div className="relative p-8 md:p-12 w-full md:w-5/6 text-white">
                <Pill label={featured.category.name} variant="green" />
                <h3 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold mt-6 mb-4 leading-tight">
                  <Link href={`/news/${featured.slug}`} className="hover:text-green-300 transition-colors">
                    {featured.title}
                  </Link>
                </h3>
                <p className="text-slate-200 text-lg md:text-xl mb-6 line-clamp-2 font-serif leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-300 tracking-wide font-sans">
                  <span>By {featured.author.name}</span>
                  <span className="w-1 h-1 bg-green-500 rounded-full" aria-hidden="true" />
                  <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-8">
              <h2 className="font-sans text-xl font-bold text-slate-900 border-l-4 border-green-700 pl-3 uppercase tracking-wider">
                Trending Now
              </h2>
              <div className="flex flex-col gap-8">
                {trending.map((article) => (
                  <ArticleCard key={article.id} article={article} imageSizes="(min-width: 1024px) 33vw, 100vw" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Stories Grid */}
      <section aria-labelledby="latest-stories" className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <h2 id="latest-stories" className="font-sans text-4xl font-bold text-slate-900 tracking-tight border-l-4 border-green-700 pl-4">
            Latest Stories
          </h2>
          <Link
            href="/news"
            className="text-green-700 font-sans font-bold hover:text-green-800 transition-colors mt-4 md:mt-0 flex items-center gap-2"
          >
            View All Articles &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latest.items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section aria-labelledby="upcoming-events" className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <h2 id="upcoming-events" className="font-sans text-4xl font-bold text-slate-900 border-l-4 border-green-700 pl-4 tracking-tight">
            Upcoming Events
          </h2>
          <Link
            href="/events"
            className="text-green-700 font-sans font-bold hover:text-green-800 transition-colors mt-4 md:mt-0 flex items-center gap-2"
          >
            View All Events &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
