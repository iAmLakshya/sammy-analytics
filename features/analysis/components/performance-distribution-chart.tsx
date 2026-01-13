"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

import type { PerformanceBucket, AnalysisPerformance } from "../types"

const chartConfig = {
  count: {
    label: "Runs",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

interface PerformanceDistributionChartProps {
  data: PerformanceBucket[]
  performance: AnalysisPerformance
  isLoading?: boolean
}

export const PerformanceDistributionChart = ({
  data,
  performance,
  isLoading,
}: PerformanceDistributionChartProps) => {
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }

  const peakBucket = useMemo(() => {
    if (!data.length) return { range: "", count: 0, percentage: 0 }
    return data.reduce((max, curr) => (curr.count > max.count ? curr : max))
  }, [data])

  if (isLoading) {
    return <PerformanceDistributionChartSkeleton />
  }

  if (!data.length) {
    return <PerformanceDistributionChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Distribution</CardTitle>
        <CardDescription>
          Analysis run duration distribution (histogram)
        </CardDescription>
        <CardAction>
          <Badge variant="outline">Last 30 days</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="range"
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
                        <span className="font-medium">
                          {Number(value).toLocaleString()}
                        </span>{" "}
                        runs
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.payload.percentage}% of total
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="count" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.range === peakBucket.range
                      ? "var(--chart-3)"
                      : "var(--chart-2)"
                  }
                  fillOpacity={entry.range === peakBucket.range ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Average</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatDuration(performance.avg_duration_seconds)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Median</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatDuration(performance.median_duration_seconds)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Fastest</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatDuration(performance.min_duration_seconds)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Slowest</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatDuration(performance.max_duration_seconds)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PerformanceDistributionChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full" />
        <div className="mt-4 grid grid-cols-4 gap-4 border-t pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="mx-auto h-3 w-12" />
              <Skeleton className="mx-auto mt-2 h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
