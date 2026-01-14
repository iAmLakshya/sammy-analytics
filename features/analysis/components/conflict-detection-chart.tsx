"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import type { DailyAnalysisRuns } from "../types";

const chartConfig = {
  conflicts_detected: {
    label: "Conflicts Detected",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ConflictDetectionChartProps {
  data: DailyAnalysisRuns[];
  isLoading?: boolean;
}

export const ConflictDetectionChart = ({
  data,
  isLoading,
}: ConflictDetectionChartProps) => {
  const chartData = useMemo(() => {
    if (!data.length) return [];
    return [...data].reverse().map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      // Calculate detection rate per day
      detection_rate:
        item.total_runs > 0
          ? ((item.runs_with_conflicts / item.total_runs) * 100).toFixed(1)
          : "0.0",
    }));
  }, [data]);

  const totalConflicts = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((acc, curr) => acc + curr.conflicts_detected, 0);
  }, [data]);

  const avgConflictsPerDay = useMemo(() => {
    if (!data.length) return 0;
    return Math.round(totalConflicts / data.length);
  }, [totalConflicts, data.length]);

  const avgConflictsPerRun = useMemo(() => {
    if (!data.length) return "0.00";
    const totalRuns = data.reduce((acc, curr) => acc + curr.total_runs, 0);
    if (totalRuns === 0) return "0.00";
    return (totalConflicts / totalRuns).toFixed(2);
  }, [totalConflicts, data]);

  if (isLoading) {
    return <ConflictDetectionChartSkeleton />;
  }

  if (!data.length) {
    return <ConflictDetectionChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conflicts Detected</CardTitle>
        <CardDescription>
          Daily conflict detection from analysis runs
        </CardDescription>
        <CardAction>
          <Badge variant="outline">Last 9 days</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
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
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(value, name, item) => (
                    <div className="flex flex-col gap-1">
                      <span>
                        <span className="font-medium">{value}</span> conflicts
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.payload.detection_rate}% detection rate
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="conflicts_detected" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`var(--chart-${(index % 4) + 1})`}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium tabular-nums">
              {totalConflicts.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Avg/day:</span>
            <span className="font-medium tabular-nums">
              {avgConflictsPerDay.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Avg/run:</span>
            <span className="font-medium tabular-nums">
              {avgConflictsPerRun}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ConflictDetectionChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
};
