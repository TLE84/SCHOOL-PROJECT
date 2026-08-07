# PTI News

Digital information hub for the Petroleum Training Institute, Effurun — news,
departments and events.

Built with Next.js 16 (App Router), React 19 and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No environment variables are needed: the content
layer is seed-backed, so the site builds and runs with nothing configured.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next lint` was removed in Next 16) |
| `npm run typecheck` | `tsc --noEmit` |

## Where things live

```
src/
  app/                     routes (App Router)
    news/[slug]            article pages
    category/[slug]        category listings
    departments/[slug]     department pages
    events/[slug]          event pages
  components/
    layout/                top bar, navbar, mobile menu, footer
    ui/                    cards, pills, pagination, share links
  lib/
    content/               the read API — see below
    format.ts              date/time formatting (locale and TZ pinned)
    site.ts                canonical origin resolution
  db/schema.ts             Drizzle schema (not yet wired to any page)
```

### The content layer

Pages never touch a database. They call async functions in
`src/lib/content/queries.ts`, which return view models defined in `types.ts`
and currently read from `seed.ts`.

```ts
const { items, totalPages } = await getArticles({ page, categorySlug })
const article = await getArticleBySlug(slug)
```

Moving to Postgres means rewriting the bodies of `queries.ts` against
`src/db/schema.ts`. No page or component changes.

> **Note:** some seed content is placeholder copy carried over from the
> original static markup. It is marked as such at the top of `seed.ts` and
> should be replaced with real reporting before launch.

## Deploying to Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new). Framework
   detection, build command and output directory are all automatic.
2. Deploy. No environment variables are required for the first deploy.
3. Once a custom domain is live, set `NEXT_PUBLIC_SITE_URL` to it (for example
   `https://news.pti.edu.ng`) in **Settings → Environment Variables**, then
   redeploy.

`NEXT_PUBLIC_SITE_URL` backs `metadataBase` and the absolute URLs in share
links. Until it is set, `src/lib/site.ts` falls back to the Vercel-provided
deployment domain, so Open Graph previews and share buttons still resolve
correctly — they just use the `*.vercel.app` host.

See `.env.example` for the full list of variables and what still needs wiring.
