"use client"

import {
  IconCalendar,
  IconClock,
  IconEdit,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { MetricCard } from "@/features/diffs"

import { useFetchTeamOverview } from "../hooks/use-fetch-team-overview"
import { useFetchReviewActivity } from "../hooks/use-fetch-review-activity"
import { ReviewerLeaderboardChart } from "./reviewer-leaderboard-chart"
import { WeekdayActivityChart } from "./weekday-activity-chart"
import { ReviewTrendsChart } from "./review-trends-chart"
import { DocumentsAttentionTable } from "./documents-attention-table"

export const TeamContent = () => {
  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    error: overviewError,
  } = useFetchTeamOverview()

  const {
    data: activityData,
    isLoading: isLoadingActivity,
    error: activityError,
  } = useFetchReviewActivity()

  const formatNumber = (num: number) => num.toLocaleString()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Team Activity</h1>
        <p className="text-sm text-muted-foreground">
          How your team is handling content reviews and who's most active
        </p>
      </div>

      {/* Team Overview KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isLoadingOverview ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-8 w-32" />
              </CardHeader>
              <Skeleton className="mx-6 mb-4 h-4 w-36" />
            </Card>
          ))
        ) : (
          <>
            <MetricCard
              label="Active Reviewers"
              value={formatNumber(overviewData?.overview.activeReviewers ?? 0)}
              description="Last 30 days"
              icon={IconUsers}
            />
            <MetricCard
              label="Reviews Completed"
              value={formatNumber(overviewData?.overview.totalReviews ?? 0)}
              description="Last 30 days"
              icon={IconTrophy}
            />
            <MetricCard
              label="Daily Output"
              value={formatNumber(overviewData?.overview.avgReviewsPerDay ?? 0)}
              description="Team average per day"
              icon={IconCalendar}
            />
            <MetricCard
              label="Response Time"
              value={`${overviewData?.overview.avgReviewTimeHours ?? 0}h`}
              description="Time to complete review"
              icon={IconClock}
            />
            <MetricCard
              label="Manual Fixes"
              value={`${overviewData?.overview.correctionRate ?? 0}%`}
              badge={`${overviewData?.corrections.unique_correctors ?? 0} contributors`}
              badgeVariant="default"
              description="Reviews with custom edits"
              icon={IconEdit}
            />
          </>
        )}
      </div>

      {/* Review Trends Chart */}
      <ReviewTrendsChart
        data={activityData?.data ?? []}
        isLoading={isLoadingActivity}
      />

      {/* Leaderboard and Weekday Activity - Side by Side */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ReviewerLeaderboardChart
          data={overviewData?.reviewers ?? []}
          isLoading={isLoadingOverview}
        />
        <WeekdayActivityChart
          data={overviewData?.weekdayActivity ?? []}
          isLoading={isLoadingOverview}
        />
      </div>

      {/* Documents Requiring Attention */}
      <DocumentsAttentionTable
        data={overviewData?.documentsNeedingAttention ?? []}
        isLoading={isLoadingOverview}
      />

      {/* Corrections Summary Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Manual Improvements</h3>
              <p className="text-sm text-muted-foreground">
                When reviewers write their own fixes instead of just declining
              </p>
            </div>
            <Badge variant="outline">
              {overviewData?.corrections.correction_rate_percentage ?? 0}% of reviews
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingOverview ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col">
                <span className="text-3xl font-bold tabular-nums">
                  {overviewData?.corrections.total_user_corrections.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  Total Improvements
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tabular-nums">
                  {overviewData?.corrections.unique_correctors}
                </span>
                <span className="text-sm text-muted-foreground">
                  Team Members Contributing
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {overviewData?.corrections.correction_rate_percentage}%
                </span>
                <span className="text-sm text-muted-foreground">
                  Of All Reviews
                </span>
              </div>
            </div>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Manual fixes help train the AI to be more accurate over time. Teams that provide corrections help improve suggestions for everyone.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
