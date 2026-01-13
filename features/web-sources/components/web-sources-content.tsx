"use client"

import {
  IconAlertTriangle,
  IconCloudDownload,
  IconWorldWww,
  IconClock,
  IconCircleCheck,
  IconClockHour4,
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { cn } from "@/lib/utils"

import { MetricCard } from "@/features/diffs"

import { useFetchWebSourcesOverview } from "../hooks/use-fetch-web-sources-overview"
import { useFetchDailySyncs } from "../hooks/use-fetch-daily-syncs"
import { SyncActivityChart } from "./sync-activity-chart"
import { PriorityDistributionChart } from "./priority-distribution-chart"
import { SyncCoverageChart } from "./sync-coverage-chart"

export const WebSourcesContent = () => {
  const { data: overviewData, isLoading: isOverviewLoading } = useFetchWebSourcesOverview()
  const { data: dailyData, isLoading: isDailyLoading } = useFetchDailySyncs()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Web Sources</h1>
        <p className="text-sm text-muted-foreground">
          Monitor web page syncing and document conflicts from external sources
        </p>
      </div>

      {/* Web Watch Overview - Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isOverviewLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : overviewData ? (
          <>
            <MetricCard
              label="Total Web Pages"
              value={overviewData.syncOverview.total_web_pages.toLocaleString()}
              description="Tracked across all sources"
              icon={IconWorldWww}
            />
            <MetricCard
              label="Documents with Conflicts"
              value={overviewData.webWatch.total_documents_with_conflicts.toLocaleString()}
              badgeVariant="warning"
              description={`${overviewData.webWatch.avg_conflicts_per_doc.toFixed(1)} avg per doc`}
            />
            <MetricCard
              label="High Priority"
              value={overviewData.webWatch.docs_with_high_priority.toLocaleString()}
              badgeVariant="destructive"
              description="Requires immediate attention"
              icon={IconAlertTriangle}
            />
            <MetricCard
              label="Synced Today"
              value={overviewData.syncOverview.synced_last_24h.toLocaleString()}
              badge={`${Math.round((overviewData.syncOverview.synced_last_24h / overviewData.syncOverview.total_web_pages) * 100)}%`}
              description="Pages refreshed in last 24h"
              icon={IconCloudDownload}
            />
          </>
        ) : null}
      </div>

      {/* Main Charts Section - 2 column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sync Coverage Radial Chart */}
        {isOverviewLoading ? (
          <Card className="flex flex-col">
            <CardHeader className="items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-2 h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mx-auto aspect-square max-w-[280px]" />
            </CardContent>
          </Card>
        ) : overviewData ? (
          <SyncCoverageChart data={overviewData.syncOverview} />
        ) : null}

        {/* Priority Distribution Chart */}
        {isOverviewLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-2 h-4 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ) : overviewData ? (
          <PriorityDistributionChart
            data={overviewData.priorityBreakdown}
            webWatch={overviewData.webWatch}
          />
        ) : null}
      </div>

      {/* Sync Activity Chart - Full Width */}
      <SyncActivityChart
        data={dailyData?.data ?? []}
        isLoading={isDailyLoading}
      />

      {/* Sync Health Summary */}
      {isOverviewLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : overviewData ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconClock className="size-5" />
              Sync Health Summary
              <InfoTooltip content="Overview of web page sync status. Fresh pages (synced within 7 days) contain up-to-date content. Stale pages (30+ days) may have outdated information and should be re-synced." />
            </CardTitle>
            <CardDescription>
              Overview of page freshness and conflict distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <SyncHealthCard
                label="Fresh Pages"
                value={overviewData.syncOverview.synced_last_7d}
                total={overviewData.syncOverview.total_web_pages}
                description="Synced within 7 days"
                variant="success"
              />
              <SyncHealthCard
                label="Pending Conflicts"
                value={overviewData.webWatch.total_pending_conflicts}
                description="Awaiting resolution"
                variant="warning"
              />
              <SyncHealthCard
                label="Rejected"
                value={overviewData.webWatch.total_rejected_conflicts}
                description="Changes declined"
                variant="muted"
              />
              <SyncHealthCard
                label="Stale Pages"
                value={overviewData.syncOverview.total_web_pages - overviewData.syncOverview.synced_last_30d}
                total={overviewData.syncOverview.total_web_pages}
                description="Not synced in 30+ days"
                variant="destructive"
              />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

interface SyncHealthCardProps {
  label: string
  value: number
  total?: number
  description: string
  variant: "success" | "warning" | "destructive" | "muted"
}

const variantStyles = {
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  destructive: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  muted: "bg-muted text-muted-foreground",
}

const SyncHealthCard = ({ label, value, total, description, variant }: SyncHealthCardProps) => {
  const percentage = total ? Math.round((value / total) * 100) : null

  return (
    <div className={`rounded-lg p-4 ${variantStyles[variant]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
        {percentage !== null && (
          <span className="text-sm font-medium opacity-70">{percentage}%</span>
        )}
      </div>
      <p className="mt-1 text-xs opacity-70">{description}</p>
    </div>
  )
}

const MetricCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-2 h-3 w-32" />
      </CardContent>
    </Card>
  )
}
