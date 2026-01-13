// Conflict disposition - from 9_conflict_disposition_summary.jsonc
export type ConflictDisposition = "NEEDS_REVIEW" | "ACCEPTED" | "REJECTED"

export interface ConflictDispositionSummary {
  disposition: ConflictDisposition
  count: number
  percentage: string
}

// Daily conflicts - from 10_conflicts_per_day.jsonc
export interface DailyConflicts {
  date: string
  conflicts_created: number
  needs_review: number
  accepted: number
  rejected: number
}

// Review activity - from 11_conflict_review_activity.jsonc
export interface ConflictReviewActivity {
  date: string
  reviews_completed: number
  accepted: number
  rejected: number
  unique_reviewers: number
}

// Time to review - from 12_time_to_review_conflicts.jsonc
export interface TimeToReview {
  disposition: "ACCEPTED" | "REJECTED"
  count: number
  avg_hours_to_review: string
  median_hours: string
  min_hours: string
  max_hours: string
}

// User corrections - from 13_user_corrections.jsonc
export interface UserCorrections {
  total_user_corrections: number
  unique_correctors: number
  correction_rate_percentage: string
}

// Priority - from 14_conflicts_by_priority.jsonc
export type PriorityLevel = "High" | "Medium" | "Low"

export interface ConflictsByPriority {
  priority: PriorityLevel
  count: number
  pending: number
  accepted: number
  rejected: number
}

// Pending aging - from 15_pending_conflicts_aging.jsonc
export interface PendingConflictsAging {
  total_pending: number
  avg_age_hours: string
  last_24h: number
  last_7d: number
  last_30d: number
  older_than_30d: number
}

// Combined API response for conflicts overview
export interface ConflictsOverviewResponse {
  dispositionSummary: ConflictDispositionSummary[]
  timeToReview: TimeToReview[]
  userCorrections: UserCorrections
  priorityBreakdown: ConflictsByPriority[]
  pendingAging: PendingConflictsAging
}

// API response for daily conflicts
export interface DailyConflictsResponse {
  data: DailyConflicts[]
}

// API response for review activity
export interface ConflictActivityResponse {
  data: ConflictReviewActivity[]
}
