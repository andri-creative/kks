import { createRootRoute, createRoute, createRouter, Outlet, ScrollRestoration, redirect } from '@tanstack/react-router'
import Login from './pages/Login'
import AdminLayout from './layouts/admin/MainLayout'
import ClientLayout from './layouts/client/ClientLayout'
import AdminHome from './pages/admin/Home'
import AdminUsers from './pages/admin/Users'
import AdminCetak from './pages/admin/Cetak'
import AdminCandidate from './pages/admin/Candidate'
import AdminCandidateForm from './pages/admin/CandidateForm'
import AdminProfile from './pages/admin/Profile'
import ClientHome from './pages/client/Home'
import AdminSettings from './pages/admin/Settings'
import AdminVotes from './pages/admin/Votes'
import AdminVotesLaporan from './pages/admin/VotesLaporan'
import { authService } from './services/authService'

// 1. Root Route - Wrapper utama aplikasi
const rootRoute = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-slate-400">Halaman tidak ditemukan!</p>
      </div>
    </div>
  )
})

// 2. Index Route (Halaman Utama / Form Login di /)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
  beforeLoad: () => {
    const user = authService.getCurrentUser();
    if (user.role) {
      if (user.role.toLowerCase() === 'admin') {
        throw redirect({ to: '/dashboard' });
      } else if (user.role.toLowerCase() === 'siswa') {
        throw redirect({ to: '/client' });
      }
    }
  }
})

// 3. Admin Layout & Routes (Pathless Layout)
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: AdminLayout,
  beforeLoad: () => {
    const user = authService.getCurrentUser();
    if (!user.role || user.role.toLowerCase() !== 'admin') {
      throw redirect({ to: '/' });
    }
  }
})

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/dashboard',
  component: AdminHome,
})

const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/users',
  component: AdminUsers,
})

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: AdminSettings,
})

const adminVotesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/votes',
  component: AdminVotes,
})

const adminVotesLaporanRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/votes/laporan',
  component: AdminVotesLaporan,
})

const adminCetakRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/users/cetak',
  component: AdminCetak,
})

const adminCandidateRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/candidate',
  component: AdminCandidate,
})

const adminCandidateFormRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/candidate/form',
  component: AdminCandidateForm,
})

const adminProfileRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/profile',
  component: AdminProfile,
})

// 4. Client Layout & Routes
const clientLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client',
  component: ClientLayout,
  beforeLoad: () => {
    const user = authService.getCurrentUser();
    if (!user.role || user.role.toLowerCase() !== 'siswa') {
      throw redirect({ to: '/' });
    }
  }
})

const clientHomeRoute = createRoute({
  getParentRoute: () => clientLayoutRoute,
  path: '/',
  component: ClientHome,
})

// 5. Satukan semua Route
const routeTree = rootRoute.addChildren([
  indexRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminUsersRoute,
    adminCetakRoute,
    adminCandidateRoute,
    adminCandidateFormRoute,
    adminProfileRoute,
    adminSettingsRoute,
    adminVotesRoute,
    adminVotesLaporanRoute
  ]),
  clientLayoutRoute.addChildren([clientHomeRoute]),
])


// 7. Export Router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// 8. Register Router untuk Type Safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
