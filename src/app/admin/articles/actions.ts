'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// In a full implementation, we'd import db and schema to insert records
import { getDb } from '@/db'
import { articles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createArticle(formData: FormData) {
  const db = getDb()
  // Extract data
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const rawContent = formData.get('content') as string
  const content = [{ type: 'paragraph', text: rawContent }]
  const isPublished = formData.get('isPublished') === 'true'
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string

  // Validate inputs
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
  const db = getDb()
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const rawContent = formData.get('content') as string
  const content = [{ type: 'paragraph', text: rawContent }]
  const categoryId = formData.get('categoryId') as string

  if (categoryId) {
    await db.update(articles).set({ title, slug, content, categoryId }).where(eq(articles.id, id))
  } else {
    await db.update(articles).set({ title, slug, content }).where(eq(articles.id, id))
  }

  revalidatePath('/admin/articles')
  redirect('/admin/articles')
}

export async function deleteArticle(formData: FormData) {
  const db = getDb()
  const id = formData.get('id') as string

  await db.delete(articles).where(eq(articles.id, id))

  revalidatePath('/admin/articles')
}
