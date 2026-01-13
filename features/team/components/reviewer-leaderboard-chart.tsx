"use client"

import { useMemo } from "react"
import {
  IconTrophy,
  IconMedal,
  IconAward,
  IconUser,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

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
import { SegmentedBar } from "@/components/ui/funnel"
import { MiniSparkline } from "@/components/ui/sparkline"
import { cn } from "@/lib/utils"

import type { Reviewer } from "../types"

interface ReviewerLeaderboardChartProps {
  data: Reviewer[]
  isLoading?: boolean
}

const REVIEWER_NAMES = [
  "Sarah Chen",
  "Marcus Johnson",
  "Emily Rodriguez",
  "David Kim",
  "Alex Thompson",
  "Jordan Lee",
  "Taylor Morgan",
  "Casey Williams",
]

const REVIEWER_AVATARS = [
  "SC", "MJ", "ER", "DK", "AT", "JL", "TM", "CW"
]

const rankConfig = [
  { icon: IconTrophy, bg: "bg-muted", text: "text-primary" },
  { icon: IconMedal, bg: "bg-muted", text: "text-primary/70" },
  { icon: IconAward, bg: "bg-muted", text: "text-primary/50" },
]

export const ReviewerLeaderboardChart = ({
  data,
  isLoading,
}: ReviewerLeaderboardChartProps) => {
  const reviewerData = useMemo(() => {
    return data.map((reviewer, index) => ({
      name: REVIEWER_NAMES[index] || `User ${index + 1}`,
      initials: REVIEWER_AVATARS[index] || `U${index + 1}`,
      reviews_completed: reviewer.reviews_completed,
      accepted: reviewer.accepted,
      rejected: reviewer.rejected,
      corrections: reviewer.corrections_provided,
      avgTime: reviewer.avg_review_time_hours,
      acceptRate: Math.round((reviewer.accepted / reviewer.reviews_completed) * 100),
      // Mock trend data
      trend: [
        Math.floor(reviewer.reviews_completed * 0.1),
        Math.floor(reviewer.reviews_completed * 0.12),
        Math.floor(reviewer.reviews_completed * 0.11),
        Math.floor(reviewer.reviews_completed * 0.14),
        Math.floor(reviewer.reviews_completed * 0.13),
        Math.floor(reviewer.reviews_completed * 0.15),
        Math.floor(reviewer.reviews_completed * 0.14),
      ],
    }))
  }, [data])

  const totalReviews = useMemo(() => {
    return data.reduce((acc, r) => acc + r.reviews_completed, 0)
  }, [data])

  if (isLoading) {
    return <ReviewerLeaderboardChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Top Reviewers
          <InfoTooltip content="Reviewers ranked by total reviews completed in the last 30 days. Higher acceptance rates indicate consistent alignment with content guidelines." />
        </CardTitle>
        <CardDescription>
          Most active contributors this month
        </CardDescription>
        <CardAction>
          <Badge variant="outline">{data.length} reviewers</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviewerData.slice(0, 6).map((reviewer, index) => {
          const rankStyle = rankConfig[index] || { icon: IconUser, bg: "bg-muted", text: "text-muted-foreground" }
          const RankIcon = rankStyle.icon
          const sharePercent = totalReviews > 0 ? (reviewer.reviews_completed / totalReviews) * 100 : 0

          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
            >
              {/* Rank & Avatar */}
              <div className="relative">
                <div className={cn(
                  "size-10 rounded-full flex items-center justify-center text-sm font-semibold",
                  rankStyle.bg, rankStyle.text
                )}>
                  {reviewer.initials}
                </div>
                {index < 3 && (
                  <div className={cn(
                    "absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center",
                    rankStyle.bg
                  )}>
                    <RankIcon className={cn("size-3", rankStyle.text)} />
                  </div>
                )}
              </div>

              {/* Name & Stats */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{reviewer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconCheck className="size-3 text-chart-3" />
                    {reviewer.acceptRate}% accept
                  </span>
                  <span className="flex items-center gap-1">
                    <IconClock className="size-3" />
                    {reviewer.avgTime}h avg
                  </span>
                </div>
              </div>

              {/* Trend sparkline */}
              <div className="hidden sm:block">
                <MiniSparkline
                  data={reviewer.trend}
                  width={40}
                  height={16}
                  color="hsl(var(--chart-3))"
                />
              </div>

              {/* Review count */}
              <div className="text-right">
                <div className="font-semibold tabular-nums">
                  {reviewer.reviews_completed.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {sharePercent.toFixed(1)}% share
                </div>
              </div>
            </div>
          )
        })}

        {/* Summary footer */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t text-sm">
          <span className="text-muted-foreground">
            Total reviews: <span className="font-medium text-foreground tabular-nums">{totalReviews.toLocaleString()}</span>
          </span>
          <span className="text-muted-foreground">
            Avg per reviewer: <span className="font-medium text-foreground tabular-nums">
              {data.length > 0 ? Math.round(totalReviews / data.length).toLocaleString() : 0}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

const ReviewerLeaderboardChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-2 h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
