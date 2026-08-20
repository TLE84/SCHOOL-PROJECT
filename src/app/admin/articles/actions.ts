'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// In a full implementation, we'd import db and schema to insert records
// import { db } from '@/db'
// import { articles } from '@/db/schema'
// import { eq } from 'drizzle-orm'

export async function createArticle(formData: FormData) {
  // Extract data
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const isPublished = formData.get('isPublished') === 'true'

  // Validate inputs (normally with Zod)
  if (!title || !slug || !content) {
    throw new Error("Missing required fields")
  }

  // TODO: Insert into database once DATABASE_URL is configured
  // await db.insert(articles).values({
  //   title,
  //   slug,
  //   content,
  //   isPublished,
  //   authorId: 'system', // Replace with session user ID
  // })

  revalidatePath('/admin/articles')
  redirect('/admin/articles')
}

export async function updateArticle(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string

  // TODO: Update database
  // await db.update(articles).set({ title, slug, content }).where(eq(articles.id, id))

  revalidatePath('/admin/articles')
  redirect('/admin/articles')
}

export async function deleteArticle(formData: FormData) {
  const id = formData.get('id') as string

  // TODO: Delete from database
  // await db.delete(articles).where(eq(articles.id, id))

  revalidatePath('/admin/articles')
}
