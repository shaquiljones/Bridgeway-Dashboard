import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { formatDate, getPrimaryMetric, getProjectProgress } from '../../lib/format'
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  type ProjectStatus,
  type ProjectType,
} from '../../types/project'
import { useProjects } from './useProjects'

export function ProjectLibrary() {
  const { projects, resetProjects } = useProjects()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ProjectStatus | 'All'>('All')
  const [type, setType] = useState<ProjectType | 'All'>('All')

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          project.title,
          project.program,
          project.department,
          project.owner,
          project.summary,
          project.whyItMatters,
          project.smartGoal,
          project.analystNotes,
          project.numbersNarrative,
          project.recommendedNextAction,
          project.dataSource,
          ...project.attentionFlags,
          ...project.tags,
          ...project.metrics.map((metric) => metric.name),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesStatus = status === 'All' || project.status === status
      const matchesType = type === 'All' || project.type === type
      return matchesQuery && matchesStatus && matchesType
    })
  }, [projects, query, status, type])

  return (
    <div className="space-y-5">
      <section className="bridgeway-card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_12rem_13rem_auto]">
          <label className="relative block">
            <span className="sr-only">Search projects</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--bridgeway-muted)]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, programs, owners, or tags"
              className="bridgeway-form-control h-10 w-full pl-9 pr-3 text-sm"
            />
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectStatus | 'All')}
            className="bridgeway-form-control h-10 px-3 text-sm"
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            {PROJECT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(event) => setType(event.target.value as ProjectType | 'All')}
            className="bridgeway-form-control h-10 px-3 text-sm"
            aria-label="Filter by project type"
          >
            <option value="All">All project types</option>
            {PROJECT_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetProjects}
            className="bridgeway-button-secondary h-10 px-3 text-sm font-bold"
          >
            Reset Seed
          </button>
        </div>
      </section>

      <section className="bridgeway-card overflow-hidden">
        <div className="bridgeway-card-header p-4">
          <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Project Library</h2>
          <p className="text-sm text-[var(--bridgeway-muted)]">{filteredProjects.length} projects shown</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bridgeway-table-head text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Due</th>
                <th className="px-4 py-3 font-semibold">Metric</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bridgeway-line)]">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="bridgeway-row-hover">
                  <td className="px-4 py-3">
                    <Link
                      to={`/projects/${project.id}`}
                      className="bridgeway-link font-bold"
                    >
                      {project.title}
                    </Link>
                    <p className="mt-1 text-xs text-[var(--bridgeway-muted)]">{project.program}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--bridgeway-muted)]">{project.type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={project.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={project.priority} type="priority" />
                  </td>
                  <td className="px-4 py-3 text-[var(--bridgeway-muted)]">{formatDate(project.dueDate)}</td>
                  <td className="px-4 py-3 text-[var(--bridgeway-muted)]">
                    {getPrimaryMetric(project)?.name ?? 'Metric pending'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[var(--bridgeway-text)]">
                      {getProjectProgress(project)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
