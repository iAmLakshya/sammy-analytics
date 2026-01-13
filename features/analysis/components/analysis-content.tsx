"use client"

import {
  IconActivity,
  IconBrain,
  IconClock,
  IconTarget,
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
import { AnalysisRunsTable } from "./analysis-runs-table"

export const AnalysisContent = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Analysis Engine</h1>
        <p className="text-sm text-muted-foreground">
          Monitor analysis run performance and conflict detection rates
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Completed Runs"
          value="3,702"
          description="Last 30 days"
          icon={IconBrain}
        />
        <MetricCard
          label="Avg Duration"
          value="487s"
          description="~8 minutes per run"
          icon={IconClock}
        />
        <MetricCard
          label="Median Duration"
          value="412s"
          description="~7 minutes typical"
          icon={IconTarget}
        />
        <MetricCard
          label="Duration Range"
          value="52s - 1,843s"
          description="Min to Max"
          icon={IconActivity}
        />
      </div>

      {/* Analysis Runs Per Day */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Runs Over Time</CardTitle>
          <CardDescription>
            Daily analysis activity with conflict detection rates
          </CardDescription>
          <CardAction>
            <Badge variant="outline">Last 30 days</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconBrain}
            title="Line chart: total_runs over time"
            subtitle="With runs_with_conflicts, conflicts_detected"
          />
        </CardContent>
      </Card>

      {/* Conflict Detection Stats */}
      <AnalysisRunsTable />

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>
            Analysis run duration distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconActivity}
            title="Histogram: run duration distribution"
            subtitle="Buckets from 0-120s, 120-300s, 300-600s, 600s+"
          />
        </CardContent>
      </Card>
    </div>
  )
}
