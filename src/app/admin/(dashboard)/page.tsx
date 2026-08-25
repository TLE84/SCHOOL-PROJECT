import Link from 'next/link'
import { FileText, TrendingUp, Users } from 'lucide-react'
import { getAdminStats } from '@/lib/content/queries'

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here is what is happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Articles</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalArticles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/articles" className="text-sm text-blue-600 font-medium hover:underline">
              Manage articles &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Published This Month</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.publishedThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Authors</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalAuthors}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div className="p-6 flex gap-4">
          <Link 
            href="/admin/articles/new" 
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            + New Article
          </Link>
          <Link 
            href="/admin/articles" 
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  )
}
