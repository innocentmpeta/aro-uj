import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TheReclaimersPage from './pages/TheReclaimersPage'
import PraxisInActionPage from './pages/PraxisInActionPage'
import ProgrammeDetailPage from './pages/ProgrammeDetailPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ResearchPage from './pages/ResearchPage'
import StudentPracticumPage from './pages/StudentPracticumPage'
import TeachingResourcesPage from './pages/TeachingResourcesPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import JoinPage from './pages/JoinPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index                                    element={<HomePage />} />
        <Route path="about"                             element={<AboutPage />} />
        <Route path="the-reclaimers"                    element={<TheReclaimersPage />} />
        <Route path="praxis-in-action"                  element={<PraxisInActionPage />} />
        <Route path="praxis-in-action/programme/:slug"  element={<ProgrammeDetailPage />} />
        <Route path="praxis-in-action/:slug"            element={<ProjectDetailPage />} />
        <Route path="research"                          element={<ResearchPage />} />
        <Route path="student-practicum"                 element={<StudentPracticumPage />} />
        <Route path="teaching-resources"                element={<TeachingResourcesPage />} />
        <Route path="news"                              element={<NewsPage />} />
        <Route path="news/:slug"                         element={<NewsDetailPage />} />
        <Route path="join"                              element={<JoinPage />} />
        <Route path="*"                                 element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}