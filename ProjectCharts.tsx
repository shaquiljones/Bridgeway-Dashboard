import { useContext } from 'react'
import { ProjectContext } from './projectsContext'

export function useProjects() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used inside ProjectProvider')
  }

  return context
}
