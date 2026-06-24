import type { Project } from '../types/project'

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export function daysUntil(value: string) {
  const today = new Date()
  const target = new Date(`${value}T00:00:00`)
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
}

export function getProjectProgress(project: Project) {
  if (Number.isFinite(project.progress)) {
    return Math.max(0, Math.min(100, Math.round(project.progress)))
  }

  const metric = project.metrics[0]
  if (!metric || metric.targetValue === 0) {
    return 0
  }

  const progress = (metric.currentValue / metric.targetValue) * 100
  return Math.max(0, Math.min(100, Math.round(progress)))
}

export function getPrimaryMetric(project: Project) {
  return project.metrics[0]
}

export function dueSoon(project: Project, days = 30) {
  const remaining = daysUntil(project.dueDate)
  return remaining >= 0 && remaining <= days && project.status !== 'Complete'
}

export function shortTitle(title: string) {
  return title.length > 24 ? `${title.slice(0, 23)}...` : title
}
