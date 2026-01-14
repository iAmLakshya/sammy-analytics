"use client";

import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconFileDescription,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { MiniSparkline } from "@/components/ui/sparkline";

// Mock trend data for sparklines
const pendingDiffsTrend = [9800, 10200, 10100, 10400, 10300, 10500, 10600];
const pendingConflictsTrend = [6200, 6100, 5900, 5800, 5850, 5900, 5840];
const resolvedConflictsTrend = [8100, 8400, 8600, 8800, 9000, 9100, 9250];
const reviewTimeTrend = [9.2, 8.9, 8.7, 8.6, 8.5, 8.4, 8.45];

const getTrendDirection = (data: number[]) => {
  if (data.length < 2) return "neutral";
  const first = data[0];
  const last = data[data.length - 1];
  if (last > first * 1.02) return "up";
  if (last < first * 0.98) return "down";
  return "neutral";
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
            Suggested Edits
            <InfoTooltip content="AI-suggested changes to your documents awaiting review. These need your team's approval before going live." />
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
              In Queue
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {diffsTrend === "up" ? (
              <IconTrendingUp className="size-3.5 text-chart-1" />
            ) : diffsTrend === "down" ? (
              <IconTrendingDown className="size-3.5 text-chart-3" />
            ) : null}
            8,420 being prepared, 2,180 ready for review
          </div>
          <div className="text-muted-foreground">
            Waiting ~6 days on average
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Issues to Review
            <InfoTooltip content="Discrepancies found between your documents and source content. Your team needs to decide whether to accept or reject these changes." />
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
              Action Needed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {conflictsTrend === "down" ? (
              <IconTrendingDown className="size-3.5 text-chart-3" />
            ) : conflictsTrend === "up" ? (
              <IconTrendingUp className="size-3.5 text-chart-1" />
            ) : null}
            1,240 are urgent
          </div>
          <div className="text-muted-foreground">Affecting 1,842 documents</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Issues Resolved
            <InfoTooltip content="Issues that your team has reviewed. A high approval rate means AI suggestions are well-aligned with your content standards." />
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
              Done
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {resolvedTrend === "up" && (
              <IconTrendingUp className="size-3.5 text-chart-3" />
            )}
            6,950 approved, 2,300 declined
          </div>
          <div className="text-muted-foreground">75.1% approval rate</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            Turnaround Time
            <InfoTooltip content="How quickly your team reviews issues. Faster turnaround means your documents stay up-to-date. Goal: under 4 hours for urgent items." />
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
              Typical: 5.32h
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            {reviewTrend === "down" ? (
              <IconTrendingDown className="size-3.5 text-chart-3" />
            ) : reviewTrend === "up" ? (
              <IconTrendingUp className="size-3.5 text-chart-1" />
            ) : null}
            8 team members reviewing
          </div>
          <div className="text-muted-foreground">1,496 reviews this week</div>
        </CardFooter>
      </Card>
    </div>
  );
};
