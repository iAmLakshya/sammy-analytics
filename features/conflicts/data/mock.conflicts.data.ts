import type {
  ConflictDispositionSummary,
  DailyConflicts,
  ConflictReviewActivity,
  TimeToReview,
  UserCorrections,
  ConflictsByPriority,
  PendingConflictsAging,
} from "../types"

// From 9_conflict_disposition_summary.jsonc
export const dispositionSummary: ConflictDispositionSummary[] = [
  { disposition: "NEEDS_REVIEW", count: 5840, percentage: "38.70" },
  { disposition: "ACCEPTED", count: 6950, percentage: "46.05" },
  { disposition: "REJECTED", count: 2300, percentage: "15.25" },
]

// From 10_conflicts_per_day.jsonc
export const dailyConflicts: DailyConflicts[] = [
  { date: "2026-01-12", conflicts_created: 289, needs_review: 124, accepted: 135, rejected: 30 },
  { date: "2026-01-11", conflicts_created: 156, needs_review: 67, accepted: 72, rejected: 17 },
  { date: "2026-01-10", conflicts_created: 342, needs_review: 145, accepted: 159, rejected: 38 },
  { date: "2026-01-09", conflicts_created: 298, needs_review: 128, accepted: 138, rejected: 32 },
  { date: "2026-01-08", conflicts_created: 412, needs_review: 178, accepted: 186, rejected: 48 },
  { date: "2026-01-07", conflicts_created: 385, needs_review: 165, accepted: 174, rejected: 46 },
  { date: "2026-01-06", conflicts_created: 367, needs_review: 156, accepted: 168, rejected: 43 },
  { date: "2026-01-05", conflicts_created: 198, needs_review: 84, accepted: 92, rejected: 22 },
  { date: "2026-01-04", conflicts_created: 167, needs_review: 71, accepted: 78, rejected: 18 },
]

// From 11_conflict_review_activity.jsonc
export const reviewActivity: ConflictReviewActivity[] = [
  { date: "2026-01-12", reviews_completed: 165, accepted: 135, rejected: 30, unique_reviewers: 6 },
  { date: "2026-01-11", reviews_completed: 89, accepted: 72, rejected: 17, unique_reviewers: 5 },
  { date: "2026-01-10", reviews_completed: 197, accepted: 159, rejected: 38, unique_reviewers: 7 },
  { date: "2026-01-09", reviews_completed: 170, accepted: 138, rejected: 32, unique_reviewers: 6 },
  { date: "2026-01-08", reviews_completed: 234, accepted: 186, rejected: 48, unique_reviewers: 8 },
  { date: "2026-01-07", reviews_completed: 220, accepted: 174, rejected: 46, unique_reviewers: 7 },
  { date: "2026-01-06", reviews_completed: 211, accepted: 168, rejected: 43, unique_reviewers: 7 },
  { date: "2026-01-05", reviews_completed: 114, accepted: 92, rejected: 22, unique_reviewers: 4 },
  { date: "2026-01-04", reviews_completed: 96, accepted: 78, rejected: 18, unique_reviewers: 4 },
]

// From 12_time_to_review_conflicts.jsonc
export const timeToReview: TimeToReview[] = [
  {
    disposition: "ACCEPTED",
    count: 6950,
    avg_hours_to_review: "8.45",
    median_hours: "5.32",
    min_hours: "0.25",
    max_hours: "48.67",
  },
  {
    disposition: "REJECTED",
    count: 2300,
    avg_hours_to_review: "12.18",
    median_hours: "9.15",
    min_hours: "0.50",
    max_hours: "62.34",
  },
]

// From 13_user_corrections.jsonc
export const userCorrections: UserCorrections = {
  total_user_corrections: 412,
  unique_correctors: 7,
  correction_rate_percentage: "4.45",
}

// From 14_conflicts_by_priority.jsonc
export const priorityBreakdown: ConflictsByPriority[] = [
  { priority: "High", count: 2850, pending: 1240, accepted: 1285, rejected: 325 },
  { priority: "Medium", count: 6420, pending: 2580, accepted: 3010, rejected: 830 },
  { priority: "Low", count: 5820, pending: 2020, accepted: 2655, rejected: 1145 },
]

// From 15_pending_conflicts_aging.jsonc
export const pendingAging: PendingConflictsAging = {
  total_pending: 5840,
  avg_age_hours: "48.25",
  last_24h: 842,
  last_7d: 3567,
  last_30d: 5124,
  older_than_30d: 716,
}
