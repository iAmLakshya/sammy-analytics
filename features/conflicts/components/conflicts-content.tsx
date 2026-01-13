"use client"

import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
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

import { MetricCard } from "@/features/diffs"
import { MetricGrid, ChartPlaceholder } from "@/features/diffs"
import { PriorityBreakdown } from "./priority-breakdown"

export const ConflictsContent = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Conflicts Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Monitor conflict detection, review activity, and resolution patterns
        </p>
      </div>

      {/* Disposition Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Needs Review"
          value="5,840"
          badge="38.7%"
          badgeVariant="warning"
          description="Awaiting human review"
          icon={IconAlertTriangle}
        />
        <MetricCard
          label="Accepted"
          value="6,950"
          badge="46.05%"
          badgeVariant="success"
          description="Approved changes"
          icon={IconCheck}
        />
        <MetricCard
          label="Rejected"
          value="2,300"
          badge="15.25%"
          badgeVariant="destructive"
          description="Declined changes"
          icon={IconX}
        />
      </div>

      {/* Priority Breakdown */}
      <PriorityBreakdown />

      {/* Time to Review */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Time to Review</CardTitle>
            <CardDescription>
              How long conflicts wait before being reviewed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Accepted Conflicts
                </div>
                <div className="text-2xl font-semibold tabular-nums">8.45h avg</div>
                <div className="text-xs text-muted-foreground">
                  Median: 5.32h | Min: 0.25h | Max: 48.67h
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Rejected Conflicts
                </div>
                <div className="text-2xl font-semibold tabular-nums">12.18h avg</div>
                <div className="text-xs text-muted-foreground">
                  Median: 9.15h | Min: 0.50h | Max: 62.34h
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Corrections</CardTitle>
            <CardDescription>
              When users provide their own corrections vs just rejecting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricGrid
              columns={3}
              items={[
                { label: "Total Corrections", value: "412", subtext: "4.45% rate" },
                { label: "Unique Correctors", value: "7", subtext: "Active users" },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Per Day Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Conflicts Over Time</CardTitle>
          <CardDescription>
            Daily conflict creation with disposition breakdown
          </CardDescription>
          <CardAction>
            <Badge variant="outline">Last 30 days</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconClock}
            title="Line chart: conflicts_created over time"
            subtitle="Breakdown: needs_review, accepted, rejected"
          />
        </CardContent>
      </Card>

      {/* Pending Aging */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Conflicts Aging</CardTitle>
          <CardDescription>
            How long conflicts have been waiting for review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetricGrid
            columns={5}
            items={[
              { label: "Total Pending", value: "5,840" },
              { label: "Last 24h", value: "842" },
              { label: "Last 7d", value: "3,567" },
              { label: "Last 30d", value: "5,124" },
              { label: "Older than 30d", value: "716", highlight: true },
            ]}
          />
        </CardContent>
      </Card>

      {/* Review Activity Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Review Activity</CardTitle>
          <CardDescription>
            Daily reviews completed with unique reviewers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconCheck}
            title="Line chart: reviews_completed over time"
            subtitle="With accepted, rejected, unique_reviewers"
          />
        </CardContent>
      </Card>
    </div>
  )
}
