"use client"

import {
  IconAlertTriangle,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

import { MetricCard } from "@/features/diffs"

import { useFetchConflictsOverview } from "../hooks/use-fetch-conflicts-overview"
import { useFetchDailyConflicts } from "../hooks/use-fetch-daily-conflicts"
import { useFetchConflictActivity } from "../hooks/use-fetch-conflict-activity"

import { DispositionChart } from "./disposition-chart"
import { DailyConflictsChart } from "./daily-conflicts-chart"
import { ReviewActivityChart } from "./review-activity-chart"
import { PriorityChart } from "./priority-chart"
import { AgingChart } from "./aging-chart"
import { TimeToReviewCard } from "./time-to-review-card"
import { UserCorrectionsCard } from "./user-corrections-card"

export const ConflictsContent = () => {
  const { data: overview, isLoading: isLoadingOverview } = useFetchConflictsOverview()
  const { data: dailyData, isLoading: isLoadingDaily } = useFetchDailyConflicts()
  const { data: activityData, isLoading: isLoadingActivity } = useFetchConflictActivity()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Content Issues</h1>
        <p className="text-sm text-muted-foreground">
          See what needs your team's attention and how reviews are progressing
        </p>
      </div>

      {/* Disposition Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Awaiting Review"
          value={overview?.dispositionSummary.find(d => d.disposition === "NEEDS_REVIEW")?.count.toLocaleString() ?? "—"}
          badge={overview?.dispositionSummary.find(d => d.disposition === "NEEDS_REVIEW")?.percentage + "%"}
          badgeVariant="warning"
          description="Your team needs to decide"
          icon={IconAlertTriangle}
          isLoading={isLoadingOverview}
        />
        <MetricCard
          label="Approved"
          value={overview?.dispositionSummary.find(d => d.disposition === "ACCEPTED")?.count.toLocaleString() ?? "—"}
          badge={overview?.dispositionSummary.find(d => d.disposition === "ACCEPTED")?.percentage + "%"}
          badgeVariant="success"
          description="Changes applied to documents"
          icon={IconCheck}
          isLoading={isLoadingOverview}
        />
        <MetricCard
          label="Declined"
          value={overview?.dispositionSummary.find(d => d.disposition === "REJECTED")?.count.toLocaleString() ?? "—"}
          badge={overview?.dispositionSummary.find(d => d.disposition === "REJECTED")?.percentage + "%"}
          badgeVariant="destructive"
          description="Changes not applied"
          icon={IconX}
          isLoading={isLoadingOverview}
        />
      </div>

      {/* Charts Row 1: Disposition Donut + Priority */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DispositionChart
          data={overview?.dispositionSummary ?? []}
          isLoading={isLoadingOverview}
        />
        <PriorityChart
          data={overview?.priorityBreakdown ?? []}
          isLoading={isLoadingOverview}
        />
      </div>

      {/* Daily Conflicts Chart */}
      <DailyConflictsChart
        data={dailyData?.data ?? []}
        isLoading={isLoadingDaily}
      />

      {/* Charts Row 2: Review Activity */}
      <ReviewActivityChart
        data={activityData?.data ?? []}
        isLoading={isLoadingActivity}
      />

      {/* Aging Chart */}
      <AgingChart
        data={overview?.pendingAging ?? { total_pending: 0, avg_age_hours: "0", last_24h: 0, last_7d: 0, last_30d: 0, older_than_30d: 0 }}
        isLoading={isLoadingOverview}
      />

      {/* Time to Review + User Corrections */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TimeToReviewCard
          data={overview?.timeToReview ?? []}
          isLoading={isLoadingOverview}
        />
        <UserCorrectionsCard
          data={overview?.userCorrections ?? { total_user_corrections: 0, unique_correctors: 0, correction_rate_percentage: "0" }}
          isLoading={isLoadingOverview}
        />
      </div>
    </div>
  )
}
