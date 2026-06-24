import { ArrowLeft, Edit3 } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'
import { NotesNextSteps } from '../../components/projects/NotesNextSteps'
import { ResourceList } from '../../components/projects/ResourceList'
import { Timeline } from '../../components/projects/Timeline'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { formatDate, getPrimaryMetric, getProjectProgress } from '../../lib/format'
import { useProjects } from './useProjects'

export function ProjectDetail() {
  const { projectId } = useParams()
  const { projects, addProjectNote } = useProjects()
  const project = projects.find((item) => item.id === projectId)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const progress = getProjectProgress(project)
  const primaryMetric = getPrimaryMetric(project)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--bridgeway-muted)] hover:text-[var(--bridgeway-green-dark)]"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Project Library
        </Link>
        <Link
          to={`/projects/${project.id}/edit`}
          className="bridgeway-button-secondary px-3 py-2 text-sm font-bold"
        >
          <Edit3 aria-hidden="true" className="h-4 w-4" />
          Edit Project
        </Link>
      </div>

      <section className="bridgeway-card p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={project.status} />
              <StatusBadge value={project.priority} type="priority" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[var(--bridgeway-text)]">{project.title}</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--bridgeway-muted)]">{project.summary}</p>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-[var(--bridgeway-border)] bg-[#fbfdf9] p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-muted)]">
                  Why This Matters
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--bridgeway-text)]">
                  {project.whyItMatters}
                </p>
              </div>
              {project.smartGoal ? (
                <div className="rounded-lg border border-[var(--bridgeway-green-100)] bg-[var(--bridgeway-green-50)] p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-green-dark)]">
                    SMART Goal
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--bridgeway-text)]">
                    {project.smartGoal}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bridgeway-tag rounded-md px-2 py-1 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--bridgeway-border)] bg-[#fbfdf9] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-muted)]">Core Metric</p>
            <p className="mt-2 text-sm font-bold text-[var(--bridgeway-text)]">
              {primaryMetric?.name ?? 'Metric pending'}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--bridgeway-muted)]">Progress</span>
                <span className="font-bold text-[var(--bridgeway-text)]">{progress}%</span>
              </div>
              <div className="bridgeway-progress-track mt-2 h-2 overflow-hidden rounded-md">
                <div className="bridgeway-progress-bar h-full rounded-md" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-xs text-[var(--bridgeway-muted)]">Current</dt>
                <dd className="font-bold text-[var(--bridgeway-text)]">
                  {primaryMetric?.currentValue ?? 0}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--bridgeway-muted)]">Target</dt>
                <dd className="font-bold text-[var(--bridgeway-text)]">
                  {primaryMetric?.targetValue ?? 0}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--bridgeway-muted)]">Unit</dt>
                <dd className="font-bold text-[var(--bridgeway-text)]">
                  {primaryMetric?.unit ?? ''}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="bridgeway-card p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-muted)]">Program / Department</p>
          <p className="mt-2 text-sm font-bold text-[var(--bridgeway-text)]">{project.program}</p>
        </div>
        <div className="bridgeway-card p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-muted)]">Owner</p>
          <p className="mt-2 text-sm font-bold text-[var(--bridgeway-text)]">{project.owner}</p>
        </div>
        <div className="bridgeway-card p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-muted)]">Timeline</p>
          <p className="mt-2 text-sm font-bold text-[var(--bridgeway-text)]">
            {formatDate(project.startDate)} to {formatDate(project.dueDate)}
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_24rem]">
        <article className="bridgeway-card p-5">
          <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Analyst Readout</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--bridgeway-muted)]">
            {project.numbersNarrative}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--bridgeway-border)] bg-[#fbfdf9] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-muted)]">
                Recommended Next Action
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--bridgeway-text)]">
                {project.recommendedNextAction}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--bridgeway-border)] bg-[#fbfdf9] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bridgeway-muted)]">
                Data Source
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--bridgeway-text)]">
                {project.dataSource}
              </p>
            </div>
          </div>
        </article>

        <aside className="bridgeway-card p-5">
          <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Data Status</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-bold text-[var(--bridgeway-muted)]">Last updated</dt>
              <dd className="text-[var(--bridgeway-text)]">{formatDate(project.lastUpdated)}</dd>
            </div>
            <div>
              <dt className="font-bold text-[var(--bridgeway-muted)]">Last data refresh</dt>
              <dd className="text-[var(--bridgeway-text)]">
                {formatDate(project.lastDataRefresh)}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-[var(--bridgeway-muted)]">Risk level</dt>
              <dd className="text-[var(--bridgeway-text)]">{project.riskLevel}</dd>
            </div>
            <div>
              <dt className="font-bold text-[var(--bridgeway-muted)]">Trend</dt>
              <dd className="text-[var(--bridgeway-text)]">{project.trendDirection}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.attentionFlags.map((flag) => (
              <span key={flag} className="bridgeway-tag rounded-md px-2 py-1 text-xs font-semibold">
                {flag}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <div>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Timeline and Milestones</h2>
            <p className="text-sm text-[var(--bridgeway-muted)]">Project-level checkpoints and status.</p>
          </div>
          <Timeline milestones={project.milestones} />
        </div>

        <div>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Files and Resources</h2>
            <p className="text-sm text-[var(--bridgeway-muted)]">References only; no client files.</p>
          </div>
          <ResourceList resources={project.resources} />
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Notes and Next Steps</h2>
          <p className="text-sm text-[var(--bridgeway-muted)]">Working notes saved locally in this browser.</p>
        </div>
        <NotesNextSteps
          project={project}
          onAddNote={(text, nextStep, owner) =>
            addProjectNote(project.id, { text, nextStep, owner })
          }
        />
      </section>
    </div>
  )
}
