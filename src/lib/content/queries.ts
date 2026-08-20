import { getDb } from '@/db';
import { eq, desc, and, not, count } from 'drizzle-orm';
import * as schema from '@/db/schema';
import type { Article, CampusEvent, Category, CertificateCourse, Department, Paginated, ContentBlock } from './types';

export const ARTICLES_PER_PAGE = 6;

function mapArticle(row: any): Article {
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
      initials: row.author.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    },
    category: {
      id: row.category.id,
      name: row.category.name,
      slug: row.category.slug,
      description: row.category.description ?? '',
    },
    departmentSlug: row.department?.slug,
    featuredImage: row.featuredImage ?? undefined,
    tags: row.tags?.map((t: any) => ({ name: t.tag.name, slug: t.tag.slug })) ?? [],
    isFeatured: row.isFeatured,
    isPublished: row.isPublished,
    publishedAt: row.publishedAt?.toISOString() ?? new Date().toISOString(),
    readingMinutes: row.readingMinutes,
    views: row.views,
  };
}

export interface ArticleQuery {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  departmentSlug?: string;
  excludeSlug?: string;
}

export async function getArticles({
  page = 1,
  perPage = ARTICLES_PER_PAGE,
  categorySlug,
  departmentSlug,
  excludeSlug,
}: ArticleQuery = {}): Promise<Paginated<Article>> {
  const db = getDb();
  const offset = (page - 1) * perPage;
  
  // Build where conditions
  const conditions = [];
  conditions.push(eq(schema.articles.isPublished, true));
  
  if (categorySlug) {
    const category = await getCategoryBySlug(categorySlug);
    if (category) conditions.push(eq(schema.articles.categoryId, category.id));
  }
  
  if (departmentSlug) {
    const department = await getDepartmentBySlug(departmentSlug);
    if (department) conditions.push(eq(schema.articles.departmentId, department.id));
  }
  
  if (excludeSlug) {
    conditions.push(not(eq(schema.articles.slug, excludeSlug)));
  }
  
  const whereClause = and(...conditions);

  // Get total count
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(schema.articles)
    .where(whereClause);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const rows = await db.query.articles.findMany({
    where: whereClause,
    orderBy: [desc(schema.articles.publishedAt)],
    limit: perPage,
    offset,
    with: {
      author: true,
      category: true,
      department: true,
      tags: {
        with: {
          tag: true
        }
      }
    }
  });

  return {
    items: rows.map(mapArticle),
    page,
    perPage,
    total,
    totalPages,
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = getDb();
  const row = await db.query.articles.findFirst({
    where: and(eq(schema.articles.slug, slug), eq(schema.articles.isPublished, true)),
    with: {
      author: true,
      category: true,
      department: true,
      tags: {
        with: {
          tag: true
        }
      }
    }
  });

  if (!row) return null;
  return mapArticle(row);
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const db = getDb();
  const rows = await db.select({ slug: schema.articles.slug }).from(schema.articles).where(eq(schema.articles.isPublished, true));
  return rows.map((r) => r.slug);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const db = getDb();
  const row = await db.query.articles.findFirst({
    where: and(eq(schema.articles.isFeatured, true), eq(schema.articles.isPublished, true)),
    orderBy: [desc(schema.articles.publishedAt)],
    with: {
      author: true,
      category: true,
      department: true,
      tags: { with: { tag: true } }
    }
  });

  if (row) return mapArticle(row);

  // Fallback to most recent if no featured
  const fallback = await db.query.articles.findFirst({
    where: eq(schema.articles.isPublished, true),
    orderBy: [desc(schema.articles.publishedAt)],
    with: {
      author: true,
      category: true,
      department: true,
      tags: { with: { tag: true } }
    }
  });

  return fallback ? mapArticle(fallback) : null;
}

export async function getTrendingArticles(limit = 2, excludeSlug?: string): Promise<Article[]> {
  const db = getDb();
  const conditions = [eq(schema.articles.isPublished, true)];
  if (excludeSlug) conditions.push(not(eq(schema.articles.slug, excludeSlug)));

  const rows = await db.query.articles.findMany({
    where: and(...conditions),
    orderBy: [desc(schema.articles.views), desc(schema.articles.publishedAt)],
    limit,
    with: {
      author: true,
      category: true,
      department: true,
      tags: { with: { tag: true } }
    }
  });

  return rows.map(mapArticle);
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const db = getDb();
  
  // Try same category first
  const sameCategoryRows = await db.query.articles.findMany({
    where: and(
      eq(schema.articles.isPublished, true),
      not(eq(schema.articles.slug, article.slug)),
      eq(schema.articles.categoryId, article.category.id)
    ),
    orderBy: [desc(schema.articles.publishedAt)],
    limit,
    with: { author: true, category: true, department: true, tags: { with: { tag: true } } }
  });

  if (sameCategoryRows.length >= limit) {
    return sameCategoryRows.map(mapArticle);
  }

  const excludeSlugs = [article.slug, ...sameCategoryRows.map(r => r.slug)];
  
  const restConditions = [eq(schema.articles.isPublished, true)];
  for (const slug of excludeSlugs) {
    restConditions.push(not(eq(schema.articles.slug, slug)));
  }

  const otherRows = await db.query.articles.findMany({
    where: and(...restConditions),
    orderBy: [desc(schema.articles.publishedAt)],
    limit: limit - sameCategoryRows.length,
    with: { author: true, category: true, department: true, tags: { with: { tag: true } } }
  });

  return [...sameCategoryRows, ...otherRows].map(mapArticle);
}

export async function getCategories(): Promise<Category[]> {
  const db = getDb();
  const rows = await db.select().from(schema.categories);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? ''
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = getDb();
  const [row] = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug)).limit(1);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? ''
  };
}

export async function getDepartments(): Promise<Department[]> {
  const db = getDb();
  const rows = await db.select().from(schema.departments);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    abbreviation: r.abbreviation ?? undefined,
    description: r.description ?? undefined
  }));
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  const db = getDb();
  const [row] = await db.select().from(schema.departments).where(eq(schema.departments.slug, slug)).limit(1);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    abbreviation: row.abbreviation ?? undefined,
    description: row.description ?? undefined
  };
}

export async function getUsers() {
  const db = getDb();
  return await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users);
}

export async function getUpcomingEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  const db = getDb();
  const rows = await db.query.events.findMany({
    where: eq(schema.events.isPublished, true), // Filtering properly requires raw SQL for Date > now if we don't have good operators, but we can fetch and filter for simplicity or use Drizzle operators.
    // For simplicity with Drizzle and timezones, we fetch recent/upcoming and filter in JS. 
  });
  
  const upcoming = rows
    .filter(e => new Date(e.endsAt ?? e.startsAt).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    
  const list = upcoming.length > 0 ? upcoming : rows.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  
  const mapped = list.map(e => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description ?? '',
    location: e.location ?? '',
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt?.toISOString(),
    allDay: e.allDay
  }));

  return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
}

export async function getPastEvents(limit?: number, now = new Date()): Promise<CampusEvent[]> {
  const db = getDb();
  const rows = await db.query.events.findMany({
    where: eq(schema.events.isPublished, true)
  });
  
  const past = rows
    .filter(e => new Date(e.endsAt ?? e.startsAt).getTime() < now.getTime())
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
    
  const mapped = past.map(e => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description ?? '',
    location: e.location ?? '',
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt?.toISOString(),
    allDay: e.allDay
  }));

  return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
}

export async function getCertificateCourses(): Promise<CertificateCourse[]> {
  const db = getDb();
  const rows = await db.select().from(schema.certificateCourses);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug
  }));
}

export async function getEventBySlug(slug: string): Promise<CampusEvent | null> {
  const db = getDb();
  const row = await db.query.events.findFirst({
    where: and(eq(schema.events.slug, slug), eq(schema.events.isPublished, true))
  });
  
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    location: row.location ?? '',
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt?.toISOString(),
    allDay: row.allDay
  };
}

export async function getAllEventSlugs(): Promise<string[]> {
  const db = getDb();
  const rows = await db.select({ slug: schema.events.slug }).from(schema.events).where(eq(schema.events.isPublished, true));
  return rows.map(r => r.slug);
}
