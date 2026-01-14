import type { AnalysisOverviewResponse, DailyAnalysisResponse } from "@/features/analysis/types"
import type { ConflictsOverviewResponse, DailyConflictsResponse, ConflictActivityResponse } from "@/features/conflicts/types"
import type { DiffsOverviewResponse, DailyDiffsResponse, WeeklyDiffsResponse } from "@/features/diffs/types"
import type { TeamOverviewResponse, ReviewActivityResponse } from "@/features/team/types"
import type { WebSourcesOverviewResponse, DailySyncsResponse } from "@/features/web-sources/types"
import type { LstaTaskListResponse, LstaTaskDetailResponse, LstaTaskRetryResponse } from "@/features/lsta-automation/types"

export const API_ENDPOINTS = {
  analysis: {
    overview: "/api/analysis/overview",
    daily: "/api/analysis/daily",
  },
  conflicts: {
    overview: "/api/conflicts/overview",
    daily: "/api/conflicts/daily",
    activity: "/api/conflicts/activity",
  },
  diffs: {
    overview: "/api/diffs/overview",
    daily: "/api/diffs/daily",
    weekly: "/api/diffs/weekly",
  },
  team: {
    overview: "/api/team/overview",
    activity: "/api/team/activity",
  },
  webSources: {
    overview: "/api/web-sources/overview",
    daily: "/api/web-sources/daily",
  },
  lstaAutomations: {
    list: "/api/v1/lsta-automations",
    detail: "/api/v1/lsta-automations/:taskId",
    retry: "/api/v1/lsta-automations/:taskId/retry",
  },
} as const

export type ApiEndpointMap = {
  "/api/analysis/overview": AnalysisOverviewResponse
  "/api/analysis/daily": DailyAnalysisResponse
  "/api/conflicts/overview": ConflictsOverviewResponse
  "/api/conflicts/daily": DailyConflictsResponse
  "/api/conflicts/activity": ConflictActivityResponse
  "/api/diffs/overview": DiffsOverviewResponse
  "/api/diffs/daily": DailyDiffsResponse
  "/api/diffs/weekly": WeeklyDiffsResponse
  "/api/team/overview": TeamOverviewResponse
  "/api/team/activity": ReviewActivityResponse
  "/api/web-sources/overview": WebSourcesOverviewResponse
  "/api/web-sources/daily": DailySyncsResponse
  "/api/v1/lsta-automations": LstaTaskListResponse
  "/api/v1/lsta-automations/:taskId": LstaTaskDetailResponse
  "/api/v1/lsta-automations/:taskId/retry": LstaTaskRetryResponse
}

export type ApiEndpoint = keyof ApiEndpointMap
