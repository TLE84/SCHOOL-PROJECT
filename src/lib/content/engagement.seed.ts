import type { CommentView, ReactionKind, ReactionSummary } from './engagement';

/**
 * In-memory likes, dislikes and comments — the fallback for `engagement.ts`.
 *
 * Mirrors the seed-backed content store: interactions live for the life of the
 * running server and reset on restart. Used when no database is configured, or
 * for seed articles served while the database is unreachable. Reactions are
 * keyed by user id so a signed-in user can toggle their own like/dislike; a
 * small seeded baseline makes the counts look alive in the demo.
 */

interface ReactionRecord {
  baseLikes: number;
  baseDislikes: number;
  likeUsers: Set<string>;
  dislikeUsers: Set<string>;
}

const reactions = new Map<string, ReactionRecord>();
const comments = new Map<string, CommentView[]>();

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function record(articleId: string): ReactionRecord {
  let rec = reactions.get(articleId);
  if (!rec) {
    rec = { baseLikes: 0, baseDislikes: 0, likeUsers: new Set(), dislikeUsers: new Set() };
    reactions.set(articleId, rec);
  }
  return rec;
}

export function getReactionSummary(articleId: string, userId?: string): ReactionSummary {
  const rec = reactions.get(articleId);
  if (!rec) return { likes: 0, dislikes: 0, userReaction: null };
  return {
    likes: rec.baseLikes + rec.likeUsers.size,
    dislikes: rec.baseDislikes + rec.dislikeUsers.size,
    userReaction: userId
      ? rec.likeUsers.has(userId)
        ? 'like'
        : rec.dislikeUsers.has(userId)
          ? 'dislike'
          : null
      : null,
  };
}

/** Toggle a user's reaction. Re-selecting the same reaction clears it. */
export function toggleReaction(articleId: string, userId: string, kind: ReactionKind): void {
  const rec = record(articleId);
  const [chosen, other] =
    kind === 'like' ? [rec.likeUsers, rec.dislikeUsers] : [rec.dislikeUsers, rec.likeUsers];

  if (chosen.has(userId)) {
    chosen.delete(userId);
  } else {
    chosen.add(userId);
    other.delete(userId);
  }
}

export function getComments(articleId: string): CommentView[] {
  return [...(comments.get(articleId) ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getCommentCount(articleId: string): number {
  return comments.get(articleId)?.length ?? 0;
}

export function addComment(input: {
  articleId: string;
  authorName: string;
  roleLabel: string;
  content: string;
}): CommentView {
  const comment: CommentView = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    articleId: input.articleId,
    authorName: input.authorName,
    authorInitials: initials(input.authorName),
    roleLabel: input.roleLabel,
    content: input.content,
    createdAt: new Date().toISOString(),
  };
  const list = comments.get(input.articleId) ?? [];
  list.push(comment);
  comments.set(input.articleId, list);
  return comment;
}

// --- Seed a little baseline so the demo isn't empty ---

function seedReactions(articleId: string, likes: number, dislikes: number) {
  const rec = record(articleId);
  rec.baseLikes = likes;
  rec.baseDislikes = dislikes;
}

seedReactions('art-matriculation-2026', 42, 3);
seedReactions('art-innovation-hub', 28, 1);
seedReactions('art-src-suspends-sug-president', 15, 7);
seedReactions('art-tech-competition', 19, 0);

addComment({
  articleId: 'art-matriculation-2026',
  authorName: 'Dr. Samuel E. Onoji',
  roleLabel: 'Lecturer',
  content: 'Congratulations to all our new students. Welcome to the institute!',
});
addComment({
  articleId: 'art-innovation-hub',
  authorName: 'Blessing Okowa',
  roleLabel: 'Student',
  content: 'This is fantastic — can’t wait to book time in the new hub.',
});
