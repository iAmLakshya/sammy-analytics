"use client"

import {
  IconArchive,
  IconCheck,
  IconClock,
  IconFileDescription,
  IconAlertCircle,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InfoTooltip } from "@/components/ui/info-tooltip"

import { useFetchDailyDiffs } from "../hooks/use-fetch-daily-diffs"
import { useFetchDiffsOverview } from "../hooks/use-fetch-diffs-overview"
import { useFetchWeeklyDiffs } from "../hooks/use-fetch-weekly-diffs"
import { DailyDiffsChart } from "./daily-diffs-chart"
import { MetricCard } from "./metric-card"
import { MetricGrid } from "./metric-grid"
import { ResolutionTimeChart } from "./resolution-time-chart"
import { StateDistributionChart } from "./state-distribution-chart"
import { WeeklyTrendsChart } from "./weekly-trends-chart"

export const DiffsContent = () => {
  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    error: overviewError,
  } = useFetchDiffsOverview()
  const {
    data: dailyData,
    isLoading: isLoadingDaily,
    error: dailyError,
  } = useFetchDailyDiffs()
  const {
    data: weeklyData,
    isLoading: isLoadingWeekly,
    error: weeklyError,
  } = useFetchWeeklyDiffs()

  const formatNumber = (num: number) => num.toLocaleString()

  const getStateCard = (state: string) => {
    if (!overviewData?.stateDistribution) return null
    return overviewData.stateDistribution.find((s) => s.state === state)
  }

  const totalDiffs =
    overviewData?.stateDistribution.reduce((acc, curr) => acc + curr.count, 0) ??
    0

  // Check if backlog is critical
  const avgAgeHours = parseFloat(overviewData?.backlog.avg_age_hours ?? "0")
  const isBacklogCritical = avgAgeHours > 168 // More than 7 days

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Diffs Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track document version changes, state transitions, and resolution times
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoadingOverview ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-8 w-32" />
              </CardHeader>
              <Skeleton className="mx-6 mb-4 h-4 w-36" />
            </Card>
          ))
        ) : (
          <>
            <MetricCard
              label="Total Diffs"
              value={formatNumber(totalDiffs)}
              description="All time document diffs"
              icon={IconFileDescription}
            />
            <MetricCard
              label="Draft"
              value={formatNumber(getStateCard("DRAFT")?.count ?? 0)}
              badge={`${getStateCard("DRAFT")?.percentage ?? 0}%`}
              description="Awaiting review"
              icon={IconClock}
            />
            <MetricCard
              label="Applied"
              value={formatNumber(getStateCard("APPLIED")?.count ?? 0)}
              badge={`${getStateCard("APPLIED")?.percentage ?? 0}%`}
              badgeVariant="success"
              description="Successfully merged"
              icon={IconCheck}
            />
            <MetricCard
              label="Archived"
              value={formatNumber(getStateCard("ARCHIVED")?.count ?? 0)}
              badge={`${getStateCard("ARCHIVED")?.percentage ?? 0}%`}
              description="Dismissed or superseded"
              icon={IconArchive}
            />
          </>
        )}
      </div>

      {/* Charts Row - Pipeline + Resolution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StateDistributionChart
          data={overviewData?.stateDistribution ?? []}
          isLoading={isLoadingOverview}
        />
        <ResolutionTimeChart
          data={overviewData?.timeToResolution ?? []}
          isLoading={isLoadingOverview}
        />
      </div>

      {/* Pending Backlog - Moved up for visibility */}
      <Card className={isBacklogCritical ? "border-destructive/50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isBacklogCritical && <IconAlertCircle className="size-5 text-destructive" />}
            Pending Diffs Backlog
            <InfoTooltip content="Diffs waiting to be reviewed. High average age or large backlog indicates review bottlenecks that need attention." />
          </CardTitle>
          <CardDescription>
            Current unresolved diffs requiring attention
          </CardDescription>
          <CardAction>
            <Badge variant={isBacklogCritical ? "destructive" : "outline"}>
              {isBacklogCritical ? "Needs Attention" : "Live"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoadingOverview ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <MetricGrid
              columns={4}
              items={[
                {
                  label: "Total Pending",
                  value: formatNumber(
                    overviewData?.backlog.pending_diffs ?? 0
                  ),
                  highlight: true,
                },
                {
                  label: "Affected Documents",
                  value: formatNumber(
                    overviewData?.backlog.affected_documents ?? 0
                  ),
                },
                {
                  label: "Analysis Runs",
                  value: formatNumber(
                    overviewData?.backlog.from_analysis_runs ?? 0
                  ),
                },
                {
                  label: "Avg Age",
                  value: `${overviewData?.backlog.avg_age_hours ?? 0}h`,
                  subtext: avgAgeHours > 168 ? "⚠ Over 7 days" : "Hours in queue",
                },
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DailyDiffsChart
          data={dailyData?.data ?? []}
          isLoading={isLoadingDaily}
        />
        <WeeklyTrendsChart
          data={weeklyData?.data ?? []}
          isLoading={isLoadingWeekly}
        />
      </div>
    </div>
  )
}
