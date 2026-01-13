'use client';

import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconFileDescription,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { MiniSparkline } from "@/components/ui/sparkline"

// Mock trend data for sparklines
const pendingDiffsTrend = [9800, 10200, 10100, 10400, 10300, 10500, 10600];
const pendingConflictsTrend = [6200, 6100, 5900, 5800, 5850, 5900, 5840];
const resolvedConflictsTrend = [8100, 8400, 8600, 8800, 9000, 9100, 9250];
const reviewTimeTrend = [9.2, 8.9, 8.7, 8.6, 8.5, 8.4, 8.45];

const getTrendDirection = (data: number[]) => {
  if (data.length < 2) return 'neutral';
  const first = data[0];
  const last = data[data.length - 1];
  if (last > first * 1.02) return 'up';
  if (last < first * 0.98) return 'down';
  return 'neutral';
};

export const SectionCards = () => {
  const diffsTrend = getTrendDirection(pendingDiffsTrend);
  const conflictsTrend = getTrendDirection(pendingConflictsTrend);
  const resolvedTrend = getTrendDirection(resolvedConflictsTrend);
  const reviewTrend = getTrendDirection(reviewTimeTrend);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Pending Diffs
            <InfoTooltip content="Document versions waiting to be reviewed and applied. Includes drafts (in progress) and previews (ready for review)." />
          </CardDescription>
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            10,600
            <MiniSparkline
              data={pendingDiffsTrend}
              width={48}
              height={20}
              color="hsl(var(--chart-1))"
            />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileDescription className="size-3" />
              Draft + Preview
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {diffsTrend === 'up' ? (
              <IconTrendingUp className="size-3.5 text-chart-1" />
            ) : diffsTrend === 'down' ? (
              <IconTrendingDown className="size-3.5 text-chart-3" />
            ) : null}
            8,420 drafts, 2,180 in preview
          </div>
          <div className="text-muted-foreground">
            Avg age: 142.35 hours
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Pending Conflicts
            <InfoTooltip content="Detected conflicts between document versions that need human review. High priority conflicts should be addressed first." />
          </CardDescription>
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5,840
            <MiniSparkline
              data={pendingConflictsTrend}
              width={48}
              height={20}
              color="hsl(var(--chart-1))"
            />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconAlertTriangle className="size-3" />
              Needs Review
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {conflictsTrend === 'down' ? (
              <IconTrendingDown className="size-3.5 text-chart-3" />
            ) : conflictsTrend === 'up' ? (
              <IconTrendingUp className="size-3.5 text-chart-1" />
            ) : null}
            1,240 high priority
          </div>
          <div className="text-muted-foreground">
            Across 1,842 documents
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Conflicts Resolved
            <InfoTooltip content="Conflicts that have been reviewed and either accepted (changes applied) or rejected (changes discarded). Higher acceptance rates indicate better content quality." />
          </CardDescription>
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            9,250
            <MiniSparkline
              data={resolvedConflictsTrend}
              width={48}
              height={20}
              color="hsl(var(--chart-3))"
            />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCheck className="size-3" />
              Completed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {resolvedTrend === 'up' && (
              <IconTrendingUp className="size-3.5 text-chart-3" />
            )}
            6,950 accepted, 2,300 rejected
          </div>
          <div className="text-muted-foreground">
            75.1% acceptance rate
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Avg Review Time
            <InfoTooltip content="Average time from conflict detection to resolution. Lower times indicate faster review cycles. Target: <4h for high priority items." />
          </CardDescription>
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8.45h
            <MiniSparkline
              data={reviewTimeTrend}
              width={48}
              height={20}
              color="hsl(var(--chart-2))"
            />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3" />
              Median: 5.32h
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {reviewTrend === 'down' ? (
              <IconTrendingDown className="size-3.5 text-chart-3" />
            ) : reviewTrend === 'up' ? (
              <IconTrendingUp className="size-3.5 text-chart-1" />
            ) : null}
            8 active reviewers
          </div>
          <div className="text-muted-foreground">
            1,496 reviews this week
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
