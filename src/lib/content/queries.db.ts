import { and, asc, count, countDistinct, desc, eq, gte, ilike, inArray, isNull, ne, or, sql, type SQL } from 'drizzle-orm';
import { getDb } from '@/db';
import * as schema from '@/db/schema';
import type { Article, CampusEvent, Category, CertificateCourse, ContentBlock, Department, Paginated } from './types';
import type { AdminStats, AuthorOption, ResolvedArticleQuery } from './queries';
import { isUuid } from './source';

/**
 * Database-backed implementations of the read API in `queries.ts`.
 *
 * Each maps rows onto the same view models the seed data uses, so pages cannot
 * tell which source served them. Callers go through `queries.ts`, which falls
 * back to the seed implementations if any of these throw.
 */

const articleRelations = {
  author: true,
  category: true,
  department: true,
  tags: { with: { tag: true } },
} as const;

interface ArticleFind {
  where?: SQL;
  orderBy?: SQL[];
  limit?: number;
  offset?: number;
}

function findArticles(args: ArticleFind) {
  return getDb().query.articles.findMany({ ...args, with: articleRelations });
}

function findArticle(args: Omit<ArticleFind, 'limit' | 'offset'>) {
  return getDb().query.articles.findFirst({ ...args, with: articleRelations });
}

type ArticleRow = NonNullable<Awaited<ReturnType<typeof findArticle>>>;

const published = eq(schema.articles.isPublished, true);
const newestFirst = [desc(schema.articles.publishedAt), desc(schema.articles.createdAt)];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? '',
    content: (row.content as ContentBlock[]) ?? [],
    author: {
      id: row.author.id,
      name: row.author.name,
      role: row.author.jobTitle ?? undefined,
      bio: row.author.bio ?? undefined,
      initials: initials(row.author.name),
    },
    category: {
      id: row.category.id,
      name: row.category.name,
      slug: row.category.slug,
      description: row.category.description ?? '',
    },
    departmentSlug: row.department?.slug,
    featuredImage: row.featuredImage ?? undefined,
    tags: row.tags.map(({ tag }) => ({ name: tag.name, slug: tag.slug })),
    isFeatured: row.isFeatured,
    isPublished: row.isPublished,
    // Drafts have no publish date yet; their creation time keeps sorting stable.
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    readingMinutes: row.readingMinutes,
    views: row.views,
  };
}

function categoryIdsWithSlug(slug: string) {
  return getDb()
    .select({ id: schema.categories.id })
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug));
}

function departmentIdsWithSlug(slug: string) {
  return getDb()
    .select({ id: schema.departments.id })
    .from(schema.departments)
    .where(eq(schema.departments.slug, slug));
}

export async function getArticles({
  page,
  perPage,
  categorySlug,
  departmentSlug,
  excludeSlug,
  includeDrafts,
}: ResolvedArticleQuery): Promise<Paginated<Article>> {
  const conditions: SQL[] = [];
  if (!includeDrafts) conditions.push(published);
  if (categorySlug) conditions.push(inArray(schema.articles.categoryId, categoryIdsWithSlug(categorySlug)));
  if (departmentSlug) {
    conditions.push(inArray(schema.articles.departmentId, departmentIdsWithSlug(departmentSlug)));
  }
  if (excludeSlug) conditions.push(ne(schema.articles.slug, excludeSlug));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [[{ total }], rows] = await Promise.all([
    getDb().select({ total: count() }).from(schema.articles).where(where),
    findArticles({ where, orderBy: newestFirst, limit: perPage, offset: (page - 1) * perPage }),
  ]);

  return {
    items: rows.map(mapArticle),
    page,
    perPage,
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const row = await findArticle({ where: and(eq(schema.articles.slug, slug), published) });
  return row ? mapArticle(row) : null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  // Not a UUID → cannot match, and Postgres would reject the cast anyway.
  if (!isUuid(id)) return null;
  const row = await findArticle({ where: eq(schema.articles.id, id) });
  return row ? mapArticle(row) : null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const rows = await getDb()
    .select({ slug: schema.articles.slug })
    .from(schema.articles)
    .where(published);
  return rows.map((row) => row.slug);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim();
  if (!q) return [];

  // Escape LIKE wildcards so a search for "100%" matches literally.
  const pattern = `%${q.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
  const db = getDb();

  const rows = await findArticles({
    where: and(
      published,
      or(
        ilike(schema.articles.title, pattern),
        ilike(schema.articles.excerpt, pattern),
        inArray(
          schema.articles.categoryId,
          db.select({ id: schema.categories.id }).from(schema.categories).where(ilike(schema.categories.name, pattern)),
        ),
        inArray(
          schema.articles.id,
          db
            .select({ id: schema.articleTags.articleId })
            .from(schema.articleTags)
            .innerJoin(schema.tags, eq(schema.tags.id, schema.articleTags.tagId))
            .where(ilike(schema.tags.name, pattern)),
        ),
      ),
    ),
    orderBy: newestFirst,
    limit: 50,
  });

  return rows.map(mapArticle);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  // Featured first, then newest — so with no featured article the latest wins.
  const row = await findArticle({
    where: published,
    orderBy: [desc(schema.articles.isFeatured), ...newestFirst],
  });
  return row ? mapArticle(row) : null;
}

export async function getTrendingArticles(limit = 2, excludeSlug?: string): Promise<Article[]> {
  const rows = await findArticles({
    where: excludeSlug ? and(published, ne(schema.articles.slug, excludeSlug)) : published,
    orderBy: [desc(schema.articles.views), ...newestFirst],
    limit,
  });
  return rows.map(mapArticle);
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  // Same category first, topped up with the newest from elsewhere.
  const rows = await findArticles({
    where: and(published, ne(schema.articles.slug, article.slug)),
    orderBy: [
      desc(sql`${schema.articles.categoryId} in (${categoryIdsWithSlug(article.category.slug)})`),
      ...newestFirst,
    ],
    limit,
  });
  return rows.map(mapArticle);
}

function mapCategory(row: typeof schema.categories.$inferSelect): Category {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description ?? '' };
}

function mapDepartment(row: typeof schema.departments.$inferSelect): Department {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    abbreviation: row.abbreviation ?? undefined,
    description: row.description ?? undefined,
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await getDb().select().from(schema.categories).orderBy(asc(schema.categories.name));
  return rows.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const [row] = await getDb().select().from(schema.categories).where(eq(schema.categories.slug, slug)).limit(1);
  return row ? mapCategory(row) : null;
}

export async function getDepartments(): Promise<Department[]> {
  const rows = await getDb().select().from(schema.departments).orderBy(asc(schema.departments.name));
  return rows.map(mapDepartment);
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  const [row] = await getDb().select().from(schema.departments).where(eq(schema.departments.slug, slug)).limit(1);
  return row ? mapDepartment(row) : null;
}

/** People who can be credited on an article: bylines, lecturers and admins — not students. */
export async function getUsers(): Promise<AuthorOption[]> {
  return getDb()
    .select({ id: schema.users.id, name: schema.users.name })
    .from(schema.users)
    .where(or(isNull(schema.users.role), inArray(schema.users.role, ['admin', 'lecturer'])))
    .orderBy(asc(schema.users.name));
}

export async function getAdminStats(): Promise<AdminStats> {
  const db = getDb();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [[{ totalArticles }], [{ publishedThisMonth }], [{ totalAuthors }]] = await Promise.all([
    db.select({ totalArticles: count() }).from(schema.articles),
    db
      .select({ publishedThisMonth: count() })
      .from(schema.articles)
      .where(and(published, gte(schema.articles.publishedAt, startOfMonth))),
    db.select({ totalAuthors: countDistinct(schema.articles.authorId) }).from(schema.articles),
  ]);

  return { totalArticles, publishedThisMonth, totalAuthors };
}

function mapEvent(row: typeof schema.events.$inferSelect): CampusEvent {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    location: row.location ?? '',
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt?.toISOString(),
    allDay: row.allDay,
  };
}

const byStart = (a: CampusEvent, b: CampusEvent) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

async function getPublishedEvents(): Promise<CampusEvent[]> {
  const rows = await getDb().select().from(schema.events).where(eq(schema.events.isPublished, true));
  return rows.map(mapEvent);
}

// Same rules as the seed implementation: an event is upcoming until it ends,
// and with nothing upcoming the calendar shows everything rather than nothing.
export async function getUpcomingEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  const all = await getPublishedEvents();
  const upcoming = all
    .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() >= now.getTime())
    .sort(byStart);
  const list = upcoming.length > 0 ? upcoming : all.sort(byStart);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export async function getPastEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  const past = (await getPublishedEvents())
    .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() < now.getTime())
    .sort((a, b) => byStart(b, a));
  return typeof limit === 'number' ? past.slice(0, limit) : past;
}

export async function getEventBySlug(slug: string): Promise<CampusEvent | null> {
  const [row] = await getDb()
    .select()
    .from(schema.events)
    .where(and(eq(schema.events.slug, slug), eq(schema.events.isPublished, true)))
    .limit(1);
  return row ? mapEvent(row) : null;
}

export async function getAllEventSlugs(): Promise<string[]> {
  const rows = await getDb()
    .select({ slug: schema.events.slug })
    .from(schema.events)
    .where(eq(schema.events.isPublished, true));
  return rows.map((row) => row.slug);
}

export async function getCertificateCourses(): Promise<CertificateCourse[]> {
  const rows = await getDb()
    .select()
    .from(schema.certificateCourses)
    .orderBy(asc(schema.certificateCourses.name));
  return rows.map(({ id, name, slug }) => ({ id, name, slug }));
}
