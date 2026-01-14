"use client";

import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { MiniSparkline } from "@/components/ui/sparkline";

import { mockKpiMetrics } from "../data/mock.submissions.data";

const getTrendDirection = (data: number[]) => {
  if (data.length < 2) return "neutral";
  const first = data[0];
  const last = data[data.length - 1];
  if (last > first * 1.02) return "up";
  if (last < first * 0.98) return "down";
  return "neutral";
};

export const AutomationKpiCards = () => {
  const completionTrend = getTrendDirection(mockKpiMetrics.completionRateTrend);
  const currentPeriod = mockKpiMetrics.periodStats[0];
  const pendingCount = mockKpiMetrics.queuedCount + mockKpiMetrics.processingCount;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Completion Rate
            <InfoTooltip content="Percentage of submissions that completed all 4 steps successfully. Higher is better — we aim for 95%+." />
          </CardDescription>
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockKpiMetrics.completionRate}%
            <MiniSparkline
              data={mockKpiMetrics.completionRateTrend}
              width={48}
              height={20}
              color="hsl(var(--chart-3))"
            />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCheck className="size-3" />
              This Month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {completionTrend === "up" && (
              <IconTrendingUp className="size-3.5 text-chart-3" />
            )}
            {completionTrend === "down" && (
              <IconTrendingDown className="size-3.5 text-chart-1" />
            )}
            {mockKpiMetrics.completedCount.toLocaleString()} of {mockKpiMetrics.totalSubmissions.toLocaleString()} submissions successful
          </div>
          <div className="text-muted-foreground">
            7-day trend shown
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Needs Attention
            <InfoTooltip content="Submissions that failed and couldn't be automatically recovered. Review these to identify recurring issues." />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockKpiMetrics.needsReviewCount}
          </CardTitle>
          <CardAction>
            <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400">
              <IconAlertTriangle className="size-3" />
              Action Required
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {mockKpiMetrics.retryingCount} scheduled for auto-retry
          </div>
          <div className="text-muted-foreground">
            Will retry tomorrow automatically
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Processing Time
            <InfoTooltip content="Average time from start to completion. Includes payroll download, data extraction, tax submission, and document upload." />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockKpiMetrics.avgProcessingTime} min
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3" />
              Per Submission
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {mockKpiMetrics.processingCount} currently processing
          </div>
          <div className="text-muted-foreground">
            Across 4 pipeline steps
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            This Period
            <InfoTooltip content="Monthly submission progress. Submissions are processed between the 20th of each month and the 20th of the next month." />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currentPeriod.completed} / {currentPeriod.total}
          </CardTitle>
          <CardAction>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
              {currentPeriod.period}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {pendingCount} pending
          </div>
          <div className="text-muted-foreground">
            {currentPeriod.failed} need review
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
