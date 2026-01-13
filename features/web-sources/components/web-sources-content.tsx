"use client"

import {
  IconClock,
  IconGlobe,
  IconRefresh,
  IconWorldWww,
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

import { MetricCard, MetricGrid, ChartPlaceholder } from "@/features/diffs"

export const WebSourcesContent = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Web Sources</h1>
        <p className="text-sm text-muted-foreground">
          Monitor web page syncing and document conflicts from external sources
        </p>
      </div>

      {/* Web Watch Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Documents with Conflicts"
          value="1,842"
          description="Tracked documents"
          icon={IconWorldWww}
        />
        <MetricCard
          label="Pending Conflicts"
          value="5,840"
          badgeVariant="warning"
          description="Avg: 3.17 per document"
        />
        <MetricCard
          label="High Priority Docs"
          value="287"
          badgeVariant="destructive"
          description="Requires immediate attention"
        />
        <MetricCard
          label="Medium Priority"
          value="642"
          badgeVariant="warning"
          description="913 low priority"
        />
      </div>

      {/* Web Page Sync Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Web Page Sync Overview</CardTitle>
          <CardDescription>
            Sync frequency and coverage across tracked web pages
          </CardDescription>
          <CardAction>
            <Badge variant="outline">8,242 total pages</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <MetricGrid
            columns={5}
            items={[
              { label: "Ever Synced", value: "8,242", subtext: "100%" },
              { label: "Last 24h", value: "2,847", subtext: "34.5%" },
              { label: "Last 7d", value: "6,521", subtext: "79.1%" },
              { label: "Last 30d", value: "7,918", subtext: "96.1%" },
              { label: "Avg Since Sync", value: "18.45h", subtext: "Average age" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Syncs Per Day Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sync Activity</CardTitle>
          <CardDescription>
            Pages synced and pages with detected updates
          </CardDescription>
          <CardAction>
            <Badge variant="outline">Last 30 days</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconRefresh}
            title="Line chart: pages_synced over time"
            subtitle="With pages_with_updates overlay"
          />
        </CardContent>
      </Card>

      {/* Sync Summary Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Summary</CardTitle>
          <CardDescription>
            Daily breakdown of sync activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center text-muted-foreground">
              <IconGlobe className="mx-auto mb-2 size-8" />
              <p className="text-sm">Table: date, pages_synced, pages_with_updates</p>
              <p className="text-xs">Sortable by date descending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web Watch Documents Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Documents Requiring Attention</CardTitle>
          <CardDescription>
            Documents with pending conflicts sorted by priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            icon={IconClock}
            title="Table: document, priority, pending_conflicts"
            subtitle="Filterable by priority level"
          />
        </CardContent>
      </Card>
    </div>
  )
}
