import type { Article, ContentBlock } from './types';
import {
  articles as seedArticles,
  authors,
  categories,
  departments,
  certificateCourses,
  events,
} from './seed';

/**
 * In-memory content store — the seed-data fallback.
 *
 * Backs `queries.seed.ts` and the admin writes in `mutations.ts` when no
 * `DATABASE_URL` is configured, so the site still runs with zero setup; reads
 * also fall back to it when the database is unreachable (see `source.ts`).
 *
 * Writes mutate the in-memory array so the demo feels fully functional within
 * a running session. Nothing here persists across a server restart — with a
 * database configured, writes go there instead.
 */

// A mutable working copy so admin edits never mutate the frozen seed export.
const articleStore: Article[] = seedArticles.map((article) => ({ ...article }));

export function listArticles(): Article[] {
  return articleStore;
}

export function findArticleBySlug(slug: string): Article | undefined {
  return articleStore.find((article) => article.slug === slug);
}

export function findArticleById(id: string): Article | undefined {
  return articleStore.find((article) => article.id === id);
}

export interface ArticleInput {
  title: string;
  slug: string;
  content: ContentBlock[];
  categoryId: string;
  authorId: string;
  isPublished: boolean;
  featuredImage?: string;
}

export function createArticleRecord(input: ArticleInput): Article {
  const category = categories.find((c) => c.id === input.categoryId);
  if (!category) throw new Error(`Unknown category: ${input.categoryId}`);

  const author = Object.values(authors).find((a) => a.id === input.authorId);
  if (!author) throw new Error(`Unknown author: ${input.authorId}`);

  const article: Article = {
    id: `art-${Date.now()}`,
    title: input.title,
    slug: input.slug,
    excerpt: deriveExcerpt(input.content) ?? '',
    content: input.content,
    author,
    category,
    featuredImage: input.featuredImage || undefined,
    tags: [],
    isFeatured: false,
    isPublished: input.isPublished,
    publishedAt: new Date().toISOString(),
    readingMinutes: estimateReadingMinutes(input.content),
    views: 0,
  };

  articleStore.unshift(article);
  return article;
}

export function updateArticleRecord(id: string, input: ArticleInput): Article | undefined {
  const existing = findArticleById(id);
  if (!existing) return undefined;

  const category = categories.find((c) => c.id === input.categoryId) ?? existing.category;
  const author = Object.values(authors).find((a) => a.id === input.authorId) ?? existing.author;

  existing.title = input.title;
  existing.slug = input.slug;
  existing.content = input.content;
  existing.category = category;
  existing.author = author;
  existing.isPublished = input.isPublished;
  existing.readingMinutes = estimateReadingMinutes(input.content);
  existing.excerpt = deriveExcerpt(input.content) ?? existing.excerpt;
  if (input.featuredImage !== undefined) {
    existing.featuredImage = input.featuredImage || undefined;
  }

  return existing;
}

export function deleteArticleRecord(id: string): boolean {
  const index = articleStore.findIndex((article) => article.id === id);
  if (index === -1) return false;
  articleStore.splice(index, 1);
  return true;
}

/** The first paragraph, trimmed to card length — or undefined if there is none. */
export function deriveExcerpt(content: ContentBlock[]): string | undefined {
  return content.find((block) => block.type === 'paragraph')?.text.slice(0, 180);
}

/** Roughly 200 words a minute, never less than one. */
export function estimateReadingMinutes(content: ContentBlock[]): number {
  const words = content.reduce((total, block) => {
    const text = 'text' in block ? block.text : '';
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

export { authors, categories, departments, certificateCourses, events };
