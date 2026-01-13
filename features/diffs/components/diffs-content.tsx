"use client"

import {
  IconArchive,
  IconCheck,
  IconClock,
  IconFileDescription,
} from "@tabler/icons-react"

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
import { Skeleton } from "@/components/ui/skeleton"

import { MetricCard } from "./metric-card"
import { MetricGrid } from "./metric-grid"
import { ChartPlaceholder } from "./chart-placeholder"

export const DiffsContent = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Diffs Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track document version changes, state transitions, and resolution
          times
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Diffs"
          value="14,450"
          description="All time document diffs"
          icon={IconFileDescription}
        />
        <MetricCard
          label="Draft"
          value="8,420"
          badge="58.3%"
          description="Awaiting review"
          icon={IconFileDescription}
        />
        <MetricCard
          label="Applied"
          value="2,950"
          badge="20.4%"
          badgeVariant="success"
          description="Successfully merged"
          icon={IconCheck}
        />
        <MetricCard
          label="Archived"
          value="900"
          badge="6.2%"
          description="Dismissed or superseded"
          icon={IconArchive}
        />
      </div>

      {/* Time to Resolution */}
      <Card>
        <CardHeader>
          <CardTitle>Time to Resolution</CardTitle>
          <CardDescription>
            Average time for diffs to move from draft to final state
          </CardDescription>
          <CardAction>
            <Badge variant="outline">Last 30 days</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <MetricGrid
            items={[
              { label: "Preview", value: "18.45h", subtext: "Median: 14.32h" },
              { label: "Applied", value: "36.78h", subtext: "Median: 28.50h" },
              { label: "Archived", value: "24.12h", subtext: "Median: 19.67h" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Diffs Per Day Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Diffs Created Over Time</CardTitle>
          <CardDescription>
            Daily breakdown of new diffs by state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconClock}
            title="Line chart: diffs_created over time"
            subtitle="Breakdown by drafts_created, applied_on_creation"
          />
        </CardContent>
      </Card>

      {/* Weekly Trends Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
          <CardDescription>
            90-day view with weekly aggregation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            title="Stacked area chart: weekly diffs by state"
            subtitle="Draft, Preview, Applied, Archived"
          />
        </CardContent>
      </Card>

      {/* Pending Backlog */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Diffs Backlog</CardTitle>
          <CardDescription>
            Current unresolved diffs requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetricGrid
            columns={4}
            items={[
              { label: "Total Pending", value: "10,600" },
              { label: "Affected Documents", value: "1,842" },
              { label: "Analysis Runs", value: "4,521" },
              { label: "Avg Age", value: "142.35h" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
