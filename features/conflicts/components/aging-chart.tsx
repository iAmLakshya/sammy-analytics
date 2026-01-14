"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import type { PendingConflictsAging } from "../types";

const chartConfig = {
  count: {
    label: "Conflicts",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface AgingChartProps {
  data: PendingConflictsAging;
  isLoading?: boolean;
}

export const AgingChart = ({ data, isLoading }: AgingChartProps) => {
  const chartData = useMemo(() => {
    return [
      { bucket: "< 24h", count: data.last_24h, color: "var(--chart-1)" },
      {
        bucket: "1-7 days",
        count: data.last_7d - data.last_24h,
        color: "var(--chart-2)",
      },
      {
        bucket: "7-30 days",
        count: data.last_30d - data.last_7d,
        color: "var(--chart-3)",
      },
      {
        bucket: "> 30 days",
        count: data.older_than_30d,
        color: "var(--chart-4)",
      },
    ];
  }, [data]);

  if (isLoading) {
    return <AgingChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Conflicts Aging</CardTitle>
        <CardDescription>
          How long conflicts have been waiting for review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bucket"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={4}>
              {chartData.map((entry) => (
                <Cell key={entry.bucket} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border p-3 text-center">
            <div className="text-xs text-muted-foreground">Total Pending</div>
            <div className="text-xl font-semibold tabular-nums">
              {data.total_pending.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-xs text-muted-foreground">Avg Age</div>
            <div className="text-xl font-semibold tabular-nums">
              {parseFloat(data.avg_age_hours).toFixed(0)}h
            </div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-xs text-muted-foreground">Last 24h</div>
            <div className="text-xl font-semibold tabular-nums">
              {data.last_24h.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-destructive">
              <IconAlertTriangle className="size-3" />
              <span>Stale (&gt;30d)</span>
            </div>
            <div className="text-xl font-semibold tabular-nums text-destructive">
              {data.older_than_30d.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AgingChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
