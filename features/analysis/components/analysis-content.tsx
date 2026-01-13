"use client"

import { useMemo } from "react"
import {
  IconActivity,
  IconBrain,
  IconClock,
  IconTarget,
  IconChartBar,
  IconAlertCircle,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { MetricCard } from "@/features/diffs"
import { useFetchAnalysisOverview } from "../hooks/use-fetch-analysis-overview"
import { useFetchDailyAnalysis } from "../hooks/use-fetch-daily-analysis"
import { AnalysisRunsTable } from "./analysis-runs-table"
import { AnalysisRunsChart } from "./analysis-runs-chart"
import { ConflictDetectionChart } from "./conflict-detection-chart"
import { PerformanceDistributionChart } from "./performance-distribution-chart"

export const AnalysisContent = () => {
  const {
    data: overview,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useFetchAnalysisOverview()

  const {
    data: dailyData,
    isLoading: isDailyLoading,
    error: dailyError,
  } = useFetchDailyAnalysis()

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    if (mins === 0) return `${secs}s`
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }

  // Calculate detection rate from daily data
  const detectionRate = useMemo(() => {
    if (!dailyData?.data?.length) return null
    const totalRuns = dailyData.data.reduce((acc, d) => acc + d.total_runs, 0)
    const runsWithConflicts = dailyData.data.reduce(
      (acc, d) => acc + d.runs_with_conflicts,
      0
    )
    return ((runsWithConflicts / totalRuns) * 100).toFixed(1)
  }, [dailyData])

  // Calculate today's stats
  const todayStats = useMemo(() => {
    if (!dailyData?.data?.length) return null
    const today = dailyData.data[0]
    return {
      runs: today.total_runs,
      conflicts: today.conflicts_detected,
      rate: ((today.runs_with_conflicts / today.total_runs) * 100).toFixed(1),
    }
  }, [dailyData])

  if (overviewError || dailyError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <IconAlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Failed to load analysis data</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Automated Scanning</h1>
        <p className="text-sm text-muted-foreground">
          How well the AI is finding issues in your documents
        </p>
      </div>

      {/* Performance Overview - Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isOverviewLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : overview ? (
          <>
            <MetricCard
              label="Scans Completed"
              value={overview.performance.completed_runs.toLocaleString()}
              description="Last 30 days"
              icon={IconBrain}
            />
            <MetricCard
              label="Scan Speed"
              value={formatDuration(overview.performance.avg_duration_seconds)}
              description={`Typical: ${formatDuration(overview.performance.median_duration_seconds)}`}
              icon={IconClock}
            />
            <MetricCard
              label="Issue Detection"
              value={detectionRate ? `${detectionRate}%` : "—"}
              badge={detectionRate && Number(detectionRate) > 70 ? "High" : undefined}
              badgeVariant={
                detectionRate && Number(detectionRate) > 70
                  ? "success"
                  : undefined
              }
              description="Scans that found issues"
              icon={IconTarget}
            />
            <MetricCard
              label="Today's Activity"
              value={todayStats ? todayStats.runs.toLocaleString() : "—"}
              description={
                todayStats
                  ? `${todayStats.conflicts} issues found`
                  : "Loading..."
              }
              icon={IconActivity}
            />
          </>
        ) : null}
      </div>

      {/* Charts Grid - Analysis Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalysisRunsChart
          data={dailyData?.data ?? []}
          isLoading={isDailyLoading}
        />
        <ConflictDetectionChart
          data={dailyData?.data ?? []}
          isLoading={isDailyLoading}
        />
      </div>

      {/* Performance Distribution */}
      <PerformanceDistributionChart
        data={overview?.performanceDistribution ?? []}
        performance={
          overview?.performance ?? {
            completed_runs: 0,
            avg_duration_seconds: 0,
            median_duration_seconds: 0,
            min_duration_seconds: 0,
            max_duration_seconds: 0,
          }
        }
        isLoading={isOverviewLoading}
      />

      {/* Detailed Table */}
      <AnalysisRunsTable
        data={dailyData?.data ?? []}
        isLoading={isDailyLoading}
      />

      {/* System Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChartBar className="h-5 w-5" />
            AI Performance Summary
          </CardTitle>
          <CardDescription>
            How well the automated scanning is working
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InsightCard
              title="Speed"
              value={
                overview
                  ? `${formatDuration(overview.performance.median_duration_seconds)} typical`
                  : "—"
              }
              status={
                overview && overview.performance.median_duration_seconds < 600
                  ? "good"
                  : "warning"
              }
              description="Scans completing quickly"
            />
            <InsightCard
              title="Accuracy"
              value={detectionRate ? `${detectionRate}% detection` : "—"}
              status={
                detectionRate && Number(detectionRate) > 70 ? "good" : "warning"
              }
              description="Finding issues reliably"
            />
            <InsightCard
              title="Capacity"
              value={
                todayStats
                  ? `${todayStats.runs.toLocaleString()} scans today`
                  : "—"
              }
              status="good"
              description="Handling your document volume"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper component for insight cards
const InsightCard = ({
  title,
  value,
  status,
  description,
}: {
  title: string
  value: string
  status: "good" | "warning" | "critical"
  description: string
}) => {
  const statusColors = {
    good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    critical:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <Badge className={statusColors[status]}>
          {status === "good" ? "Healthy" : status === "warning" ? "Monitor" : "Action"}
        </Badge>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

const MetricCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-8 w-20" />
        <Skeleton className="mt-2 h-3 w-32" />
      </CardContent>
    </Card>
  )
}
