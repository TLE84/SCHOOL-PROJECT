import Link from 'next/link'
import { Edit, Trash2, Plus } from 'lucide-react'
// If database is configured, we could fetch from db. For now, fetch from queries to show current articles
import { getArticles } from '@/lib/content/queries'
import { formatDate } from '@/lib/format'
import { deleteArticle } from './actions'

export default async function AdminArticlesPage() {
  // Fetching all articles from the current read API (which uses seed.ts initially)
  const articles = await getArticles({ perPage: 100 })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Articles</h1>
          <p className="text-slate-500 mt-1">Manage campus news and editorial content.</p>
        </div>
        <Link 
          href="/admin/articles/new" 
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Published</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {articles.items.map((article) => (
              <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{article.title}</div>
                  <div className="text-sm text-slate-500">/{article.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    {article.category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {article.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {formatDate(article.publishedAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/articles/${article.id}/edit`} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={article.id} />
                      <button type="submit" className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            
            {articles.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No articles found. Create your first article to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
