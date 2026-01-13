"use client"

import { useMemo } from "react"
import { IconTrendingUp } from "@tabler/icons-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

import type { DailyAnalysisRuns } from "../types"

const chartConfig = {
  total_runs: {
    label: "Total Runs",
    color: "var(--chart-3)",
  },
  runs_with_conflicts: {
    label: "With Conflicts",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface AnalysisRunsChartProps {
  data: DailyAnalysisRuns[]
  isLoading?: boolean
}

export const AnalysisRunsChart = ({
  data,
  isLoading,
}: AnalysisRunsChartProps) => {
  const chartData = useMemo(() => {
    if (!data.length) return []
    return [...data].reverse().map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))
  }, [data])

  const totalRuns = useMemo(() => {
    if (!data.length) return 0
    return data.reduce((acc, curr) => acc + curr.total_runs, 0)
  }, [data])

  const avgDetectionRate = useMemo(() => {
    if (!data.length || totalRuns === 0) return "0.0"
    const totalWithConflicts = data.reduce(
      (acc, curr) => acc + curr.runs_with_conflicts,
      0
    )
    return ((totalWithConflicts / totalRuns) * 100).toFixed(1)
  }, [data, totalRuns])

  const trend = useMemo(() => {
    if (data.length < 2) return 0
    const current = data[0].total_runs
    const previous = data[1].total_runs
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }, [data])

  if (isLoading) {
    return <AnalysisRunsChartSkeleton />
  }

  if (!data.length) {
    return <AnalysisRunsChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Runs Over Time</CardTitle>
        <CardDescription>
          Daily analysis activity with conflict detection rates
        </CardDescription>
        <CardAction>
          <Badge variant="outline">Last 9 days</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
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
              dataKey="total_runs"
              type="natural"
              fill="var(--color-total_runs)"
              fillOpacity={0.2}
              stroke="var(--color-total_runs)"
              strokeWidth={2}
            />
            <Line
              dataKey="runs_with_conflicts"
              type="natural"
              stroke="var(--color-runs_with_conflicts)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-runs_with_conflicts)" }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend >= 0 ? "Up" : "Down"} {Math.abs(trend).toFixed(1)}% from
              yesterday
              <IconTrendingUp
                className={`h-4 w-4 ${trend < 0 ? "rotate-180" : ""}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {totalRuns.toLocaleString()} total runs · {avgDetectionRate}%
              detected conflicts
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const AnalysisRunsChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-64" />
      </CardFooter>
    </Card>
  )
}
