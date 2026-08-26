import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import CmsLayout from './components/layout/CmsLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SectionsPage from './pages/SectionsPage'
import { NewsListPage, NewsFormPage } from './pages/NewsPage'
import { ProjectsListPage, ProjectFormPage } from './pages/ProjectsPage'
import { TeamListPage, TeamFormPage } from './pages/TeamPage'
import { ResearchListPage, ResearchFormPage } from './pages/ResearchPage'
import { ResourcesListPage, ResourceFormPage } from './pages/ResourcesPage'
import { StatsPage, SettingsPage } from './pages/StatsSettingsPage'
import WorkPackagesPage from './pages/WorkPackagesPage'
import PageContentPage from './pages/PageContentPage'
import FacultiesPage from './pages/FacultiesPage'
import PartnersPage from './pages/PartnersPage'
import StudentPrinciplesPage from './pages/StudentPrinciplesPage'
import JoinPathwaysPage from './pages/JoinPathwaysPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="font-body text-sm text-slate animate-pulse">Loading…</div>
    </div>
  )
  if (!user) return <Navigate to="/cms/login" replace />
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-sm text-center">
        <div className="font-body font-bold text-lg text-ink mb-2">Not authorised</div>
        <p className="font-body text-sm text-slate">
          Your account ({user.email}) does not have CMS access. Contact the network
          coordinator if you believe this is a mistake.
        </p>
      </div>
    </div>
  )
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/cms" replace /> : <>{children}</>
}

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <CmsLayout>{children}</CmsLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/cms/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Dashboard */}
        <Route path="/cms"                element={<Protected><DashboardPage /></Protected>} />

        {/* Section toggles */}
        <Route path="/cms/sections"       element={<Protected><SectionsPage /></Protected>} />

        {/* News */}
        <Route path="/cms/news"           element={<Protected><NewsListPage /></Protected>} />
        <Route path="/cms/news/:id"       element={<Protected><NewsFormPage /></Protected>} />

        {/* Projects */}
        <Route path="/cms/projects"       element={<Protected><ProjectsListPage /></Protected>} />
        <Route path="/cms/projects/:id"   element={<Protected><ProjectFormPage /></Protected>} />

        {/* Team */}
        <Route path="/cms/team"           element={<Protected><TeamListPage /></Protected>} />
        <Route path="/cms/team/:id"       element={<Protected><TeamFormPage /></Protected>} />

        {/* Research */}
        <Route path="/cms/research"       element={<Protected><ResearchListPage /></Protected>} />
        <Route path="/cms/research/:id"   element={<Protected><ResearchFormPage /></Protected>} />

        {/* Resources */}
        <Route path="/cms/resources"      element={<Protected><ResourcesListPage /></Protected>} />
        <Route path="/cms/resources/:id"  element={<Protected><ResourceFormPage /></Protected>} />

        {/* Faculties & Departments */}
        <Route path="/cms/faculties"      element={<Protected><FacultiesPage /></Protected>} />

        {/* Partners, Student Principles, Join Pathways */}
        <Route path="/cms/partners"           element={<Protected><PartnersPage /></Protected>} />
        <Route path="/cms/student-principles" element={<Protected><StudentPrinciplesPage /></Protected>} />
        <Route path="/cms/join-pathways"      element={<Protected><JoinPathwaysPage /></Protected>} />

        {/* Page Content blocks — one per manageable page */}
        <Route path="/cms/content/:pageId" element={<Protected><PageContentPage /></Protected>} />

        {/* Work Packages */}
        <Route path="/cms/work-packages"  element={<Protected><WorkPackagesPage /></Protected>} />

        {/* Stats & Settings */}
        <Route path="/cms/stats"          element={<Protected><StatsPage /></Protected>} />
        <Route path="/cms/settings"       element={<Protected><SettingsPage /></Protected>} />

        {/* Fallback */}
        <Route path="*"                   element={<Navigate to="/cms/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
