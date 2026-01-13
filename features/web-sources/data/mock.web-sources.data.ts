import type {
  WebWatchOverview,
  WebPageSyncOverview,
  DailySyncs,
  SyncCoverage,
  PriorityBreakdown,
} from "../types"

// From 16_web_watch_overview.jsonc
export const webWatchOverview: WebWatchOverview = {
  total_documents_with_conflicts: 1842,
  total_pending_conflicts: 5840,
  total_rejected_conflicts: 2300,
  docs_with_high_priority: 287,
  docs_with_medium_priority: 642,
  docs_with_low_priority: 913,
  avg_conflicts_per_doc: 3.17,
}

// From 19_web_page_sync_overview.jsonc
export const webPageSyncOverview: WebPageSyncOverview = {
  total_web_pages: 8242,
  ever_synced: 8242,
  synced_last_24h: 2847,
  synced_last_7d: 6521,
  synced_last_30d: 7918,
  avg_hours_since_sync: "18.45",
}

// From 20_syncs_per_day.jsonc
export const dailySyncs: DailySyncs[] = [
  { date: "2026-01-12", pages_synced: 2847, pages_with_updates: 1456 },
  { date: "2026-01-11", pages_synced: 1623, pages_with_updates: 834 },
  { date: "2026-01-10", pages_synced: 3142, pages_with_updates: 1687 },
  { date: "2026-01-09", pages_synced: 2891, pages_with_updates: 1523 },
  { date: "2026-01-08", pages_synced: 3568, pages_with_updates: 1892 },
  { date: "2026-01-07", pages_synced: 3421, pages_with_updates: 1745 },
  { date: "2026-01-06", pages_synced: 3289, pages_with_updates: 1678 },
  { date: "2026-01-05", pages_synced: 1834, pages_with_updates: 945 },
  { date: "2026-01-04", pages_synced: 1612, pages_with_updates: 823 },
]

// Computed sync coverage breakdown
export const syncCoverage: SyncCoverage[] = [
  {
    period: "Last 24h",
    count: 2847,
    percentage: Math.round((2847 / 8242) * 100),
  },
  {
    period: "Last 7 days",
    count: 6521,
    percentage: Math.round((6521 / 8242) * 100),
  },
  {
    period: "Last 30 days",
    count: 7918,
    percentage: Math.round((7918 / 8242) * 100),
  },
  {
    period: "Stale (>30d)",
    count: 8242 - 7918,
    percentage: Math.round(((8242 - 7918) / 8242) * 100),
  },
]

// Priority breakdown for documents with conflicts
export const priorityBreakdown: PriorityBreakdown[] = [
  {
    priority: "high",
    count: 287,
    percentage: Math.round((287 / 1842) * 100),
  },
  {
    priority: "medium",
    count: 642,
    percentage: Math.round((642 / 1842) * 100),
  },
  {
    priority: "low",
    count: 913,
    percentage: Math.round((913 / 1842) * 100),
  },
]
