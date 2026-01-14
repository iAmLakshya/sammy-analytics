"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

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

import type { DailyReviewActivity } from "../types";

const chartConfig = {
  accepted: {
    label: "Accepted",
    color: "hsl(var(--chart-3))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-5))",
  },
  unique_reviewers: {
    label: "Active Reviewers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ReviewTrendsChartProps {
  data: DailyReviewActivity[];
  isLoading?: boolean;
}

export const ReviewTrendsChart = ({
  data,
  isLoading,
}: ReviewTrendsChartProps) => {
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
    return data.reduce((acc, d) => acc + d.reviews_completed, 0);
  }, [data]);

  const avgDaily = useMemo(() => {
    return Math.round(totalReviews / data.length);
  }, [totalReviews, data.length]);

  const acceptanceRate = useMemo(() => {
    const totalAccepted = data.reduce((acc, d) => acc + d.accepted, 0);
    return Math.round((totalAccepted / totalReviews) * 100);
  }, [data, totalReviews]);

  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const recent =
      data.slice(0, 3).reduce((acc, d) => acc + d.reviews_completed, 0) / 3;
    const earlier =
      data.slice(-3).reduce((acc, d) => acc + d.reviews_completed, 0) / 3;
    return Math.round(((recent - earlier) / earlier) * 100);
  }, [data]);

  if (isLoading) {
    return <ReviewTrendsChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Activity Trends</CardTitle>
        <CardDescription>
          Daily reviews with acceptance/rejection breakdown and active reviewer
          count
        </CardDescription>
        <CardAction>
          <Badge variant="outline">
            {trend >= 0 ? "+" : ""}
            {trend}% trend
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <defs>
              <linearGradient id="fillAccepted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
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
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 10]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name, item) => {
                    const payload = item.payload;
                    if (name === "accepted") {
                      return (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ background: "var(--color-accepted)" }}
                              />
                              Accepted
                            </span>
                            <span className="font-medium tabular-nums">
                              {Number(value).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ background: "var(--color-rejected)" }}
                              />
                              Rejected
                            </span>
                            <span className="font-medium tabular-nums">
                              {payload.rejected.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 border-t pt-1 text-muted-foreground">
                            <span>Total</span>
                            <span className="font-medium tabular-nums">
                              {payload.reviews_completed.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-muted-foreground">
                            <span>Active Reviewers</span>
                            <span className="font-medium tabular-nums">
                              {payload.unique_reviewers}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="left"
              dataKey="accepted"
              type="monotone"
              fill="url(#fillAccepted)"
              stroke="var(--color-accepted)"
              strokeWidth={2}
              stackId="1"
            />
            <Area
              yAxisId="left"
              dataKey="rejected"
              type="monotone"
              fill="url(#fillRejected)"
              stroke="var(--color-rejected)"
              strokeWidth={2}
              stackId="1"
            />
            <Line
              yAxisId="right"
              dataKey="unique_reviewers"
              type="monotone"
              stroke="var(--color-unique_reviewers)"
              strokeWidth={2}
              dot={{ fill: "var(--color-unique_reviewers)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Period Total:</span>
            <span className="font-medium tabular-nums">
              {totalReviews.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Daily Avg:</span>
            <span className="font-medium tabular-nums">{avgDaily}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Acceptance Rate:</span>
            <span className="font-medium tabular-nums">{acceptanceRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewTrendsChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-80" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
};
