import { Outlet, Link } from '@tanstack/react-router'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="h-16 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tighter text-sky-400">ADMIN PANEL</span>
          <nav className="flex gap-4 ml-8 text-sm font-medium text-slate-400">
            <Link to="/" className="hover:text-sky-400 transition-colors [&.active]:text-sky-400">Dashboard</Link>
            <Link to="/login" className="hover:text-sky-400 transition-colors">Users</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-sky-400 text-xs font-bold">A</div>
        </div>
      </header>
      <main className="p-6 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
