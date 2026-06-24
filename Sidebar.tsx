import { AlertCircle, BarChart3, Clock, TrendingUp } from 'lucide-react'
import { Link } from 'react-router'
import { ProjectCharts } from '../../components/projects/ProjectCharts'
import { MetricCard } from '../../components/ui/MetricCard'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { dueSoon, formatDate, getPrimaryMetric, getProjectProgress } from '../../lib/format'
import { useProjects } from '../projects/useProjects'

export function AnalystSection() {
  const { projects } = useProjects()
  const atRisk = projects.filter(
    (project) =>
      project.status === 'Needs Review' ||
      project.riskLevel === 'High' ||
      project.riskLevel === 'Critical',
  )
  const due = projects.filter((project) => dueSoon(project, 45))
  const belowHalf = projects.filter(
    (project) => getProjectProgress(project) < 50 && project.status !== 'Complete',
  )
  const completed = projects.filter((project) => project.status === 'Complete').length

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={AlertCircle}
          label="Risk Queue"
          value={String(atRisk.length)}
          detail="Projects marked at risk"
          tone="amber"
        />
        <MetricCard
          icon={Clock}
          label="45-Day Due Window"
          value={String(due.length)}
          detail="Active project deadlines"
          tone="amber"
        />
        <MetricCard
          icon={TrendingUp}
          label="Below 50%"
          value={String(belowHalf.length)}
          detail="Progress below midpoint"
          tone="blue"
        />
        <MetricCard
          icon={BarChart3}
          label="Completed"
          value={String(completed)}
          detail="Closed deliverables"
          tone="green"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_24rem]">
        <article className="bridgeway-card overflow-hidden">
          <div className="bridgeway-card-header p-4">
            <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Analyst Workbench</h2>
            <p className="text-sm text-[var(--bridgeway-muted)]">
              Aggregate project signals for prioritization and reporting.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bridgeway-table-head text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Project</th>
                  <th className="px-4 py-3 font-semibold">Signal</th>
                  <th className="px-4 py-3 font-semibold">Metric</th>
                  <th className="px-4 py-3 font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Next Step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bridgeway-line)]">
                {[...atRisk, ...belowHalf]
                  .filter(
                    (project, index, list) =>
                      list.findIndex((item) => item.id === project.id) === index,
                  )
                  .map((project) => (
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
                      <td className="px-4 py-3">
                        <StatusBadge value={project.status} />
                      </td>
                      <td className="px-4 py-3 text-[var(--bridgeway-muted)]">
                        {(() => {
                          const metric = getPrimaryMetric(project)
                          return metric
                            ? `${metric.name}: ${metric.currentValue} / ${metric.targetValue} ${metric.unit}`
                            : 'Metric pending'
                        })()}
                      </td>
                      <td className="px-4 py-3 text-[var(--bridgeway-muted)]">{formatDate(project.dueDate)}</td>
                      <td className="px-4 py-3 text-[var(--bridgeway-muted)]">
                        {project.recommendedNextAction}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="bridgeway-card p-5">
          <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Reporting Guardrails</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--bridgeway-text)]">
            <li className="rounded-md border border-[var(--bridgeway-green-100)] bg-[var(--bridgeway-green-50)] p-3">
              Keep dashboards limited to project-level status, aggregate metrics, owners,
              timelines, and next steps.
            </li>
            <li className="rounded-md border border-[var(--bridgeway-border)] bg-[#fbfdf9] p-3">
              Store source files as references only in Phase 1. Do not paste client-level
              data into notes or resources.
            </li>
            <li className="rounded-md border border-[var(--bridgeway-gold-100)] bg-[var(--bridgeway-gold-50)] p-3">
              Use the project library as the working source of truth until a future backend
              is approved.
            </li>
          </ul>
        </article>
      </section>

      <ProjectCharts projects={projects} />
    </div>
  )
}
