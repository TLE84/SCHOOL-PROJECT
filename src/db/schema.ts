import { pgTable, text, timestamp, uuid, varchar, boolean, primaryKey, integer, jsonb, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

/*
 * Every table enables row-level security with no policies. The app reaches
 * Postgres directly (Drizzle over the pooler, as the table owner), so RLS does
 * not affect it — but Supabase also exposes the public schema through its Data
 * API to anyone holding the publishable key, which ships to the browser. With
 * RLS on and no policies, that API can neither read nor write these tables.
 */

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // reader, author, editor, administrator
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS();

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  roleId: uuid('role_id').references(() => roles.id),
  /**
   * Mirror of the Supabase Auth account's `app_metadata.role` (admin, lecturer,
   * student), kept for joins such as comment role labels. Null for byline-only
   * profiles that have no sign-in account. Auth decisions never read this —
   * they use the verified session.
   */
  role: varchar('role', { length: 20 }),
  jobTitle: varchar('job_title', { length: 100 }), // Added for UI
  bio: text('bio'), // Added for UI
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
}).enableRLS();

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id)
}).enableRLS();

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password")
}).enableRLS();

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt")
}).enableRLS();

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  abbreviation: varchar('abbreviation', { length: 20 }), // Added
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS();

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS();

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS();

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  location: varchar('location', { length: 255 }),
  startsAt: timestamp('starts_at').notNull(),
  endsAt: timestamp('ends_at'),
  allDay: boolean('all_day').default(false).notNull(), // Added
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}).enableRLS();

export const certificateCourses = pgTable('certificate_courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
}).enableRLS();

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: jsonb('content').notNull(), // Changed from text to jsonb
  excerpt: text('excerpt'),
  authorId: text('author_id').references(() => users.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  departmentId: uuid('department_id').references(() => departments.id),
  featuredImage: text('featured_image'),
  isPublished: boolean('is_published').default(false).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  views: integer('views').default(0).notNull(), // Added
  readingMinutes: integer('reading_minutes').default(1).notNull(), // Added
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}).enableRLS();

export const articleTags = pgTable('article_tags', {
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [
  primaryKey({ columns: [t.articleId, t.tagId] }),
]).enableRLS();

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(), // image, video, document
  uploaderId: text('uploader_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS();

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  authorId: text('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  isApproved: boolean('is_approved').default(true).notNull(), // Auto approve by default, or change based on policy
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS();

/** One like or dislike per user per article; re-reacting replaces the row. */
export const articleReactions = pgTable('article_reactions', {
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  kind: varchar('kind', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.articleId, t.userId] }),
  check('article_reactions_kind_check', sql`${t.kind} in ('like', 'dislike')`),
]).enableRLS();

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  /** Stored lower-cased, so the unique constraint is case-insensitive. */
  email: varchar('email', { length: 320 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS();

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  articles: many(articles),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  articleTags: many(articleTags),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  department: one(departments, {
    fields: [articles.departmentId],
    references: [departments.id],
  }),
  tags: many(articleTags),
  comments: many(comments),
  reactions: many(articleReactions),
}));

export const articleReactionsRelations = relations(articleReactions, ({ one }) => ({
  article: one(articles, {
    fields: [articleReactions.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [articleReactions.userId],
    references: [users.id],
  }),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));
