'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/server'
import {
  createArticleRecord,
  updateArticleRecord,
  deleteArticleRecord,
} from '@/lib/content/store'
import type { ContentBlock } from '@/lib/content/types'

/**
 * Ensure the current user is a signed-in administrator before any mutation.
 * Throws if not — server actions surface this as an error.
 */
async function requireAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: you must be signed in as an administrator.')
  }
  return user
}

/** Turn a plain-text body (blank-line separated) into content blocks. */
function toContentBlocks(raw: string): ContentBlock[] {
  const paragraphs = raw
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
  const blocks: ContentBlock[] = paragraphs.map((text) => ({ type: 'paragraph', text }))
  return blocks.length > 0 ? blocks : [{ type: 'paragraph', text: raw }]
}

export async function createArticle(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const rawContent = formData.get('content') as string
  const isPublished = formData.get('isPublished') === 'true'
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string

  if (!title || !slug || !rawContent || !categoryId || !authorId) {
    throw new Error('Missing required fields')
  }

  createArticleRecord({
    title,
    slug,
    content: toContentBlocks(rawContent),
    isPublished,
    authorId,
    categoryId,
  })

  revalidatePath('/admin/articles')
  revalidatePath('/news')
  redirect('/admin/articles')
}

export async function updateArticle(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const rawContent = formData.get('content') as string
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string
  // Unchecked checkboxes are not submitted, so absence means false.
  const isPublished = formData.get('isPublished') === 'true'

  updateArticleRecord(id, {
    title,
    slug,
    content: toContentBlocks(rawContent),
    categoryId,
    authorId,
    isPublished,
  })

  revalidatePath('/admin/articles')
  revalidatePath('/news')
  redirect('/admin/articles')
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  deleteArticleRecord(id)

  revalidatePath('/admin/articles')
  revalidatePath('/news')
}
