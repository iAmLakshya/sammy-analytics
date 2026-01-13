"use client"

import { useMemo } from "react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
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

import type { WebPageSyncOverview } from "../types"

const chartConfig = {
  synced_last_24h: {
    label: "Last 24h",
    color: "var(--chart-3)",
  },
  synced_last_7d: {
    label: "Last 7 days",
    color: "var(--chart-2)",
  },
  synced_last_30d: {
    label: "Last 30 days",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface SyncCoverageChartProps {
  data: WebPageSyncOverview
  isLoading?: boolean
}

export const SyncCoverageChart = ({ data, isLoading }: SyncCoverageChartProps) => {
  const chartData = useMemo(() => {
    return [
      {
        name: "coverage",
        synced_last_24h: data.synced_last_24h,
        synced_last_7d: data.synced_last_7d - data.synced_last_24h,
        synced_last_30d: data.synced_last_30d - data.synced_last_7d,
      },
    ]
  }, [data])

  const coveragePercent = useMemo(() => {
    return Math.round((data.synced_last_7d / data.total_web_pages) * 100)
  }, [data])

  const stalePages = useMemo(() => {
    return data.total_web_pages - data.synced_last_30d
  }, [data])

  if (isLoading) {
    return <SyncCoverageChartSkeleton />
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sync Coverage</CardTitle>
        <CardDescription>Page freshness distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[280px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={140}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {coveragePercent}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 8}
                          className="fill-muted-foreground text-sm"
                        >
                          Fresh (7d)
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="synced_last_30d"
              stackId="a"
              cornerRadius={4}
              fill="var(--color-synced_last_30d)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="synced_last_7d"
              stackId="a"
              cornerRadius={4}
              fill="var(--color-synced_last_7d)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="synced_last_24h"
              stackId="a"
              cornerRadius={4}
              fill="var(--color-synced_last_24h)"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="-mt-8 w-full space-y-4 pb-6">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold tabular-nums">
                {data.synced_last_24h.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Last 24h</p>
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums">
                {data.synced_last_7d.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Last 7d</p>
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums">
                {data.synced_last_30d.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Last 30d</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-dashed p-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-muted-foreground" />
              <span className="text-sm text-muted-foreground">Stale (&gt;30d)</span>
            </div>
            <span className="font-bold tabular-nums text-muted-foreground">
              {stalePages.toLocaleString()}
            </span>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. hours since sync</span>
              <span className="text-xl font-bold tabular-nums text-primary">
                {parseFloat(data.avg_hours_since_sync).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SyncCoverageChartSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-40" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center pb-0">
        <Skeleton className="aspect-square w-full max-w-[280px] rounded-full" />
        <div className="-mt-8 w-full space-y-4 pb-6">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="mx-auto h-6 w-12" />
                <Skeleton className="mx-auto mt-1 h-3 w-10" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
