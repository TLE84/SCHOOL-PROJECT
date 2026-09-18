import { isDatabaseConfigured } from '@/db';
import { syncProfile } from '@/lib/auth/profile';
import { roleLabels } from '@/lib/auth/roles';
import type { SessionUser } from '@/lib/auth/session';
import * as database from './engagement.db';
import * as memory from './engagement.seed';
import { assertDatabaseWritable, isUuid, readWithFallback } from './source';

/**
 * Likes, dislikes and comments on articles.
 *
 * Database-backed when `DATABASE_URL` is set, in-memory otherwise. Articles
 * from the database have UUID ids; seed articles (served when no database is
 * configured, or as a fallback) have ids like `art-…`, and their engagement
 * always comes from the in-memory store — so a fallback page stays consistent.
 */

export type ReactionKind = 'like' | 'dislike';

export interface CommentView {
  id: string;
  articleId: string;
  authorName: string;
  authorInitials: string;
  roleLabel: string;
  content: string;
  createdAt: string;
}

export interface ReactionSummary {
  likes: number;
  dislikes: number;
  userReaction: ReactionKind | null;
}

function inDatabase(articleId: string): boolean {
  return isDatabaseConfigured() && isUuid(articleId);
}

export function getReactionSummary(articleId: string, userId?: string): Promise<ReactionSummary> {
  if (!inDatabase(articleId)) return Promise.resolve(memory.getReactionSummary(articleId, userId));
  return readWithFallback(
    'getReactionSummary',
    () => database.getReactionSummary(articleId, userId),
    () => memory.getReactionSummary(articleId, userId),
  );
}

export function getComments(articleId: string): Promise<CommentView[]> {
  if (!inDatabase(articleId)) return Promise.resolve(memory.getComments(articleId));
  return readWithFallback(
    'getComments',
    () => database.getComments(articleId),
    () => memory.getComments(articleId),
  );
}

export async function toggleReaction(articleId: string, user: SessionUser, kind: ReactionKind): Promise<void> {
  if (!inDatabase(articleId)) {
    memory.toggleReaction(articleId, user.id, kind);
    return;
  }
  assertDatabaseWritable();
  // Reactions reference public.user, so make sure this account has its row.
  await syncProfile(user);
  await database.toggleReaction(articleId, user.id, kind);
}

export async function addComment(articleId: string, user: SessionUser, content: string): Promise<void> {
  if (!inDatabase(articleId)) {
    memory.addComment({ articleId, authorName: user.name, roleLabel: roleLabels[user.role], content });
    return;
  }
  assertDatabaseWritable();
  await syncProfile(user);
  await database.addComment(articleId, user.id, content);
}
