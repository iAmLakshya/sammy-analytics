"use client"

import { useMemo } from "react"
import {
  IconClock,
  IconCheck,
  IconX,
  IconArrowDown,
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
import { ProgressRing } from "@/components/ui/gauge"
import { VerticalFunnel } from "@/components/ui/funnel"

import type { ConflictDispositionSummary } from "../types"

const dispositionConfig = {
  NEEDS_REVIEW: {
    label: "Pending Review",
    color: "hsl(var(--chart-1))",
    icon: IconClock,
    description: "Awaiting human decision",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "hsl(var(--chart-3))",
    icon: IconCheck,
    description: "Changes approved",
  },
  REJECTED: {
    label: "Rejected",
    color: "hsl(var(--chart-5))",
    icon: IconX,
    description: "Changes declined",
  },
}

interface DispositionChartProps {
  data: ConflictDispositionSummary[]
  isLoading?: boolean
}

export const DispositionChart = ({
  data,
  isLoading,
}: DispositionChartProps) => {
  const { totalConflicts, resolved, acceptedCount, rejectedCount, pendingCount, acceptanceRate } = useMemo(() => {
    const total = data.reduce((acc, curr) => acc + curr.count, 0)
    const accepted = data.find(d => d.disposition === "ACCEPTED")?.count || 0
    const rejected = data.find(d => d.disposition === "REJECTED")?.count || 0
    const pending = data.find(d => d.disposition === "NEEDS_REVIEW")?.count || 0
    const resolvedCount = accepted + rejected
    const rate = resolvedCount > 0 ? (accepted / resolvedCount) * 100 : 0

    return {
      totalConflicts: total,
      resolved: resolvedCount,
      acceptedCount: accepted,
      rejectedCount: rejected,
      pendingCount: pending,
      acceptanceRate: rate,
    }
  }, [data])

  if (isLoading) {
    return <DispositionChartSkeleton />
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Resolution Pipeline
          <InfoTooltip content="Shows the flow of conflicts from detection to resolution. Conflicts are either accepted (changes approved) or rejected (changes declined)." />
        </CardTitle>
        <CardDescription>Conflict resolution flow</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {/* Summary stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold tabular-nums">
              {totalConflicts.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Conflicts</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold tabular-nums">
              {pendingCount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Pending Review</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold tabular-nums">
              {resolved.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>

        {/* Resolution funnel */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconArrowDown className="size-4" />
            <span>Resolution Outcomes</span>
          </div>
          <VerticalFunnel
            stages={[
              {
                label: "Accepted",
                value: acceptedCount,
                color: dispositionConfig.ACCEPTED.color,
              },
              {
                label: "Rejected",
                value: rejectedCount,
                color: dispositionConfig.REJECTED.color,
              },
            ]}
          />
        </div>

        {/* Acceptance rate */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div>
            <div className="text-sm font-medium">Acceptance Rate</div>
            <div className="text-xs text-muted-foreground">
              Of resolved conflicts
            </div>
          </div>
          <ProgressRing
            value={acceptanceRate}
            max={100}
            size={56}
            strokeWidth={6}
            color="hsl(var(--chart-3))"
            showPercentage={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}

const DispositionChartSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
}
