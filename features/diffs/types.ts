// Diff state distribution - from 1.jsonc
export type DiffState = "DRAFT" | "PREVIEW" | "APPLIED" | "ARCHIVED"

export interface DiffStateDistribution {
  state: DiffState
  count: number
  percentage: string
}

// Daily diffs - from 3_diffs_per_day.jsonc
export interface DailyDiffs {
  date: string
  diffs_created: number
  drafts_created: number
  applied_on_creation: number
}

// Weekly diffs - from 4_diffs_weekly.jsonc
export interface WeeklyDiffs {
  week: string
  diffs_created: number
  drafts: number
  preview: number
  applied: number
  archived: number
}

// Time to resolution - from 6_time_to_resolution.jsonc
export type ResolutionState = "PREVIEW" | "APPLIED" | "ARCHIVED"

export interface TimeToResolution {
  final_state: ResolutionState
  count: number
  avg_hours_to_resolve: string
  median_hours: string
  min_hours: string
  max_hours: string
}

// Pending diffs backlog - from 7_pending_diffs_backlog.jsonc
export interface PendingDiffsBacklog {
  pending_diffs: number
  draft_count: number
  preview_count: number
  affected_documents: number
  from_analysis_runs: number
  oldest_diff: string
  newest_diff: string
  avg_age_hours: string
}

// Combined API response for diffs overview
export interface DiffsOverviewResponse {
  stateDistribution: DiffStateDistribution[]
  backlog: PendingDiffsBacklog
  timeToResolution: TimeToResolution[]
}

// API response for daily diffs
export interface DailyDiffsResponse {
  data: DailyDiffs[]
}

// API response for weekly diffs
export interface WeeklyDiffsResponse {
  data: WeeklyDiffs[]
}
