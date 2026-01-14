"use client";

import {
  IconAlertTriangle,
  IconClock,
  IconCloudDownload,
  IconWorldWww,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Skeleton } from "@/components/ui/skeleton";

import { MetricCard } from "@/components/metric-card";

import { useFetchDailySyncs } from "../hooks/use-fetch-daily-syncs";
import { useFetchWebSourcesOverview } from "../hooks/use-fetch-web-sources-overview";
import { PriorityDistributionChart } from "./priority-distribution-chart";
import { SyncActivityChart } from "./sync-activity-chart";
import { SyncCoverageChart } from "./sync-coverage-chart";

export const WebSourcesContent = () => {
  const { data: overviewData, isLoading: isOverviewLoading } =
    useFetchWebSourcesOverview();
  const { data: dailyData, isLoading: isDailyLoading } = useFetchDailySyncs();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">External Sources</h1>
        <p className="text-sm text-muted-foreground">
          How fresh your web content is and what changes have been detected
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
              label="Pages Monitored"
              value={overviewData.syncOverview.total_web_pages.toLocaleString()}
              description="Web pages being tracked"
              icon={IconWorldWww}
            />
            <MetricCard
              label="Documents with Changes"
              value={overviewData.webWatch.total_documents_with_conflicts.toLocaleString()}
              badgeVariant="warning"
              description={`${overviewData.webWatch.avg_conflicts_per_doc.toFixed(
                1
              )} changes per doc`}
            />
            <MetricCard
              label="Urgent"
              value={overviewData.webWatch.docs_with_high_priority.toLocaleString()}
              badgeVariant="destructive"
              description="Need immediate attention"
              icon={IconAlertTriangle}
            />
            <MetricCard
              label="Checked Today"
              value={overviewData.syncOverview.synced_last_24h.toLocaleString()}
              badge={`${Math.round(
                (overviewData.syncOverview.synced_last_24h /
                  overviewData.syncOverview.total_web_pages) *
                  100
              )}%`}
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
              Content Freshness
              <InfoTooltip content="How current your external sources are. Fresh pages (checked within 7 days) have up-to-date info. Stale pages (30+ days) may be outdated." />
            </CardTitle>
            <CardDescription>
              Are your external sources up to date?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <SyncHealthCard
                label="Up to Date"
                value={overviewData.syncOverview.synced_last_7d}
                total={overviewData.syncOverview.total_web_pages}
                description="Checked within 7 days"
                variant="success"
              />
              <SyncHealthCard
                label="Issues Pending"
                value={overviewData.webWatch.total_pending_conflicts}
                description="Awaiting your review"
                variant="warning"
              />
              <SyncHealthCard
                label="Declined"
                value={overviewData.webWatch.total_rejected_conflicts}
                description="Changes not applied"
                variant="muted"
              />
              <SyncHealthCard
                label="Outdated"
                value={
                  overviewData.syncOverview.total_web_pages -
                  overviewData.syncOverview.synced_last_30d
                }
                total={overviewData.syncOverview.total_web_pages}
                description="Not checked in 30+ days"
                variant="destructive"
              />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

interface SyncHealthCardProps {
  label: string;
  value: number;
  total?: number;
  description: string;
  variant: "success" | "warning" | "destructive" | "muted";
}

const variantStyles = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  destructive:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  muted: "bg-muted text-muted-foreground",
};

const SyncHealthCard = ({
  label,
  value,
  total,
  description,
  variant,
}: SyncHealthCardProps) => {
  const percentage = total ? Math.round((value / total) * 100) : null;

  return (
    <div className={`rounded-lg p-4 ${variantStyles[variant]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-bold tabular-nums">
          {value.toLocaleString()}
        </p>
        {percentage !== null && (
          <span className="text-sm font-medium opacity-70">{percentage}%</span>
        )}
      </div>
      <p className="mt-1 text-xs opacity-70">{description}</p>
    </div>
  );
};

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
  );
};
