import { and, desc, eq, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { articleReactions, comments, users } from '@/db/schema';
import { isUserRole, roleLabels } from '@/lib/auth/roles';
import type { CommentView, ReactionKind, ReactionSummary } from './engagement';

/** Database-backed likes, dislikes and comments. Callers go through `engagement.ts`. */

export async function getReactionSummary(articleId: string, userId?: string): Promise<ReactionSummary> {
  const [row] = await getDb()
    .select({
      likes: sql<number>`count(*) filter (where ${articleReactions.kind} = 'like')`.mapWith(Number),
      dislikes: sql<number>`count(*) filter (where ${articleReactions.kind} = 'dislike')`.mapWith(Number),
      userReaction: userId
        ? sql<string | null>`max(${articleReactions.kind}) filter (where ${articleReactions.userId} = ${userId})`
        : sql<null>`null`,
    })
    .from(articleReactions)
    .where(eq(articleReactions.articleId, articleId));

  const mine = row?.userReaction;
  return {
    likes: row?.likes ?? 0,
    dislikes: row?.dislikes ?? 0,
    userReaction: mine === 'like' || mine === 'dislike' ? mine : null,
  };
}

/** Re-selecting the same reaction clears it; choosing the other one switches. */
export async function toggleReaction(articleId: string, userId: string, kind: ReactionKind): Promise<void> {
  const db = getDb();
  const cleared = await db
    .delete(articleReactions)
    .where(
      and(
        eq(articleReactions.articleId, articleId),
        eq(articleReactions.userId, userId),
        eq(articleReactions.kind, kind),
      ),
    )
    .returning({ kind: articleReactions.kind });

  if (cleared.length > 0) return;

  await db
    .insert(articleReactions)
    .values({ articleId, userId, kind })
    .onConflictDoUpdate({
      target: [articleReactions.articleId, articleReactions.userId],
      set: { kind, createdAt: new Date() },
    });
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export async function getComments(articleId: string): Promise<CommentView[]> {
  const rows = await getDb()
    .select({
      id: comments.id,
      articleId: comments.articleId,
      content: comments.content,
      createdAt: comments.createdAt,
      authorName: users.name,
      authorRole: users.role,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.authorId))
    .where(and(eq(comments.articleId, articleId), eq(comments.isApproved, true)))
    .orderBy(desc(comments.createdAt));

  return rows.map((row) => ({
    id: row.id,
    articleId: row.articleId,
    authorName: row.authorName,
    authorInitials: initials(row.authorName),
    roleLabel: isUserRole(row.authorRole) ? roleLabels[row.authorRole] : 'Reader',
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function addComment(articleId: string, authorId: string, content: string): Promise<void> {
  await getDb().insert(comments).values({ articleId, authorId, content });
}
