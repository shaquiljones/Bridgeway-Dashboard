import { Save } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import {
  METRIC_STATUSES,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  RISK_LEVELS,
  TREND_DIRECTIONS,
  type MetricStatus,
  type ProjectInput,
  type ProjectPriority,
  type ProjectStatus,
  type ProjectType,
  type RiskLevel,
  type TrendDirection,
} from '../../types/project'
import { useProjects } from './useProjects'

interface FormState {
  title: string
  type: ProjectType
  status: ProjectStatus
  priority: ProjectPriority
  program: string
  department: string
  owner: string
  summary: string
  whyItMatters: string
  smartGoal: string
  startDate: string
  lastUpdated: string
  dueDate: string
  progress: string
  metricId: string
  metricName: string
  currentValue: string
  targetValue: string
  unit: string
  metricTrendDirection: TrendDirection
  metricStatus: MetricStatus
  metricInterpretation: string
  analystNotes: string
  numbersNarrative: string
  recommendedNextAction: string
  dataSource: string
  lastDataRefresh: string
  riskLevel: RiskLevel
  attentionFlags: string
  tags: string
}

const today = new Date().toISOString().slice(0, 10)

const blankForm: FormState = {
  title: '',
  type: 'Excel Tracker',
  status: 'Not Started',
  priority: 'Medium',
  program: '',
  department: '',
  owner: 'QI Manager',
  summary: '',
  whyItMatters: '',
  smartGoal: '',
  startDate: today,
  lastUpdated: today,
  dueDate: today,
  progress: '0',
  metricId: 'metric-primary',
  metricName: '',
  currentValue: '0',
  targetValue: '100',
  unit: '%',
  metricTrendDirection: 'Not Available',
  metricStatus: 'Watch',
  metricInterpretation: '',
  analystNotes: '',
  numbersNarrative: '',
  recommendedNextAction: '',
  dataSource: '',
  lastDataRefresh: today,
  riskLevel: 'Moderate',
  attentionFlags: '',
  tags: '',
}

function toFormInput(form: FormState): ProjectInput {
  return {
    title: form.title.trim(),
    type: form.type,
    status: form.status,
    priority: form.priority,
    program: form.program.trim(),
    department: form.department.trim() || form.program.trim(),
    owner: form.owner.trim() || 'QI Manager',
    summary: form.summary.trim(),
    whyItMatters: form.whyItMatters.trim(),
    smartGoal: form.smartGoal.trim(),
    startDate: form.startDate,
    lastUpdated: form.lastUpdated,
    dueDate: form.dueDate,
    progress: Math.max(0, Math.min(100, Number(form.progress) || 0)),
    metrics: [
      {
        id: form.metricId,
        name: form.metricName.trim() || 'Primary project metric',
        currentValue: Number(form.currentValue) || 0,
        targetValue: Number(form.targetValue) || 0,
        unit: form.unit.trim() || '%',
        trendDirection: form.metricTrendDirection,
        status: form.metricStatus,
        interpretation: form.metricInterpretation.trim(),
      },
    ],
    analystNotes: form.analystNotes.trim(),
    numbersNarrative: form.numbersNarrative.trim(),
    recommendedNextAction: form.recommendedNextAction.trim(),
    dataSource: form.dataSource.trim(),
    lastDataRefresh: form.lastDataRefresh,
    riskLevel: form.riskLevel,
    trendDirection: form.metricTrendDirection,
    attentionFlags: form.attentionFlags
      .split(',')
      .map((flag) => flag.trim())
      .filter(Boolean),
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  }
}

export function ProjectForm() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, addProject, updateProject } = useProjects()
  const existingProject = projects.find((project) => project.id === projectId)

  const initialForm = useMemo<FormState>(() => {
    if (!existingProject) {
      return blankForm
    }
    const primaryMetric = existingProject.metrics[0]

    return {
      title: existingProject.title,
      type: existingProject.type,
      status: existingProject.status,
      priority: existingProject.priority,
      program: existingProject.program,
      department: existingProject.department,
      owner: existingProject.owner,
      summary: existingProject.summary,
      whyItMatters: existingProject.whyItMatters,
      smartGoal: existingProject.smartGoal,
      startDate: existingProject.startDate,
      lastUpdated: existingProject.lastUpdated,
      dueDate: existingProject.dueDate,
      progress: String(existingProject.progress),
      metricId: primaryMetric?.id ?? 'metric-primary',
      metricName: primaryMetric?.name ?? '',
      currentValue: String(primaryMetric?.currentValue ?? 0),
      targetValue: String(primaryMetric?.targetValue ?? 100),
      unit: primaryMetric?.unit ?? '%',
      metricTrendDirection: primaryMetric?.trendDirection ?? 'Not Available',
      metricStatus: primaryMetric?.status ?? 'Watch',
      metricInterpretation: primaryMetric?.interpretation ?? '',
      analystNotes: existingProject.analystNotes,
      numbersNarrative: existingProject.numbersNarrative,
      recommendedNextAction: existingProject.recommendedNextAction,
      dataSource: existingProject.dataSource,
      lastDataRefresh: existingProject.lastDataRefresh,
      riskLevel: existingProject.riskLevel,
      attentionFlags: existingProject.attentionFlags.join(', '),
      tags: existingProject.tags.join(', '),
    }
  }, [existingProject])

  const [form, setForm] = useState<FormState>(initialForm)

  if (projectId && !existingProject) {
    return <Navigate to="/projects" replace />
  }

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = toFormInput(form)

    if (existingProject) {
      updateProject(existingProject.id, input)
      navigate(`/projects/${existingProject.id}`)
      return
    }

    const createdProject = addProject(input)
    navigate(`/projects/${createdProject.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="bridgeway-card p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--bridgeway-text)]">
            {existingProject ? 'Edit Project' : 'Add Project'}
          </h2>
          <p className="mt-2 text-sm text-[var(--bridgeway-muted)]">
            Track only project-level goals, metrics, resources, and next steps.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Project title</span>
            <input
              required
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Project type</span>
            <select
              value={form.type}
              onChange={(event) => updateField('type', event.target.value as ProjectType)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Program / Department</span>
            <input
              required
              value={form.program}
              onChange={(event) => updateField('program', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Department</span>
            <input
              value={form.department}
              onChange={(event) => updateField('department', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Owner</span>
            <input
              required
              value={form.owner}
              onChange={(event) => updateField('owner', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField('status', event.target.value as ProjectStatus)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Priority</span>
            <select
              value={form.priority}
              onChange={(event) =>
                updateField('priority', event.target.value as ProjectPriority)
              }
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            >
              {PROJECT_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Start date</span>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(event) => updateField('startDate', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Last updated</span>
            <input
              type="date"
              required
              value={form.lastUpdated}
              onChange={(event) => updateField('lastUpdated', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Due date</span>
            <input
              type="date"
              required
              value={form.dueDate}
              onChange={(event) => updateField('dueDate', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-bold text-[var(--bridgeway-text)]">Summary</span>
          <textarea
            required
            value={form.summary}
            onChange={(event) => updateField('summary', event.target.value)}
            rows={4}
            className="bridgeway-form-control mt-2 w-full px-3 py-2 text-sm"
          />
        </label>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Why this matters</span>
            <textarea
              value={form.whyItMatters}
              onChange={(event) => updateField('whyItMatters', event.target.value)}
              rows={4}
              className="bridgeway-form-control mt-2 w-full px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">SMART goal</span>
            <textarea
              value={form.smartGoal}
              onChange={(event) => updateField('smartGoal', event.target.value)}
              rows={4}
              className="bridgeway-form-control mt-2 w-full px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="bridgeway-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Metric Tracking</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <label className="block lg:col-span-2">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Metric name</span>
            <input
              required
              value={form.metricName}
              onChange={(event) => updateField('metricName', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Progress percentage</span>
            <input
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={(event) => updateField('progress', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Current value</span>
            <input
              type="number"
              value={form.currentValue}
              onChange={(event) => updateField('currentValue', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Target value</span>
            <input
              type="number"
              value={form.targetValue}
              onChange={(event) => updateField('targetValue', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Unit / label</span>
            <input
              value={form.unit}
              onChange={(event) => updateField('unit', event.target.value)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Trend direction</span>
            <select
              value={form.metricTrendDirection}
              onChange={(event) =>
                updateField('metricTrendDirection', event.target.value as TrendDirection)
              }
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            >
              {TREND_DIRECTIONS.map((trend) => (
                <option key={trend} value={trend}>
                  {trend}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Metric status</span>
            <select
              value={form.metricStatus}
              onChange={(event) => updateField('metricStatus', event.target.value as MetricStatus)}
              className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
            >
              {METRIC_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-bold text-[var(--bridgeway-text)]">Short interpretation</span>
          <textarea
            value={form.metricInterpretation}
            onChange={(event) => updateField('metricInterpretation', event.target.value)}
            rows={3}
            className="bridgeway-form-control mt-2 w-full px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-bold text-[var(--bridgeway-text)]">Tags</span>
          <input
            value={form.tags}
            onChange={(event) => updateField('tags', event.target.value)}
            placeholder="A1C, dashboard, monthly review"
            className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
          />
        </label>
      </section>

      <section className="bridgeway-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--bridgeway-text)]">Analyst Fields</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">What the numbers are saying</span>
            <textarea
              value={form.numbersNarrative}
              onChange={(event) => updateField('numbersNarrative', event.target.value)}
              rows={4}
              className="bridgeway-form-control mt-2 w-full px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Recommended next action</span>
            <textarea
              value={form.recommendedNextAction}
              onChange={(event) => updateField('recommendedNextAction', event.target.value)}
              rows={4}
              className="bridgeway-form-control mt-2 w-full px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[var(--bridgeway-text)]">Analyst notes</span>
            <textarea
              value={form.analystNotes}
              onChange={(event) => updateField('analystNotes', event.target.value)}
              rows={4}
              className="bridgeway-form-control mt-2 w-full px-3 py-2 text-sm"
            />
          </label>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-bold text-[var(--bridgeway-text)]">Data source</span>
              <input
                value={form.dataSource}
                onChange={(event) => updateField('dataSource', event.target.value)}
                className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-[var(--bridgeway-text)]">Last data refresh</span>
              <input
                type="date"
                value={form.lastDataRefresh}
                onChange={(event) => updateField('lastDataRefresh', event.target.value)}
                className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-[var(--bridgeway-text)]">Risk level</span>
              <select
                value={form.riskLevel}
                onChange={(event) => updateField('riskLevel', event.target.value as RiskLevel)}
                className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
              >
                {RISK_LEVELS.map((risk) => (
                  <option key={risk} value={risk}>
                    {risk}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-bold text-[var(--bridgeway-text)]">Attention flags</span>
          <input
            value={form.attentionFlags}
            onChange={(event) => updateField('attentionFlags', event.target.value)}
            placeholder="Missing updates, refresh needed, leadership review"
            className="bridgeway-form-control mt-2 h-10 w-full px-3 text-sm"
          />
        </label>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bridgeway-button-primary px-4 py-2 text-sm font-bold"
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          Save Project
        </button>
      </div>
    </form>
  )
}
