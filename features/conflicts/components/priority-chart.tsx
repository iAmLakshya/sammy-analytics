"use client"

import { useMemo } from "react"
import {
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
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
import { cn } from "@/lib/utils"

import type { ConflictsByPriority } from "../types"

const priorityConfig = {
  High: {
    label: "Urgent",
    icon: IconAlertCircle,
    iconColor: "text-primary",
    barColor: "hsl(var(--primary))",
  },
  Medium: {
    label: "Normal",
    icon: IconAlertTriangle,
    iconColor: "text-primary/70",
    barColor: "hsl(var(--primary) / 0.7)",
  },
  Low: {
    label: "Low",
    icon: IconInfoCircle,
    iconColor: "text-primary/50",
    barColor: "hsl(var(--primary) / 0.5)",
  },
}

interface PriorityChartProps {
  data: ConflictsByPriority[]
  isLoading?: boolean
}

export const PriorityChart = ({ data, isLoading }: PriorityChartProps) => {
  const { totalPending, highPriorityPending, sortedData } = useMemo(() => {
    const pending = data.reduce((acc, curr) => acc + curr.pending, 0)
    const highPending = data.find((d) => d.priority === "High")?.pending || 0
    // Sort by priority: High, Medium, Low
    const sorted = [...data].sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 }
      return order[a.priority] - order[b.priority]
    })
    return { totalPending: pending, highPriorityPending: highPending, sortedData: sorted }
  }, [data])

  if (isLoading) {
    return <PriorityChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          By Urgency
          <InfoTooltip content="Issues sorted by how quickly they need attention. Urgent issues affect important documents and should be handled first." />
        </CardTitle>
        <CardDescription>
          Which issues need your attention first
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Priority cards */}
        {sortedData.map((item) => {
          const config = priorityConfig[item.priority]
          const Icon = config.icon
          const pendingPercent = item.count > 0 ? (item.pending / item.count) * 100 : 0
          const acceptedPercent = item.count > 0 ? (item.accepted / item.count) * 100 : 0
          const rejectedPercent = item.count > 0 ? (item.rejected / item.count) * 100 : 0

          return (
            <div
              key={item.priority}
              className="rounded-lg border p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={cn("size-4", config.iconColor)} />
                  <span className="font-medium">{config.label} Priority</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums">{item.count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">total</div>
                </div>
              </div>

              {/* Distribution bar */}
              <SegmentedBar
                segments={[
                  { label: "Pending", value: item.pending, color: "hsl(var(--chart-1))" },
                  { label: "Accepted", value: item.accepted, color: "hsl(var(--chart-3))" },
                  { label: "Rejected", value: item.rejected, color: "hsl(var(--chart-5))" },
                ]}
                height={8}
                showLegend={false}
              />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div className="text-center">
                  <div className="font-medium tabular-nums">{item.pending.toLocaleString()}</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
                <div className="text-center border-x">
                  <div className="font-medium tabular-nums">
                    {item.accepted.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="font-medium tabular-nums">
                    {item.rejected.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Rejected</div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Summary footer */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 mt-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Total awaiting review: </span>
            <span className="font-semibold tabular-nums">{totalPending.toLocaleString()}</span>
          </div>
          {highPriorityPending > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <IconAlertCircle className="size-4 text-primary" />
              <span className="font-semibold tabular-nums">
                {highPriorityPending.toLocaleString()}
              </span>
              <span className="text-muted-foreground">urgent</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const PriorityChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}
