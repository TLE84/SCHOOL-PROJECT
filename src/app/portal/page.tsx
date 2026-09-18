import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { Pill } from '@/components/ui/Pill'
import { getSessionUser } from '@/lib/auth/server'
import { getArticles, getCategories, getUpcomingEvents } from '@/lib/content/queries'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Campus News Portal',
}

export default async function PortalPage() {
  const [user, { items: articles }, categories, events] = await Promise.all([
    getSessionUser(),
    getArticles({ perPage: 6 }),
    getCategories(),
    getUpcomingEvents(3),
  ])

  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome, {firstName}
        </h1>
        <p className="mt-1 text-slate-500">
          The latest news, announcements and events from across the institute.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <Pill
            key={category.slug}
            label={category.name}
            href={`/category/${category.slug}`}
            variant="outline"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Latest news</h2>
            <Link
              href="/news"
              className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
            >
              View all news <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {articles.length === 0 ? (
            <p className="text-slate-600">No articles have been published yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} imageSizes="(min-width: 640px) 50vw, 100vw" />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Upcoming events</h2>
          {events.length === 0 ? (
            <p className="text-slate-600">No upcoming events.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <Link href={`/events/${event.slug}`} className="font-semibold text-slate-900 hover:text-green-700">
                    {event.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(event.startsAt)}</p>
                  {event.location && (
                    <p className="mt-1 text-xs text-slate-400">{event.location}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
          >
            View all events <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  )
}
