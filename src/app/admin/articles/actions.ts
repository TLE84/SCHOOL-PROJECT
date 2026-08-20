'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getDb } from '@/db'
import { articles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Verify the current user is authenticated before performing any mutation.
 * Throws an error if no valid session exists.
 */
async function requireAuth() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized: you must be signed in to perform this action.')
  }
  return user
}

export async function createArticle(formData: FormData) {
  await requireAuth()
  const db = getDb()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const rawContent = formData.get('content') as string
  const content = [{ type: 'paragraph', text: rawContent }]
  const isPublished = formData.get('isPublished') === 'true'
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string

  if (!title || !slug || !rawContent || !categoryId || !authorId) {
    throw new Error("Missing required fields")
  }

  await db.insert(articles).values({
    title,
    slug,
    content,
    isPublished,
    authorId, 
    categoryId,
  })

  revalidatePath('/admin/articles')
  redirect('/admin/articles')
}

export async function updateArticle(formData: FormData) {
  await requireAuth()
  const db = getDb()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const rawContent = formData.get('content') as string
  const content = [{ type: 'paragraph', text: rawContent }]
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string
  // Unchecked checkboxes are not submitted, so absence means false
  const isPublished = formData.get('isPublished') === 'true'

  await db.update(articles).set({
    title,
    slug,
    content,
    categoryId,
    authorId,
    isPublished,
  }).where(eq(articles.id, id))

  revalidatePath('/admin/articles')
  redirect('/admin/articles')
}

export async function deleteArticle(formData: FormData) {
  await requireAuth()
  const db = getDb()

  const id = formData.get('id') as string

  await db.delete(articles).where(eq(articles.id, id))

  revalidatePath('/admin/articles')
}
