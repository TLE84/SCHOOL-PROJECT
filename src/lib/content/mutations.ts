import { eq, sql } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '@/db';
import { articles } from '@/db/schema';
import { assertDatabaseWritable } from './source';
import {
  createArticleRecord,
  deleteArticleRecord,
  deriveExcerpt,
  estimateReadingMinutes,
  updateArticleRecord,
  type ArticleInput,
} from './store';

/**
 * Article writes for the admin dashboard.
 *
 * With a database configured these write to it — and fail loudly if it is
 * down, rather than quietly editing the in-memory seed copy that a serverless
 * host would throw away. Without one they edit the in-memory store, as the
 * zero-config demo always has.
 */

export type { ArticleInput };

export async function insertArticle(input: ArticleInput): Promise<void> {
  if (!isDatabaseConfigured()) {
    createArticleRecord(input);
    return;
  }

  assertDatabaseWritable();
  await getDb()
    .insert(articles)
    .values({
      title: input.title,
      slug: input.slug,
      content: input.content,
      excerpt: deriveExcerpt(input.content) ?? '',
      readingMinutes: estimateReadingMinutes(input.content),
      categoryId: input.categoryId,
      authorId: input.authorId,
      featuredImage: input.featuredImage || null,
      isPublished: input.isPublished,
      publishedAt: input.isPublished ? new Date() : null,
    });
}

export async function updateArticleById(id: string, input: ArticleInput): Promise<void> {
  if (!isDatabaseConfigured()) {
    updateArticleRecord(id, input);
    return;
  }

  assertDatabaseWritable();
  const excerpt = deriveExcerpt(input.content);
  await getDb()
    .update(articles)
    .set({
      title: input.title,
      slug: input.slug,
      content: input.content,
      ...(excerpt !== undefined && { excerpt }),
      readingMinutes: estimateReadingMinutes(input.content),
      categoryId: input.categoryId,
      authorId: input.authorId,
      featuredImage: input.featuredImage || null,
      isPublished: input.isPublished,
      // First publish stamps the date; later edits and unpublishing keep it.
      publishedAt: input.isPublished
        ? sql`coalesce(${articles.publishedAt}, now())`
        : sql`${articles.publishedAt}`,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id));
}

export async function deleteArticleById(id: string): Promise<void> {
  if (!isDatabaseConfigured()) {
    deleteArticleRecord(id);
    return;
  }

  assertDatabaseWritable();
  // Tags, comments and reactions go with it (ON DELETE CASCADE).
  await getDb().delete(articles).where(eq(articles.id, id));
}
