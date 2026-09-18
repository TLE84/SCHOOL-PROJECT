import type { Article, CampusEvent, Category, CertificateCourse, Department, Paginated } from './types';
import * as database from './queries.db';
import * as seed from './queries.seed';
import { readWithFallback } from './source';

/**
 * Read API for the site's content.
 *
 * Every page reads through these functions and nothing else. Each one reads the
 * database when `DATABASE_URL` is set and falls back to the hardcoded seed data
 * when it is not, or when the database cannot serve the request (see
 * `source.ts`) — so the site always renders, configured or not.
 */

export const ARTICLES_PER_PAGE = 6;

export interface ArticleQuery {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  departmentSlug?: string;
  excludeSlug?: string;
  /** Admin listings: include unpublished drafts. */
  includeDrafts?: boolean;
}

export type ResolvedArticleQuery = ArticleQuery & { page: number; perPage: number };

export interface AuthorOption {
  id: string;
  name: string;
}

export interface AdminStats {
  totalArticles: number;
  publishedThisMonth: number;
  totalAuthors: number;
}

export function getArticles(query: ArticleQuery = {}): Promise<Paginated<Article>> {
  const resolved: ResolvedArticleQuery = {
    ...query,
    page: query.page ?? 1,
    perPage: query.perPage ?? ARTICLES_PER_PAGE,
  };
  return readWithFallback(
    'getArticles',
    () => database.getArticles(resolved),
    () => seed.getArticles(resolved),
  );
}

export function getArticleBySlug(slug: string): Promise<Article | null> {
  return readWithFallback(
    'getArticleBySlug',
    () => database.getArticleBySlug(slug),
    () => seed.getArticleBySlug(slug),
  );
}

/**
 * Admin-only: fetch an article by its ID, regardless of publish status.
 * Used by the admin edit page where the URL contains the article ID.
 */
export function getArticleById(id: string): Promise<Article | null> {
  return readWithFallback(
    'getArticleById',
    () => database.getArticleById(id),
    () => seed.getArticleById(id),
  );
}

export function getAllArticleSlugs(): Promise<string[]> {
  return readWithFallback('getAllArticleSlugs', database.getAllArticleSlugs, seed.getAllArticleSlugs);
}

/**
 * Search over published articles: matches the query against the title,
 * excerpt, category name and tags (case-insensitive).
 */
export function searchArticles(query: string): Promise<Article[]> {
  return readWithFallback(
    'searchArticles',
    () => database.searchArticles(query),
    () => seed.searchArticles(query),
  );
}

export function getFeaturedArticle(): Promise<Article | null> {
  return readWithFallback('getFeaturedArticle', database.getFeaturedArticle, seed.getFeaturedArticle);
}

export function getTrendingArticles(limit = 2, excludeSlug?: string): Promise<Article[]> {
  return readWithFallback(
    'getTrendingArticles',
    () => database.getTrendingArticles(limit, excludeSlug),
    () => seed.getTrendingArticles(limit, excludeSlug),
  );
}

export function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  return readWithFallback(
    'getRelatedArticles',
    () => database.getRelatedArticles(article, limit),
    () => seed.getRelatedArticles(article, limit),
  );
}

export function getCategories(): Promise<Category[]> {
  return readWithFallback('getCategories', database.getCategories, seed.getCategories);
}

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return readWithFallback(
    'getCategoryBySlug',
    () => database.getCategoryBySlug(slug),
    () => seed.getCategoryBySlug(slug),
  );
}

export function getDepartments(): Promise<Department[]> {
  return readWithFallback('getDepartments', database.getDepartments, seed.getDepartments);
}

export function getDepartmentBySlug(slug: string): Promise<Department | null> {
  return readWithFallback(
    'getDepartmentBySlug',
    () => database.getDepartmentBySlug(slug),
    () => seed.getDepartmentBySlug(slug),
  );
}

/** Options for the admin "Author" select. */
export function getUsers(): Promise<AuthorOption[]> {
  return readWithFallback('getUsers', database.getUsers, seed.getUsers);
}

/** Dashboard statistics for the admin overview page. */
export function getAdminStats(): Promise<AdminStats> {
  return readWithFallback('getAdminStats', database.getAdminStats, seed.getAdminStats);
}

export function getUpcomingEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  return readWithFallback(
    'getUpcomingEvents',
    () => database.getUpcomingEvents(limit, now),
    () => seed.getUpcomingEvents(limit, now),
  );
}

export function getPastEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  return readWithFallback(
    'getPastEvents',
    () => database.getPastEvents(limit, now),
    () => seed.getPastEvents(limit, now),
  );
}

export function getCertificateCourses(): Promise<CertificateCourse[]> {
  return readWithFallback('getCertificateCourses', database.getCertificateCourses, seed.getCertificateCourses);
}

export function getEventBySlug(slug: string): Promise<CampusEvent | null> {
  return readWithFallback(
    'getEventBySlug',
    () => database.getEventBySlug(slug),
    () => seed.getEventBySlug(slug),
  );
}

export function getAllEventSlugs(): Promise<string[]> {
  return readWithFallback('getAllEventSlugs', database.getAllEventSlugs, seed.getAllEventSlugs);
}
