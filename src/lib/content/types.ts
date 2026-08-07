/**
 * View models for the site's content.
 *
 * These mirror the tables in `src/db/schema.ts` but arrive denormalised — an
 * Article carries its author, category and tags rather than foreign keys — so
 * pages never join anything themselves. When the Drizzle queries land, only
 * `queries.ts` changes; every page consuming these types stays as it is.
 */

export interface Author {
  id: string;
  name: string;
  /** Job title, e.g. "Campus Correspondent". */
  role: string;
  bio: string;
  /** Rendered in the avatar circle until real images exist. */
  initials: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  /** Institute shorthand, e.g. "CSIT". Shown alongside the full name. */
  abbreviation?: string;
  /**
   * Optional: no prose has been supplied for these departments yet, and
   * inventing it would put made-up claims on real academic units.
   */
  description?: string;
}

export interface Tag {
  name: string;
  slug: string;
}

/**
 * Article bodies are stored as blocks rather than an HTML blob. Headings carry
 * an `id`, which is what lets the article page build a real table of contents
 * with working anchors.
 */
export type ContentBlock =
  | { type: 'heading'; id: string; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; attribution: string }
  /**
   * Editorial apparatus set apart from the reporting — an editor's note,
   * correction, or right-of-reply statement. Rendered as a labelled callout
   * so readers do not mistake it for the story itself.
   */
  | { type: 'note'; label: string; text: string };

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  author: Author;
  category: Category;
  departmentSlug?: string;
  featuredImage?: string;
  tags: Tag[];
  isFeatured: boolean;
  /** ISO 8601. Formatted at render time via `formatDate`. */
  publishedAt: string;
  readingMinutes: number;
  views: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  /** ISO 8601. */
  startsAt: string;
  /** ISO 8601. For multi-day events this is the closing day. */
  endsAt?: string;
  /**
   * No published start/end time. The card shows the date (or date range)
   * instead of hours, rather than inventing a schedule.
   */
  allDay?: boolean;
}

/** Short certificate programmes offered alongside the academic departments. */
export interface CertificateCourse {
  id: string;
  name: string;
  slug: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
