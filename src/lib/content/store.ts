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
 * In-memory content store for the demo.
 *
 * The site is intentionally runnable with zero configuration: rather than
 * requiring a live Postgres/Supabase instance, the read API in `queries.ts`
 * and the admin CRUD actions operate on this hardcoded, seed-backed store.
 *
 * Writes (create/update/delete an article from the admin dashboard) mutate the
 * in-memory array so the demo feels fully functional within a running session.
 * Nothing here persists across a server restart — real persistence lands when
 * the Drizzle/Postgres layer in `src/db` is wired in. When that happens, only
 * this file and `queries.ts` change; every page stays exactly as it is.
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
    excerpt:
      input.content.find((block) => block.type === 'paragraph')?.text.slice(0, 180) ?? '',
    content: input.content,
    author,
    category,
    tags: [],
    isFeatured: false,
    isPublished: input.isPublished,
    publishedAt: new Date().toISOString(),
    readingMinutes: Math.max(1, Math.round(estimateWords(input.content) / 200)),
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
  existing.readingMinutes = Math.max(1, Math.round(estimateWords(input.content) / 200));

  return existing;
}

export function deleteArticleRecord(id: string): boolean {
  const index = articleStore.findIndex((article) => article.id === id);
  if (index === -1) return false;
  articleStore.splice(index, 1);
  return true;
}

function estimateWords(content: ContentBlock[]): number {
  return content.reduce((total, block) => {
    const text = 'text' in block ? block.text : '';
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
}

export { authors, categories, departments, certificateCourses, events };
