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

import type { ConflictReviewActivity } from "../types";

const chartConfig = {
  reviews_completed: {
    label: "Reviews",
    color: "var(--chart-2)",
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

interface ReviewActivityChartProps {
  data: ConflictReviewActivity[];
  isLoading?: boolean;
}

export const ReviewActivityChart = ({
  data,
  isLoading,
}: ReviewActivityChartProps) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  const totalReviews = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.reviews_completed, 0);
  }, [data]);

  const avgReviewers = useMemo(() => {
    const total = data.reduce((acc, curr) => acc + curr.unique_reviewers, 0);
    return (total / data.length).toFixed(1);
  }, [data]);

  if (isLoading) {
    return <ReviewActivityChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Activity</CardTitle>
        <CardDescription>
          Daily reviews completed with acceptance breakdown
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
              dataKey="rejected"
              type="monotone"
              fill="var(--color-rejected)"
              fillOpacity={0.3}
              stroke="var(--color-rejected)"
              stackId="a"
            />
            <Area
              dataKey="accepted"
              type="monotone"
              fill="var(--color-accepted)"
              fillOpacity={0.3}
              stroke="var(--color-accepted)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total reviews:</span>
            <span className="font-medium tabular-nums">
              {totalReviews.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Avg reviewers/day:</span>
            <span className="font-medium tabular-nums">{avgReviewers}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewActivityChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-2 h-4 w-60" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
};
