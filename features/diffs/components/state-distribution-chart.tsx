"use client"

import { useMemo } from "react"
import {
  IconArrowRight,
  IconFileDescription,
  IconEye,
  IconCheck,
  IconArchive,
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { SegmentedBar } from "@/components/ui/funnel"
import { ProgressRing } from "@/components/ui/gauge"

import type { DiffStateDistribution } from "../types"

const stateConfig = {
  DRAFT: {
    label: "Draft",
    color: "hsl(var(--chart-1))",
    icon: IconFileDescription,
    description: "Work in progress",
  },
  PREVIEW: {
    label: "Preview",
    color: "hsl(var(--chart-2))",
    icon: IconEye,
    description: "Ready for review",
  },
  APPLIED: {
    label: "Applied",
    color: "hsl(var(--chart-3))",
    icon: IconCheck,
    description: "Successfully merged",
  },
  ARCHIVED: {
    label: "Archived",
    color: "hsl(var(--muted-foreground))",
    icon: IconArchive,
    description: "Dismissed",
  },
}

interface StateDistributionChartProps {
  data: DiffStateDistribution[]
  isLoading?: boolean
}

export const StateDistributionChart = ({
  data,
  isLoading,
}: StateDistributionChartProps) => {
  const { segments, totalDiffs, stateData } = useMemo(() => {
    const total = data.reduce((acc, curr) => acc + curr.count, 0)
    const segs = data.map((item) => ({
      label: stateConfig[item.state]?.label || item.state,
      value: item.count,
      color: stateConfig[item.state]?.color || "var(--chart-1)",
    }))
    const stateMap = Object.fromEntries(data.map((d) => [d.state, d]))
    return { segments: segs, totalDiffs: total, stateData: stateMap }
  }, [data])

  if (isLoading) {
    return <StateDistributionChartSkeleton />
  }

  // Calculate completion rate (applied / total)
  const appliedCount = stateData["APPLIED"]?.count || 0
  const completionRate = totalDiffs > 0 ? (appliedCount / totalDiffs) * 100 : 0

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Diff Pipeline
          <InfoTooltip content="Shows the flow of diffs through different states. Diffs start as drafts, move to preview for review, then are either applied (merged) or archived (dismissed)." />
        </CardTitle>
        <CardDescription>
          Document version workflow stages
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {/* Pipeline visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pipeline Flow</span>
            <span className="font-medium tabular-nums">{totalDiffs.toLocaleString()} total</span>
          </div>
          <SegmentedBar segments={segments} height={24} showLegend={false} />
        </div>

        {/* State cards with flow indicators */}
        <div className="grid grid-cols-4 gap-2">
          {(["DRAFT", "PREVIEW", "APPLIED", "ARCHIVED"] as const).map((state, index) => {
            const config = stateConfig[state]
            const Icon = config.icon
            const stateItem = stateData[state]
            const count = stateItem?.count || 0
            const percentage = stateItem?.percentage || "0"

            return (
              <div key={state} className="relative">
                <div
                  className="rounded-lg border p-3 text-center"
                  style={{ borderColor: `${config.color}30` }}
                >
                  <Icon
                    className="mx-auto size-5 mb-1"
                    style={{ color: config.color }}
                  />
                  <div className="text-lg font-semibold tabular-nums">
                    {count.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {config.label}
                  </div>
                  <div
                    className="text-xs font-medium tabular-nums mt-0.5"
                    style={{ color: config.color }}
                  >
                    {percentage}%
                  </div>
                </div>
                {index < 3 && (
                  <IconArrowRight className="absolute -right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/40" />
                )}
              </div>
            )
          })}
        </div>

        {/* Completion metric */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div>
            <div className="text-sm font-medium">Completion Rate</div>
            <div className="text-xs text-muted-foreground">
              Diffs successfully applied
            </div>
          </div>
          <ProgressRing
            value={completionRate}
            max={100}
            size={48}
            strokeWidth={5}
            color="hsl(var(--chart-3))"
            showPercentage={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}

const StateDistributionChartSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-6 w-full rounded-full" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  )
}
