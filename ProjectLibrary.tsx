export const PROJECT_TYPES = [
  'Excel Tracker',
  'HTML Presentation',
  'Data Report',
  'Policy/QI Project',
  'Dashboard',
  'Staff/Program Initiative',
  'Compliance/Review Project',
  'Training/Presentation',
  'Other',
] as const

export const PROJECT_STATUSES = [
  'Not Started',
  'In Progress',
  'Waiting',
  'Needs Review',
  'Complete',
  'On Hold',
] as const

export const PROJECT_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const

export const TREND_DIRECTIONS = [
  'Improving',
  'Stable',
  'Declining',
  'Mixed',
  'Not Available',
] as const

export const METRIC_STATUSES = [
  'On Track',
  'Watch',
  'Needs Attention',
  'Met',
  'Not Started',
] as const

export const RISK_LEVELS = ['Low', 'Moderate', 'High', 'Critical'] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]
export type TrendDirection = (typeof TREND_DIRECTIONS)[number]
export type MetricStatus = (typeof METRIC_STATUSES)[number]
export type RiskLevel = (typeof RISK_LEVELS)[number]

export type ResourceType =
  | 'Spreadsheet'
  | 'HTML'
  | 'Document'
  | 'Presentation'
  | 'Dashboard'
  | 'Image'
  | 'Folder'
  | 'Archive'
  | 'Other'

export type ResourceCategory =
  | 'Tracker'
  | 'Presentation'
  | 'Report'
  | 'Policy'
  | 'Dashboard'
  | 'Reference'
  | 'Template'
  | 'Archive'
  | 'Visual'
  | 'Other'

export type MilestoneStatus = ProjectStatus

export type MilestoneType =
  | 'Planning'
  | 'Data Review'
  | 'Deliverable'
  | 'Leadership Review'
  | 'Refresh'
  | 'Training'
  | 'Follow-up'
  | 'Other'

export type ActionStatus = 'Open' | 'In Progress' | 'Waiting' | 'Complete'

export interface ProjectMetric {
  id: string
  name: string
  currentValue: number
  targetValue: number
  unit: string
  trendDirection: TrendDirection
  status: MetricStatus
  interpretation: string
}

export interface ProjectResource {
  id: string
  name: string
  type: ResourceType
  description: string
  path: string
  lastUpdated: string
  notes: string
  category: ResourceCategory
}

export interface Milestone {
  id: string
  date: string
  title: string
  description: string
  status: MilestoneStatus
  type: MilestoneType
}

export interface ProjectNote {
  id: string
  date: string
  text: string
  nextStep: string
  owner: string
  dueDate: string
  status: ActionStatus
}

export interface ProjectActionItem {
  id: string
  title: string
  owner: string
  dueDate: string
  status: ActionStatus
  notes: string
}

export interface ProjectInput {
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
  progress: number
  tags: string[]
  metrics: ProjectMetric[]
  analystNotes: string
  numbersNarrative: string
  recommendedNextAction: string
  dataSource: string
  lastDataRefresh: string
  riskLevel: RiskLevel
  attentionFlags: string[]
  trendDirection: TrendDirection
}

export interface Project extends ProjectInput {
  id: string
  resources: ProjectResource[]
  milestones: Milestone[]
  notes: ProjectNote[]
  nextSteps: ProjectActionItem[]
}
