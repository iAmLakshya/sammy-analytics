import type {
  DiffStateDistribution,
  DailyDiffs,
  WeeklyDiffs,
  TimeToResolution,
  PendingDiffsBacklog,
} from "../types"

export const stateDistribution: DiffStateDistribution[] = [
  { state: "DRAFT", count: 8420, percentage: "58.30" },
  { state: "PREVIEW", count: 2180, percentage: "15.10" },
  { state: "APPLIED", count: 2950, percentage: "20.40" },
  { state: "ARCHIVED", count: 900, percentage: "6.20" },
]

export const dailyDiffs: DailyDiffs[] = [
  { date: "2026-01-12", diffs_created: 127, drafts_created: 89, applied_on_creation: 38 },
  { date: "2026-01-11", diffs_created: 94, drafts_created: 62, applied_on_creation: 32 },
  { date: "2026-01-10", diffs_created: 156, drafts_created: 98, applied_on_creation: 58 },
  { date: "2026-01-09", diffs_created: 143, drafts_created: 87, applied_on_creation: 56 },
  { date: "2026-01-08", diffs_created: 178, drafts_created: 112, applied_on_creation: 66 },
  { date: "2026-01-07", diffs_created: 189, drafts_created: 121, applied_on_creation: 68 },
  { date: "2026-01-06", diffs_created: 165, drafts_created: 103, applied_on_creation: 62 },
  { date: "2026-01-05", diffs_created: 82, drafts_created: 56, applied_on_creation: 26 },
  { date: "2026-01-04", diffs_created: 71, drafts_created: 49, applied_on_creation: 22 },
]

export const weeklyDiffs: WeeklyDiffs[] = [
  { week: "2026-01-05", diffs_created: 1205, drafts: 689, preview: 198, applied: 268, archived: 50 },
  { week: "2025-12-29", diffs_created: 1089, drafts: 612, preview: 178, applied: 243, archived: 56 },
  { week: "2025-12-22", diffs_created: 1342, drafts: 768, preview: 215, applied: 301, archived: 58 },
  { week: "2025-12-15", diffs_created: 1156, drafts: 641, preview: 189, applied: 271, archived: 55 },
  { week: "2025-12-08", diffs_created: 978, drafts: 558, preview: 152, applied: 218, archived: 50 },
  { week: "2025-12-01", diffs_created: 892, drafts: 501, preview: 142, applied: 204, archived: 45 },
  { week: "2025-11-24", diffs_created: 734, drafts: 418, preview: 118, applied: 168, archived: 30 },
  { week: "2025-11-17", diffs_created: 812, drafts: 467, preview: 128, applied: 184, archived: 33 },
]

export const timeToResolution: TimeToResolution[] = [
  {
    final_state: "PREVIEW",
    count: 2180,
    avg_hours_to_resolve: "18.45",
    median_hours: "14.32",
    min_hours: "2.15",
    max_hours: "72.80",
  },
  {
    final_state: "APPLIED",
    count: 2950,
    avg_hours_to_resolve: "36.78",
    median_hours: "28.50",
    min_hours: "4.20",
    max_hours: "168.45",
  },
  {
    final_state: "ARCHIVED",
    count: 900,
    avg_hours_to_resolve: "24.12",
    median_hours: "19.67",
    min_hours: "1.50",
    max_hours: "96.30",
  },
]

export const pendingDiffsBacklog: PendingDiffsBacklog = {
  pending_diffs: 10600,
  draft_count: 8420,
  preview_count: 2180,
  affected_documents: 1842,
  from_analysis_runs: 4521,
  oldest_diff: "2025-12-18T08:24:15.422Z",
  newest_diff: "2026-01-12T16:42:33.277Z",
  avg_age_hours: "142.35",
}
