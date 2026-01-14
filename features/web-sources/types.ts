// Web Watch Overview - from 16_web_watch_overview.jsonc
export interface WebWatchOverview {
  total_documents_with_conflicts: number;
  total_pending_conflicts: number;
  total_rejected_conflicts: number;
  docs_with_high_priority: number;
  docs_with_medium_priority: number;
  docs_with_low_priority: number;
  avg_conflicts_per_doc: number;
}

// Web Page Sync Overview - from 19_web_page_sync_overview.jsonc
export interface WebPageSyncOverview {
  total_web_pages: number;
  ever_synced: number;
  synced_last_24h: number;
  synced_last_7d: number;
  synced_last_30d: number;
  avg_hours_since_sync: string;
}

// Daily Syncs - from 20_syncs_per_day.jsonc
export interface DailySyncs {
  date: string;
  pages_synced: number;
  pages_with_updates: number;
}

// Computed sync coverage metrics
export interface SyncCoverage {
  period: string;
  count: number;
  percentage: number;
}

// Priority breakdown for documents
export interface PriorityBreakdown {
  priority: "high" | "medium" | "low";
  count: number;
  percentage: number;
}

// Combined API response for web sources overview
export interface WebSourcesOverviewResponse {
  webWatch: WebWatchOverview;
  syncOverview: WebPageSyncOverview;
  syncCoverage: SyncCoverage[];
  priorityBreakdown: PriorityBreakdown[];
}

// API response for daily syncs
export interface DailySyncsResponse {
  data: DailySyncs[];
}
