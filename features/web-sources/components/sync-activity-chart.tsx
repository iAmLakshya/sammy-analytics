"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import type { DailySyncs } from "../types";

const chartConfig = {
  pages_synced: {
    label: "Pages Synced",
    color: "var(--chart-3)",
  },
  pages_with_updates: {
    label: "With Updates",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface SyncActivityChartProps {
  data: DailySyncs[];
  isLoading?: boolean;
}

export const SyncActivityChart = ({
  data,
  isLoading,
}: SyncActivityChartProps) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  const stats = useMemo(() => {
    const totalSynced = data.reduce((acc, curr) => acc + curr.pages_synced, 0);
    const totalUpdates = data.reduce(
      (acc, curr) => acc + curr.pages_with_updates,
      0
    );
    const avgSynced = Math.round(totalSynced / data.length);
    const updateRate = Math.round((totalUpdates / totalSynced) * 100);
    return { totalSynced, totalUpdates, avgSynced, updateRate };
  }, [data]);

  if (isLoading) {
    return <SyncActivityChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Sync Activity</CardTitle>
        <CardDescription>
          Pages synced and updates detected over time
        </CardDescription>
        <CardAction>
          <Badge variant="outline">Last 9 days</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <defs>
              <linearGradient id="fillSynced" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pages_synced)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pages_synced)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillUpdates" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pages_with_updates)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pages_with_updates)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="pages_with_updates"
              type="natural"
              fill="url(#fillUpdates)"
              stroke="var(--color-pages_with_updates)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="pages_synced"
              type="natural"
              fill="url(#fillSynced)"
              stroke="var(--color-pages_synced)"
              strokeWidth={2}
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalSynced.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Synced</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums">
              {stats.avgSynced.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Avg/Day</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalUpdates.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Updates Found</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums text-primary">
              {stats.updateRate}%
            </p>
            <p className="text-xs text-muted-foreground">Update Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SyncActivityChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
        <div className="mt-4 grid grid-cols-4 gap-4 border-t pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="mx-auto h-8 w-16" />
              <Skeleton className="mx-auto mt-1 h-3 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
