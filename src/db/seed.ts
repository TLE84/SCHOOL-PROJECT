import { and, eq, inArray, isNotNull } from 'drizzle-orm';
import { getDb } from './index';
import * as schema from './schema';
import * as seedData from '../lib/content/seed';

/**
 * Load the hardcoded seed content (src/lib/content/seed.ts) into the database.
 *
 * Idempotent: every insert is keyed on a natural unique column (slug or email)
 * and skips rows that already exist, so re-running never duplicates content
 * and never overwrites anything edited since. Run with `npm run db:seed` after
 * `npm run db:migrate`.
 */

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

const db = getDb();

/** Insert rows keyed by slug (skipping existing ones) and return slug → id. */
async function upsertBySlug<T extends { slug: string }>(
  table: typeof schema.categories | typeof schema.departments | typeof schema.tags | typeof schema.certificateCourses,
  rows: T[],
): Promise<Map<string, string>> {
  if (rows.length > 0) {
    await db.insert(table).values(rows as never).onConflictDoNothing({ target: table.slug });
  }
  const existing = await db
    .select({ id: table.id, slug: table.slug })
    .from(table)
    .where(inArray(table.slug, rows.map((row) => row.slug)));
  return new Map(existing.map((row) => [row.slug, row.id]));
}

async function seed() {
  console.log('Seeding database...');

  // 1. Authors. If a sign-in account with the author's name already exists
  //    (e.g. from `npm run auth:seed-users`), credit their articles to it
  //    rather than creating a second profile for the same person. Otherwise
  //    create a byline-only profile — no account, no role — whose `.invalid`
  //    address (reserved, never deliverable) can never clash with a sign-up.
  const authorIds = new Map<string, string>();
  for (const author of Object.values(seedData.authors)) {
    const [account] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(and(eq(schema.users.name, author.name), isNotNull(schema.users.role)))
      .limit(1);
    if (account) {
      authorIds.set(author.id, account.id);
      continue;
    }

    await db
      .insert(schema.users)
      .values({
        id: author.id,
        name: author.name,
        email: `${author.id}@bylines.invalid`,
        emailVerified: false,
        jobTitle: author.role,
        bio: author.bio,
      })
      .onConflictDoNothing();
    authorIds.set(author.id, author.id);
  }
  console.log(`  authors: ${authorIds.size}`);

  // 2. Taxonomy.
  const categoryIds = await upsertBySlug(
    schema.categories,
    seedData.categories.map(({ name, slug, description }) => ({ name, slug, description })),
  );
  const departmentIds = await upsertBySlug(
    schema.departments,
    seedData.departments.map(({ name, slug, abbreviation, description }) => ({
      name,
      slug,
      abbreviation,
      description,
    })),
  );
  await upsertBySlug(
    schema.certificateCourses,
    seedData.certificateCourses.map(({ name, slug }) => ({ name, slug })),
  );
  const allTags = [
    ...new Map(seedData.articles.flatMap((a) => a.tags).map((tag) => [tag.slug, tag])).values(),
  ];
  const tagIds = await upsertBySlug(schema.tags, allTags);
  console.log(
    `  categories: ${categoryIds.size}, departments: ${departmentIds.size}, tags: ${tagIds.size}, certificate courses: ${seedData.certificateCourses.length}`,
  );

  // 3. Articles, then their tags.
  for (const article of seedData.articles) {
    const categoryId = categoryIds.get(article.category.slug);
    if (!categoryId) throw new Error(`No category for ${article.slug}`);

    await db
      .insert(schema.articles)
      .values({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        authorId: authorIds.get(article.author.id)!,
        categoryId,
        departmentId: article.departmentSlug ? departmentIds.get(article.departmentSlug) : null,
        featuredImage: article.featuredImage,
        isPublished: article.isPublished,
        isFeatured: article.isFeatured,
        views: article.views,
        readingMinutes: article.readingMinutes,
        publishedAt: new Date(article.publishedAt),
      })
      .onConflictDoNothing({ target: schema.articles.slug });
  }

  const articleRows = await db
    .select({ id: schema.articles.id, slug: schema.articles.slug })
    .from(schema.articles)
    .where(inArray(schema.articles.slug, seedData.articles.map((a) => a.slug)));
  const articleIds = new Map(articleRows.map((row) => [row.slug, row.id]));

  const articleTagRows = seedData.articles.flatMap((article) =>
    article.tags.map((tag) => ({
      articleId: articleIds.get(article.slug)!,
      tagId: tagIds.get(tag.slug)!,
    })),
  );
  if (articleTagRows.length > 0) {
    await db.insert(schema.articleTags).values(articleTagRows).onConflictDoNothing();
  }
  console.log(`  articles: ${articleIds.size}`);

  // 4. Events.
  await db
    .insert(schema.events)
    .values(
      seedData.events.map((event) => ({
        title: event.title,
        slug: event.slug,
        description: event.description,
        location: event.location,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        allDay: event.allDay ?? false,
        isPublished: true,
      })),
    )
    .onConflictDoNothing({ target: schema.events.slug });
  console.log(`  events: ${seedData.events.length}`);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
