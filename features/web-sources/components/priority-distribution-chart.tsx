"use client";

import {
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

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

import type { PriorityBreakdown, WebWatchOverview } from "../types";

const chartConfig = {
  count: {
    label: "Documents",
  },
  high: {
    label: "High Priority",
    color: "hsl(var(--destructive))",
  },
  medium: {
    label: "Medium Priority",
    color: "hsl(var(--warning, 38 92% 50%))",
  },
  low: {
    label: "Low Priority",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

const priorityColors: Record<string, string> = {
  high: "hsl(var(--destructive))",
  medium: "hsl(38 92% 50%)",
  low: "hsl(var(--muted-foreground))",
};

const PriorityIcon = ({ priority }: { priority: string }) => {
  const className = "size-4";
  switch (priority) {
    case "high":
      return <IconAlertTriangle className={className} />;
    case "medium":
      return <IconAlertCircle className={className} />;
    default:
      return <IconInfoCircle className={className} />;
  }
};

interface PriorityDistributionChartProps {
  data: PriorityBreakdown[];
  webWatch: WebWatchOverview;
  isLoading?: boolean;
}

export const PriorityDistributionChart = ({
  data,
  webWatch,
  isLoading,
}: PriorityDistributionChartProps) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      priority: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
      count: item.count,
      percentage: item.percentage,
      fill: priorityColors[item.priority],
    }));
  }, [data]);

  if (isLoading) {
    return <PriorityDistributionChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents by Priority</CardTitle>
        <CardDescription>
          {webWatch.total_documents_with_conflicts.toLocaleString()} documents
          with conflicts requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 12 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="priority"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 space-y-3">
          {data.map((item) => (
            <div
              key={item.priority}
              className="flex items-center justify-between rounded-lg border p-3"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: priorityColors[item.priority],
              }}
            >
              <div className="flex items-center gap-2">
                <PriorityIcon priority={item.priority} />
                <span className="font-medium capitalize">
                  {item.priority} Priority
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {item.percentage}%
                </span>
                <span className="min-w-[60px] text-right font-bold tabular-nums">
                  {item.count.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Avg. conflicts per document
            </span>
            <span className="text-lg font-bold tabular-nums">
              {webWatch.avg_conflicts_per_doc.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PriorityDistributionChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[180px] w-full" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
