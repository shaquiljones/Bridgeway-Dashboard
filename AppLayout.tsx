import seedProjects from '../data/projects.seed.json'
import type {
  ActionStatus,
  MetricStatus,
  Milestone,
  MilestoneStatus,
  MilestoneType,
  Project,
  ProjectActionItem,
  ProjectMetric,
  ProjectPriority,
  ProjectResource,
  ProjectStatus,
  ProjectType,
  ResourceCategory,
  ResourceType,
  RiskLevel,
  TrendDirection,
} from '../types/project'
import {
  METRIC_STATUSES,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  RISK_LEVELS,
  TREND_DIRECTIONS,
} from '../types/project'

const STORAGE_KEY = 'bridgeway-qi-command-center:projects:v1'

type AnyRecord = Record<string, unknown>

const today = () => new Date().toISOString().slice(0, 10)

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown, fallback = '') {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return fallback
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      )
    : []
}

function records(value: unknown) {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T, fallback: T[number]) {
  return allowed.includes(value as T[number]) ? (value as T[number]) : fallback
}

function mapProjectType(value: unknown): ProjectType {
  if (PROJECT_TYPES.includes(value as ProjectType)) {
    return value as ProjectType
  }

  const legacy = text(value).toLowerCase()
  if (legacy.includes('smart')) return 'Excel Tracker'
  if (legacy.includes('a1c')) return 'Data Report'
  if (legacy.includes('policy')) return 'Policy/QI Project'
  if (legacy.includes('dashboard') || legacy.includes('metric')) return 'Dashboard'
  if (legacy.includes('presentation')) return 'Training/Presentation'
  if (legacy.includes('report')) return 'Data Report'
  return 'Other'
}

function mapProjectStatus(value: unknown): ProjectStatus {
  if (PROJECT_STATUSES.includes(value as ProjectStatus)) {
    return value as ProjectStatus
  }

  const legacy = text(value).toLowerCase()
  if (legacy === 'planning') return 'Not Started'
  if (legacy === 'in progress') return 'In Progress'
  if (legacy === 'at risk') return 'Needs Review'
  if (legacy === 'on hold') return 'On Hold'
  if (legacy === 'completed' || legacy === 'done' || legacy === 'complete') return 'Complete'
  if (legacy === 'blocked') return 'Waiting'
  if (legacy === 'upcoming') return 'Not Started'
  return 'Not Started'
}

function mapPriority(value: unknown): ProjectPriority {
  return oneOf(value, PROJECT_PRIORITIES, 'Medium')
}

function mapTrend(value: unknown): TrendDirection {
  return oneOf(value, TREND_DIRECTIONS, 'Not Available')
}

function mapMetricStatus(value: unknown): MetricStatus {
  return oneOf(value, METRIC_STATUSES, 'Watch')
}

function mapRisk(value: unknown): RiskLevel {
  return oneOf(value, RISK_LEVELS, 'Moderate')
}

function normalizeProgress(value: unknown) {
  return Math.max(0, Math.min(100, Math.round(numberValue(value, 0))))
}

function buildMetricFromLegacy(project: AnyRecord): ProjectMetric {
  const currentValue = numberValue(project.current, numberValue(project.currentValue, 0))
  const targetValue = numberValue(project.target, numberValue(project.targetValue, 100))

  return {
    id: text(project.metricId, createId('metric')),
    name: text(project.metricName, 'Primary project metric'),
    currentValue,
    targetValue,
    unit: text(project.unit, '%'),
    trendDirection: mapTrend(project.trendDirection),
    status: currentValue >= targetValue ? 'Met' : 'Watch',
    interpretation: text(
      project.interpretation,
      'Legacy project metric migrated into the expanded Phase 3 model.',
    ),
  }
}

function normalizeMetric(value: AnyRecord): ProjectMetric {
  return {
    id: text(value.id, createId('metric')),
    name: text(value.name ?? value.metricName, 'Project metric'),
    currentValue: numberValue(value.currentValue ?? value.current, 0),
    targetValue: numberValue(value.targetValue ?? value.target, 100),
    unit: text(value.unit ?? value.label, '%'),
    trendDirection: mapTrend(value.trendDirection),
    status: mapMetricStatus(value.status),
    interpretation: text(value.interpretation, 'Project-level interpretation pending.'),
  }
}

function normalizeResource(value: AnyRecord): ProjectResource {
  const type = text(value.type ?? value.kind, 'Other') as ResourceType
  const category = text(value.category, 'Reference') as ResourceCategory

  return {
    id: text(value.id, createId('resource')),
    name: text(value.name ?? value.label, 'Project resource'),
    type: [
      'Spreadsheet',
      'HTML',
      'Document',
      'Presentation',
      'Dashboard',
      'Image',
      'Folder',
      'Archive',
      'Other',
    ].includes(type)
      ? type
      : 'Other',
    description: text(value.description, 'Project-level resource reference.'),
    path: text(value.path ?? value.location, 'Reference path pending'),
    lastUpdated: text(value.lastUpdated, today()),
    notes: text(value.notes, ''),
    category: [
      'Tracker',
      'Presentation',
      'Report',
      'Policy',
      'Dashboard',
      'Reference',
      'Template',
      'Archive',
      'Visual',
      'Other',
    ].includes(category)
      ? category
      : 'Reference',
  }
}

function normalizeMilestone(value: AnyRecord): Milestone {
  return {
    id: text(value.id, createId('milestone')),
    date: text(value.date ?? value.dueDate, today()),
    title: text(value.title, 'Project milestone'),
    description: text(value.description, ''),
    status: mapProjectStatus(value.status) as MilestoneStatus,
    type: text(value.type, 'Follow-up') as MilestoneType,
  }
}

function normalizeNote(value: AnyRecord): Project['notes'][number] {
  return {
    id: text(value.id, createId('note')),
    date: text(value.date, today()),
    text: text(value.text, ''),
    nextStep: text(value.nextStep, ''),
    owner: text(value.owner, 'QI Manager'),
    dueDate: text(value.dueDate, ''),
    status: oneOf(value.status, ['Open', 'In Progress', 'Waiting', 'Complete'] as const, 'Open'),
  }
}

function normalizeAction(value: AnyRecord): ProjectActionItem {
  return {
    id: text(value.id, createId('action')),
    title: text(value.title, text(value.nextStep, 'Follow-up action')),
    owner: text(value.owner, 'QI Manager'),
    dueDate: text(value.dueDate, ''),
    status: oneOf(value.status, ['Open', 'In Progress', 'Waiting', 'Complete'] as const, 'Open') as ActionStatus,
    notes: text(value.notes, ''),
  }
}

export function normalizeProject(value: unknown): Project {
  const project = isRecord(value) ? value : {}
  const now = today()
  const metrics = records(project.metrics).map(normalizeMetric)
  const safeMetrics = metrics.length ? metrics : [buildMetricFromLegacy(project)]
  const progressFallback =
    safeMetrics[0].targetValue === 0
      ? 0
      : Math.round((safeMetrics[0].currentValue / safeMetrics[0].targetValue) * 100)

  return {
    id: text(project.id, createId('project')),
    title: text(project.title, 'Untitled QI Project'),
    type: mapProjectType(project.type),
    status: mapProjectStatus(project.status),
    priority: mapPriority(project.priority),
    program: text(project.program, text(project.department, 'Program / Department TBD')),
    department: text(project.department, text(project.program, 'Program / Department TBD')),
    owner: text(project.owner, 'QI Manager'),
    summary: text(project.summary, 'Project-level QI summary pending.'),
    whyItMatters: text(project.whyItMatters, 'Clarifies improvement work and next actions.'),
    smartGoal: text(project.smartGoal, ''),
    startDate: text(project.startDate, now),
    lastUpdated: text(project.lastUpdated, now),
    dueDate: text(project.dueDate, now),
    progress: normalizeProgress(project.progress ?? progressFallback),
    tags: stringList(project.tags),
    metrics: safeMetrics,
    analystNotes: text(project.analystNotes, 'Analyst notes pending.'),
    numbersNarrative: text(
      project.numbersNarrative,
      'Project-level numbers need routine review before leadership reporting.',
    ),
    recommendedNextAction: text(project.recommendedNextAction, 'Review project status and update next action.'),
    dataSource: text(project.dataSource, 'Project-level tracker or dashboard reference'),
    lastDataRefresh: text(project.lastDataRefresh, text(project.lastUpdated, now)),
    riskLevel: mapRisk(project.riskLevel),
    attentionFlags: stringList(project.attentionFlags),
    trendDirection: mapTrend(project.trendDirection ?? safeMetrics[0].trendDirection),
    resources: records(project.resources).map(normalizeResource),
    milestones: records(project.milestones).map(normalizeMilestone),
    notes: records(project.notes).map(normalizeNote),
    nextSteps: records(project.nextSteps).map(normalizeAction),
  }
}

function cloneProjects(projects: Project[]) {
  return projects.map((project) => normalizeProject(project))
}

export function getSeedProjects() {
  return cloneProjects((seedProjects as unknown[]).map(normalizeProject))
}

export function loadProjects() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getSeedProjects()
    }

    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      return cloneProjects(parsed.map(normalizeProject))
    }
  } catch {
    return getSeedProjects()
  }

  return getSeedProjects()
}

export function saveProjects(projects: Project[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloneProjects(projects)))
}

export function createId(prefix = 'project') {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
