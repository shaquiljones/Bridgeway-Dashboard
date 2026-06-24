import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './components/layout/AppLayout'
import { AnalystSection } from './features/analyst/AnalystSection'
import { OverviewDashboard } from './features/dashboard/OverviewDashboard'
import { ProjectDetail } from './features/projects/ProjectDetail'
import { ProjectForm } from './features/projects/ProjectForm'
import { ProjectLibrary } from './features/projects/ProjectLibrary'
import { ProjectProvider } from './features/projects/ProjectProvider'

function App() {
  return (
    <ProjectProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<OverviewDashboard />} />
          <Route path="projects" element={<ProjectLibrary />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="projects/:projectId/edit" element={<ProjectForm />} />
          <Route path="analyst" element={<AnalystSection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ProjectProvider>
  )
}

export default App
