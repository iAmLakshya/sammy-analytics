"use client"

import { useMemo } from "react"
import { IconEye, IconCheck, IconArchive } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { RangeBar } from "@/components/ui/range-bar"

import type { TimeToResolution } from "../types"

const stateConfig: Record<string, { label: string; color: string; icon: typeof IconEye }> = {
  PREVIEW: {
    label: "Ready for Review",
    color: "hsl(var(--chart-2))",
    icon: IconEye,
  },
  APPLIED: {
    label: "Published",
    color: "hsl(var(--chart-3))",
    icon: IconCheck,
  },
  ARCHIVED: {
    label: "Dismissed",
    color: "hsl(var(--muted-foreground))",
    icon: IconArchive,
  },
}

interface ResolutionTimeChartProps {
  data: TimeToResolution[]
  isLoading?: boolean
}

export const ResolutionTimeChart = ({
  data,
  isLoading,
}: ResolutionTimeChartProps) => {
  const rangeData = useMemo(() => {
    return data.map((item) => ({
      label: stateConfig[item.final_state]?.label || item.final_state,
      min: parseFloat(item.min_hours),
      median: parseFloat(item.median_hours),
      max: parseFloat(item.max_hours),
      average: parseFloat(item.avg_hours_to_resolve),
      color: stateConfig[item.final_state]?.color || "var(--chart-1)",
      count: item.count,
      state: item.final_state,
    }))
  }, [data])

  // Calculate overall averages
  const overallStats = useMemo(() => {
    if (data.length === 0) return { avgTime: 0, medianTime: 0, totalResolved: 0 }
    const totalCount = data.reduce((sum, d) => sum + d.count, 0)
    const weightedAvg = data.reduce(
      (sum, d) => sum + parseFloat(d.avg_hours_to_resolve) * d.count,
      0
    ) / totalCount
    const weightedMedian = data.reduce(
      (sum, d) => sum + parseFloat(d.median_hours) * d.count,
      0
    ) / totalCount
    return { avgTime: weightedAvg, medianTime: weightedMedian, totalResolved: totalCount }
  }, [data])

  if (isLoading) {
    return <ResolutionTimeChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Processing Time
          <InfoTooltip content="How long suggestions take to complete. Faster times mean your documents stay up-to-date. The bar shows the range, with the marker showing the typical time." />
        </CardTitle>
        <CardDescription>
          How quickly suggestions move through the pipeline
        </CardDescription>
        <CardAction>
          <Badge variant="outline">All time</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums">
              {overallStats.avgTime.toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div className="text-center border-x">
            <div className="text-2xl font-bold tabular-nums">
              {overallStats.medianTime.toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">Typical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums">
              {overallStats.totalResolved.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Completed</div>
          </div>
        </div>

        {/* Range bars for each state */}
        <div className="space-y-8 pt-2">
          {rangeData.map((item) => {
            const config = stateConfig[item.state]
            const Icon = config?.icon

            return (
              <div key={item.state} className="space-y-2">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="size-4" style={{ color: item.color }} />}
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {item.count.toLocaleString()} suggestions
                  </span>
                </div>
                <RangeBar
                  min={item.min}
                  median={item.median}
                  max={item.max}
                  average={item.average}
                  label=""
                  unit="h"
                  color={item.color}
                />
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-muted-foreground/30" />
            <span>Range (fastest to slowest)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-2 rounded-sm bg-chart-1" />
            <span>Typical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-0.5 bg-foreground" />
            <span>Average</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ResolutionTimeChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
