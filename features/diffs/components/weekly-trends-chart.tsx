"use client";

import { IconTrendingUp } from "@tabler/icons-react";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

import type { WeeklyDiffs } from "../types";

const chartConfig = {
  drafts: {
    label: "Drafts",
    color: "var(--chart-1)",
  },
  preview: {
    label: "Preview",
    color: "var(--chart-2)",
  },
  applied: {
    label: "Applied",
    color: "var(--chart-3)",
  },
  archived: {
    label: "Archived",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface WeeklyTrendsChartProps {
  data: WeeklyDiffs[];
  isLoading?: boolean;
}

export const WeeklyTrendsChart = ({
  data,
  isLoading,
}: WeeklyTrendsChartProps) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map((item) => {
      const weekDate = new Date(item.week);
      return {
        ...item,
        week: weekDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  }, [data]);

  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const current = data[0].diffs_created;
    const previous = data[1].diffs_created;
    return ((current - previous) / previous) * 100;
  }, [data]);

  if (isLoading) {
    return <WeeklyTrendsChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Trends</CardTitle>
        <CardDescription>
          90-day view with weekly aggregation by state
        </CardDescription>
        <CardAction>
          <Badge variant="outline">Last 8 weeks</Badge>
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
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="archived"
              type="natural"
              fill="var(--color-archived)"
              fillOpacity={0.3}
              stroke="var(--color-archived)"
              stackId="a"
            />
            <Area
              dataKey="applied"
              type="natural"
              fill="var(--color-applied)"
              fillOpacity={0.4}
              stroke="var(--color-applied)"
              stackId="a"
            />
            <Area
              dataKey="preview"
              type="natural"
              fill="var(--color-preview)"
              fillOpacity={0.4}
              stroke="var(--color-preview)"
              stackId="a"
            />
            <Area
              dataKey="drafts"
              type="natural"
              fill="var(--color-drafts)"
              fillOpacity={0.4}
              stroke="var(--color-drafts)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend >= 0 ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(trend).toFixed(1)}% this week
              <IconTrendingUp
                className={`h-4 w-4 ${trend < 0 ? "rotate-180" : ""}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Comparing week-over-week activity
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const WeeklyTrendsChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-64" />
      </CardFooter>
    </Card>
  );
};
