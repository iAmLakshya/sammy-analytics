"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

import type { DailyConflicts } from "../types";

const chartConfig = {
  needs_review: {
    label: "Needs Review",
    color: "var(--chart-1)",
  },
  accepted: {
    label: "Accepted",
    color: "var(--chart-3)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface DailyConflictsChartProps {
  data: DailyConflicts[];
  isLoading?: boolean;
}

export const DailyConflictsChart = ({
  data,
  isLoading,
}: DailyConflictsChartProps) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  const totalConflicts = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.conflicts_created, 0);
  }, [data]);

  const avgDaily = useMemo(() => {
    return Math.round(totalConflicts / data.length);
  }, [totalConflicts, data.length]);

  if (isLoading) {
    return <DailyConflictsChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conflicts Over Time</CardTitle>
        <CardDescription>
          Daily conflict creation with disposition breakdown
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
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="needs_review"
              fill="var(--color-needs_review)"
              radius={[0, 0, 4, 4]}
              stackId="a"
            />
            <Bar
              dataKey="accepted"
              fill="var(--color-accepted)"
              radius={[0, 0, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="rejected"
              fill="var(--color-rejected)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
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
              {avgDaily.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DailyConflictsChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-44" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
};
