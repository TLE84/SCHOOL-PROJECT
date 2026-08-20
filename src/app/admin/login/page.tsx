import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2">Sign in to manage campus news and articles.</p>
        </div>
        
        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-colors"
              placeholder="admin@pti.edu.ng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-colors"
            />
          </div>
          <button 
            formAction={login} 
            className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 transition-colors mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
