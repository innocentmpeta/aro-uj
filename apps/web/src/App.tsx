import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TheReclaimersPage from './pages/TheReclaimersPage'
import PraxisInActionPage from './pages/PraxisInActionPage'
import ApproachPage from './pages/ApproachPage'
import ProgrammeDetailPage from './pages/ProgrammeDetailPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ResearchPage from './pages/ResearchPage'
import StudentPracticumPage from './pages/StudentPracticumPage'
import TeachingResourcesPage from './pages/TeachingResourcesPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import JoinPage from './pages/JoinPage'
import MemberLoginPage from './pages/MemberLoginPage'
import MembersPage from './pages/MembersPage'
import NotFoundPage from './pages/NotFoundPage'

function ProtectedMemberRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="font-body text-sm text-muted animate-pulse">Loading…</div>
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/members/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index                                    element={<HomePage />} />
          <Route path="about"                             element={<AboutPage />} />
          <Route path="the-reclaimers"                    element={<TheReclaimersPage />} />
          <Route path="praxis-in-action"                  element={<PraxisInActionPage />} />
          <Route path="approach"                          element={<ApproachPage />} />
          <Route path="praxis-in-action/programme/:slug"  element={<ProgrammeDetailPage />} />
          <Route path="praxis-in-action/:slug"            element={<ProjectDetailPage />} />
          <Route path="research"                          element={<ResearchPage />} />
          <Route path="student-practicum"                 element={<StudentPracticumPage />} />
          <Route path="teaching-resources"                element={<TeachingResourcesPage />} />
          <Route path="news"                              element={<NewsPage />} />
          <Route path="news/:slug"                         element={<NewsDetailPage />} />
          <Route path="join"                              element={<JoinPage />} />
          <Route path="members/login"                     element={<MemberLoginPage />} />
          <Route path="members"                           element={<ProtectedMemberRoute><MembersPage /></ProtectedMemberRoute>} />
          <Route path="*"                                 element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}