'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/server'
import { roleLabels } from '@/lib/auth/demo-users'
import { addComment, toggleReaction, type ReactionKind } from '@/lib/content/engagement'

/**
 * Like/dislike an article. Signed-in users only; a signed-out request is sent
 * to the login page rather than silently doing nothing.
 */
export async function reactToArticle(formData: FormData) {
  const user = await getSessionUser()
  const slug = String(formData.get('slug') ?? '')

  if (!user) {
    redirect('/login')
  }

  const articleId = String(formData.get('articleId') ?? '')
  const reaction = String(formData.get('reaction') ?? '')

  if (articleId && (reaction === 'like' || reaction === 'dislike')) {
    toggleReaction(articleId, user.id, reaction as ReactionKind)
  }

  if (slug) revalidatePath(`/news/${slug}`)
}

/** Post a comment. Signed-in users only. */
export async function commentOnArticle(formData: FormData) {
  const user = await getSessionUser()
  const slug = String(formData.get('slug') ?? '')

  if (!user) {
    redirect('/login')
  }

  const articleId = String(formData.get('articleId') ?? '')
  const content = String(formData.get('content') ?? '').trim()

  if (articleId && content) {
    addComment({
      articleId,
      authorName: user.name,
      roleLabel: roleLabels[user.role],
      content: content.slice(0, 2000),
    })
  }

  if (slug) revalidatePath(`/news/${slug}`)
}
