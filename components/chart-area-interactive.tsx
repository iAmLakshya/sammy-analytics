"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart for diffs and conflicts";

const chartData = [
  { date: "2026-01-04", diffs: 71, conflicts: 167 },
  { date: "2026-01-05", diffs: 82, conflicts: 198 },
  { date: "2026-01-06", diffs: 165, conflicts: 367 },
  { date: "2026-01-07", diffs: 189, conflicts: 385 },
  { date: "2026-01-08", diffs: 178, conflicts: 412 },
  { date: "2026-01-09", diffs: 143, conflicts: 298 },
  { date: "2026-01-10", diffs: 156, conflicts: 342 },
  { date: "2026-01-11", diffs: 94, conflicts: 156 },
  { date: "2026-01-12", diffs: 127, conflicts: 289 },
];

const chartConfig = {
  activity: {
    label: "Activity",
  },
  diffs: {
    label: "Diffs Created",
    color: "hsl(var(--chart-2))",
  },
  conflicts: {
    label: "Conflicts Detected",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const ChartAreaInteractive = () => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2026-01-12");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Diffs created and conflicts detected over time
          </span>
          <span className="@[540px]/card:hidden">Diffs &amp; Conflicts</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDiffs" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-diffs)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-diffs)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillConflicts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-conflicts)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-conflicts)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="diffs"
              type="natural"
              fill="url(#fillDiffs)"
              stroke="var(--color-diffs)"
            />
            <Area
              dataKey="conflicts"
              type="natural"
              fill="url(#fillConflicts)"
              stroke="var(--color-conflicts)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
