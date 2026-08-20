import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createArticle } from '../actions'

export default function NewArticlePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Draft New Article</h1>
          <p className="text-slate-500 mt-1">Create a new news piece for the campus portal.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form action={createArticle} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">Headline</label>
              <input 
                id="title" 
                name="title" 
                type="text" 
                required 
                placeholder="PTI Admits New Students..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium text-slate-700">URL Slug</label>
              <input 
                id="slug" 
                name="slug" 
                type="text" 
                required 
                placeholder="pti-admits-new-students"
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
              rows={12}
              placeholder="Write the article content here. Markdown is supported."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none resize-y font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPublished" name="isPublished" value="true" className="w-4 h-4 text-green-600 rounded focus:ring-green-600" />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">Publish immediately</label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save Article
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
