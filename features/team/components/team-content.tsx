"use client"

import {
  IconCalendar,
  IconClock,
  IconTrophy,
  IconUsers,
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

import { MetricCard, ChartPlaceholder } from "@/features/diffs"
import { ReviewersLeaderboard } from "./reviewers-leaderboard"
import { WeekdayActivity } from "./weekday-activity"

export const TeamContent = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Team Activity</h1>
        <p className="text-sm text-muted-foreground">
          Track reviewer performance and team engagement patterns
        </p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active Reviewers"
          value="8"
          description="Last 30 days"
          icon={IconUsers}
        />
        <MetricCard
          label="Total Reviews"
          value="8,750"
          description="Last 30 days"
          icon={IconTrophy}
        />
        <MetricCard
          label="Avg Reviews/Day"
          value="292"
          description="Team average"
          icon={IconCalendar}
        />
        <MetricCard
          label="Avg Review Time"
          value="9.8h"
          description="Team average"
          icon={IconClock}
        />
      </div>

      {/* Top Reviewers */}
      <ReviewersLeaderboard />

      {/* Activity by Day of Week */}
      <WeekdayActivity />

      {/* Review Trends Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Review Trends</CardTitle>
          <CardDescription>
            Daily review activity with reviewer count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconUsers}
            title="Line chart: reviews_completed over time"
            subtitle="With unique_reviewers on secondary axis"
          />
        </CardContent>
      </Card>
    </div>
  )
}
