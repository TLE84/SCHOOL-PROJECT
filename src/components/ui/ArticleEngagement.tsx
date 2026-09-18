import Link from 'next/link'
import { ThumbsUp, ThumbsDown, MessageCircle, Lock } from 'lucide-react'
import { reactToArticle, commentOnArticle } from '@/app/(site)/news/[slug]/actions'
import type { CommentView, ReactionSummary } from '@/lib/content/engagement'
import { formatDate } from '@/lib/format'

interface ArticleEngagementProps {
  articleId: string
  slug: string
  reactions: ReactionSummary
  comments: CommentView[]
  /** Signed-in viewer's display name, or null when signed out. */
  signedIn: boolean
}

export function ArticleEngagement({
  articleId,
  slug,
  reactions,
  comments,
  signedIn,
}: ArticleEngagementProps) {
  return (
    <section aria-labelledby="engagement-heading" className="not-prose border-t border-slate-200 pt-12 font-sans">
      <h2 id="engagement-heading" className="sr-only">
        Reader engagement
      </h2>

      {/* Reactions */}
      <div className="flex flex-wrap items-center gap-4">
        {signedIn ? (
          <>
            <ReactionButton
              articleId={articleId}
              slug={slug}
              kind="like"
              count={reactions.likes}
              active={reactions.userReaction === 'like'}
            />
            <ReactionButton
              articleId={articleId}
              slug={slug}
              kind="dislike"
              count={reactions.dislikes}
              active={reactions.userReaction === 'dislike'}
            />
          </>
        ) : (
          <>
            <GatedReaction kind="like" count={reactions.likes} />
            <GatedReaction kind="dislike" count={reactions.dislikes} />
            <span className="text-sm text-slate-500">
              <Link href="/login" className="font-semibold text-green-700 hover:underline">
                Sign in
              </Link>{' '}
              to react.
            </span>
          </>
        )}
      </div>

      {/* Comments */}
      <div className="mt-12">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <MessageCircle size={20} className="text-green-700" aria-hidden="true" />
          Comments
          <span className="text-slate-400">({comments.length})</span>
        </h3>

        {signedIn ? (
          <form action={commentOnArticle} className="mt-6">
            <input type="hidden" name="articleId" value={articleId} />
            <input type="hidden" name="slug" value={slug} />
            <label htmlFor="comment-content" className="sr-only">
              Add a comment
            </label>
            <textarea
              id="comment-content"
              name="content"
              required
              rows={3}
              placeholder="Share your thoughts…"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
              >
                Post comment
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-slate-600">
              <Lock size={16} className="text-slate-400" aria-hidden="true" />
              Sign in to like, dislike and join the conversation.
            </p>
            <div className="flex shrink-0 gap-3">
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-green-600 hover:text-green-700"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800"
              >
                Create account
              </Link>
            </div>
          </div>
        )}

        <ul className="mt-8 space-y-6">
          {comments.length === 0 ? (
            <li className="text-slate-500">No comments yet. Be the first to share your thoughts.</li>
          ) : (
            comments.map((comment) => (
              <li key={comment.id} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500"
                >
                  {comment.authorInitials}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{comment.authorName}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {comment.roleLabel}
                    </span>
                    <time dateTime={comment.createdAt} className="text-xs text-slate-400">
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1 text-slate-700">{comment.content}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  )
}

function ReactionButton({
  articleId,
  slug,
  kind,
  count,
  active,
}: {
  articleId: string
  slug: string
  kind: 'like' | 'dislike'
  count: number
  active: boolean
}) {
  const Icon = kind === 'like' ? ThumbsUp : ThumbsDown
  const activeClass =
    kind === 'like'
      ? 'border-green-600 bg-green-50 text-green-700'
      : 'border-red-500 bg-red-50 text-red-600'

  return (
    <form action={reactToArticle}>
      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="reaction" value={kind} />
      <button
        type="submit"
        aria-pressed={active}
        aria-label={kind === 'like' ? 'Like this article' : 'Dislike this article'}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          active ? activeClass : 'border-slate-300 text-slate-600 hover:border-slate-400'
        }`}
      >
        <Icon size={18} aria-hidden="true" />
        {count}
      </button>
    </form>
  )
}

function GatedReaction({ kind, count }: { kind: 'like' | 'dislike'; count: number }) {
  const Icon = kind === 'like' ? ThumbsUp : ThumbsDown
  return (
    <Link
      href="/login"
      aria-label={kind === 'like' ? 'Sign in to like this article' : 'Sign in to dislike this article'}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-400"
    >
      <Icon size={18} aria-hidden="true" />
      {count}
    </Link>
  )
}
