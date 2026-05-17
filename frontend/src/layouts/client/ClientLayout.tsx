import { Outlet, Link } from '@tanstack/react-router'

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="h-16 border-b border-slate-100 flex items-center px-6 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold tracking-tight text-indigo-600">CLIENT APP</span>
          <nav className="flex gap-6 ml-10 text-sm font-semibold text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition-colors [&.active]:text-indigo-600">Home</Link>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Services</Link>
          </nav>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
          Sign Out
        </button>
      </header>
      <main className="p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
