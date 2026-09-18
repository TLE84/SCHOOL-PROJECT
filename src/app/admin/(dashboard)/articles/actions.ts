'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/server'
import { deleteArticleById, insertArticle, updateArticleById } from '@/lib/content/mutations'
import { markupToBlocks } from '@/lib/content/markup'

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

export async function createArticle(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const rawContent = formData.get('content') as string
  const isPublished = formData.get('isPublished') === 'true'
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string
  const featuredImage = ((formData.get('featuredImage') as string) ?? '').trim()

  if (!title || !slug || !rawContent || !categoryId || !authorId) {
    throw new Error('Missing required fields')
  }

  await insertArticle({
    title,
    slug,
    content: markupToBlocks(rawContent),
    isPublished,
    authorId,
    categoryId,
    featuredImage,
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
  const featuredImage = ((formData.get('featuredImage') as string) ?? '').trim()
  // Unchecked checkboxes are not submitted, so absence means false.
  const isPublished = formData.get('isPublished') === 'true'

  await updateArticleById(id, {
    title,
    slug,
    content: markupToBlocks(rawContent),
    categoryId,
    authorId,
    isPublished,
    featuredImage,
  })

  revalidatePath('/admin/articles')
  revalidatePath('/news')
  redirect('/admin/articles')
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  await deleteArticleById(id)

  revalidatePath('/admin/articles')
  revalidatePath('/news')
}
