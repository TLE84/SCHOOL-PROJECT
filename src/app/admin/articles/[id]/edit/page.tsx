import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { updateArticle } from '../../actions'
import { getArticleBySlug, getCategories, getUsers } from '@/lib/content/queries'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleBySlug(params.id)
  const categories = await getCategories()
  const users = await getUsers()
  
  if (!article) {
    // Return a fallback form for DB test mode since the seed might not have it by ID
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Article not found in seed dataset. If using DB, ensure DB is connected.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Article</h1>
          <p className="text-slate-500 mt-1">Update existing news content.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form action={updateArticle} className="p-8 space-y-6">
          <input type="hidden" name="id" value={article.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">Headline</label>
              <input 
                id="title" 
                name="title" 
                type="text" 
                defaultValue={article.title}
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium text-slate-700">URL Slug</label>
              <input 
                id="slug" 
                name="slug" 
                type="text" 
                defaultValue={article.slug}
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-slate-700">Article Content</label>
            <textarea 
              id="content" 
              name="content" 
              required 
              defaultValue={article.content.map((c: any) => c.text || '').join('\n\n')}
              rows={15}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none resize-y font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">Category</label>
              <select 
                id="categoryId" 
                name="categoryId" 
                defaultValue={article.category.id}
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="authorId" className="text-sm font-medium text-slate-700">Author</label>
              <select 
                id="authorId" 
                name="authorId" 
                defaultValue={article.author.id}
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none bg-white"
              >
                <option value="">Select an author</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isPublished" 
                name="isPublished" 
                value="true" 
                defaultChecked={article.isPublished}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-600" 
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">Published</label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Save className="w-5 h-5" />
              Update Article
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
