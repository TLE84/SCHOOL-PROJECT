import Link from 'next/link'
import { LayoutDashboard, FileText, Settings, Users, LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="text-white text-xl font-bold tracking-tight">
            PTI Admin
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/articles" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
            Articles
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-slate-800 hover:text-red-400 transition-colors text-left">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-end">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              A
            </div>
            <span className="text-sm font-medium text-slate-700">Administrator</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
