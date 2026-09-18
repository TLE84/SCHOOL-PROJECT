import type { Article, CampusEvent, Category, CertificateCourse, Department, Paginated } from './types';
import type { AdminStats, AuthorOption, ResolvedArticleQuery } from './queries';
import {
  listArticles,
  findArticleBySlug,
  findArticleById,
  authors,
  categories as allCategories,
  departments as allDepartments,
  certificateCourses as allCertificateCourses,
  events as allEvents,
} from './store';

/**
 * Seed-backed implementations of the read API in `queries.ts`.
 *
 * These read the in-memory store in `store.ts`. They serve every read when
 * `DATABASE_URL` is unset, and are the fallback whenever a database read
 * fails — see `source.ts`.
 */

const byPublishedDesc = (a: Article, b: Article) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export async function getArticles({
  page,
  perPage,
  categorySlug,
  departmentSlug,
  excludeSlug,
  includeDrafts,
}: ResolvedArticleQuery): Promise<Paginated<Article>> {
  let items = includeDrafts ? listArticles() : listArticles().filter((article) => article.isPublished);

  if (categorySlug) {
    items = items.filter((article) => article.category.slug === categorySlug);
  }
  if (departmentSlug) {
    items = items.filter((article) => article.departmentSlug === departmentSlug);
  }
  if (excludeSlug) {
    items = items.filter((article) => article.slug !== excludeSlug);
  }

  items = [...items].sort(byPublishedDesc);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const offset = (page - 1) * perPage;

  return {
    items: items.slice(offset, offset + perPage),
    page,
    perPage,
    total,
    totalPages,
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = findArticleBySlug(slug);
  return article && article.isPublished ? article : null;
}

/**
 * Admin-only: fetch an article by its ID, regardless of publish status.
 * Used by the admin edit page where the URL contains the article ID.
 */
export async function getArticleById(id: string): Promise<Article | null> {
  return findArticleById(id) ?? null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  return listArticles()
    .filter((article) => article.isPublished)
    .map((article) => article.slug);
}

/**
 * Full-text-ish search over published articles: matches the query against the
 * title, excerpt, category name and tags (case-insensitive).
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return listArticles()
    .filter((article) => {
      if (!article.isPublished) return false;
      const haystack = [
        article.title,
        article.excerpt,
        article.category.name,
        ...article.tags.map((tag) => tag.name),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    })
    .sort(byPublishedDesc);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const published = listArticles()
    .filter((article) => article.isPublished)
    .sort(byPublishedDesc);

  const featured = published.find((article) => article.isFeatured);
  return featured ?? published[0] ?? null;
}

export async function getTrendingArticles(limit = 2, excludeSlug?: string): Promise<Article[]> {
  return listArticles()
    .filter((article) => article.isPublished && article.slug !== excludeSlug)
    .sort((a, b) => b.views - a.views || byPublishedDesc(a, b))
    .slice(0, limit);
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const others = listArticles()
    .filter((candidate) => candidate.isPublished && candidate.slug !== article.slug)
    .sort(byPublishedDesc);

  const sameCategory = others.filter((candidate) => candidate.category.id === article.category.id);
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const rest = others.filter((candidate) => candidate.category.id !== article.category.id);
  return [...sameCategory, ...rest].slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return allCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return allCategories.find((category) => category.slug === slug) ?? null;
}

export async function getDepartments(): Promise<Department[]> {
  return allDepartments;
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  return allDepartments.find((department) => department.slug === slug) ?? null;
}

export async function getUsers(): Promise<AuthorOption[]> {
  return Object.values(authors).map((author) => ({ id: author.id, name: author.name }));
}

export async function getAdminStats(): Promise<AdminStats> {
  const articles = listArticles();
  const published = articles.filter((article) => article.isPublished);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const publishedThisMonth = published.filter(
    (article) => new Date(article.publishedAt) >= startOfMonth,
  ).length;

  return {
    totalArticles: articles.length,
    publishedThisMonth,
    totalAuthors: Object.keys(authors).length,
  };
}

export async function getUpcomingEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  const upcoming = allEvents
    .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const list =
    upcoming.length > 0
      ? upcoming
      : [...allEvents].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export async function getPastEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  const past = allEvents
    .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() < now.getTime())
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  return typeof limit === 'number' ? past.slice(0, limit) : past;
}

export async function getCertificateCourses(): Promise<CertificateCourse[]> {
  return allCertificateCourses;
}

export async function getEventBySlug(slug: string): Promise<CampusEvent | null> {
  return allEvents.find((event) => event.slug === slug) ?? null;
}

export async function getAllEventSlugs(): Promise<string[]> {
  return allEvents.map((event) => event.slug);
}
