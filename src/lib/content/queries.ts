import * as seed from './seed';
import type { Article, CampusEvent, Category, Department, Paginated } from './types';

/**
 * The site's read API.
 *
 * Every function is async and returns plain view models, so replacing these
 * bodies with Drizzle queries against `src/db/schema.ts` is a change confined
 * to this file — no page or component needs to be touched.
 */

export const ARTICLES_PER_PAGE = 6;

const newestFirst = (a: Article, b: Article) =>
  Date.parse(b.publishedAt) - Date.parse(a.publishedAt);

function paginate<T>(items: T[], page: number, perPage: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    page: current,
    perPage,
    total,
    totalPages,
  };
}

export interface ArticleQuery {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  departmentSlug?: string;
  /** Omit a slug from the results, e.g. the article already on screen. */
  excludeSlug?: string;
}

export async function getArticles({
  page = 1,
  perPage = ARTICLES_PER_PAGE,
  categorySlug,
  departmentSlug,
  excludeSlug,
}: ArticleQuery = {}): Promise<Paginated<Article>> {
  const filtered = seed.articles
    .filter((article) => (categorySlug ? article.category.slug === categorySlug : true))
    .filter((article) => (departmentSlug ? article.departmentSlug === departmentSlug : true))
    .filter((article) => (excludeSlug ? article.slug !== excludeSlug : true))
    .sort(newestFirst);

  return paginate(filtered, page, perPage);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return seed.articles.find((article) => article.slug === slug) ?? null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  return seed.articles.map((article) => article.slug);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const featured = seed.articles.filter((article) => article.isFeatured).sort(newestFirst);
  return featured[0] ?? seed.articles.slice().sort(newestFirst)[0] ?? null;
}

/** Most-viewed articles, excluding whichever one is running as the lead. */
export async function getTrendingArticles(limit = 2, excludeSlug?: string): Promise<Article[]> {
  return seed.articles
    .filter((article) => (excludeSlug ? article.slug !== excludeSlug : true))
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/** Same category first, then most recent, never the article itself. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const others = seed.articles.filter((candidate) => candidate.slug !== article.slug);
  const sameCategory = others.filter((c) => c.category.slug === article.category.slug);
  const rest = others.filter((c) => c.category.slug !== article.category.slug);

  return [...sameCategory.sort(newestFirst), ...rest.sort(newestFirst)].slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return seed.categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return seed.categories.find((category) => category.slug === slug) ?? null;
}

export async function getDepartments(): Promise<Department[]> {
  return seed.departments;
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  return seed.departments.find((department) => department.slug === slug) ?? null;
}

/**
 * Events that have not finished yet, soonest first.
 *
 * `now` is injectable so pages and tests can pin it rather than depending on
 * the wall clock. If every seed event has passed, the full list is returned so
 * the homepage section never renders empty.
 */
export async function getUpcomingEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  const upcoming = seed.events
    .filter((event) => Date.parse(event.endsAt ?? event.startsAt) >= now.getTime())
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));

  const list = upcoming.length > 0 ? upcoming : seed.events.slice().sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export async function getEventBySlug(slug: string): Promise<CampusEvent | null> {
  return seed.events.find((event) => event.slug === slug) ?? null;
}

export async function getAllEventSlugs(): Promise<string[]> {
  return seed.events.map((event) => event.slug);
}
