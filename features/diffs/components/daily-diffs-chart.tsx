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

import type { DailyDiffs } from "../types";

const chartConfig = {
  drafts_created: {
    label: "Drafts",
    color: "var(--chart-1)",
  },
  applied_on_creation: {
    label: "Applied",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface DailyDiffsChartProps {
  data: DailyDiffs[];
  isLoading?: boolean;
}

export const DailyDiffsChart = ({ data, isLoading }: DailyDiffsChartProps) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  const totalDiffs = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.diffs_created, 0);
  }, [data]);

  const avgDailyDiffs = useMemo(() => {
    return Math.round(totalDiffs / data.length);
  }, [totalDiffs, data.length]);

  if (isLoading) {
    return <DailyDiffsChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diffs Created Over Time</CardTitle>
        <CardDescription>
          Daily breakdown of new diffs by initial state
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
              dataKey="drafts_created"
              fill="var(--color-drafts_created)"
              radius={[0, 0, 4, 4]}
              stackId="a"
            />
            <Bar
              dataKey="applied_on_creation"
              fill="var(--color-applied_on_creation)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium tabular-nums">
              {totalDiffs.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Avg/day:</span>
            <span className="font-medium tabular-nums">
              {avgDailyDiffs.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DailyDiffsChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
};
