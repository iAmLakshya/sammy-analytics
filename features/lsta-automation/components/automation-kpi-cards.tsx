"use client";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { IconAlertTriangle, IconClock } from "@tabler/icons-react";
import type { CountByStatus } from "../types";

interface AutomationKpiCardsProps {
  countByStatus: CountByStatus;
  totalCount: number;
}

export const AutomationKpiCards = ({
  countByStatus,
  totalCount,
}: AutomationKpiCardsProps) => {
  const failedCount = countByStatus.failed;
  const notReadyCount = countByStatus.notReady;
  const avgTime = 6.4;
  const progressPercent =
    totalCount > 0 ? (countByStatus.completed / totalCount) * 100 : 0;

  return (
    <div className="flex items-center divide-x divide-border">
      <div className="flex flex-col gap-1.5 pr-6">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Completed</span>
            <InfoTooltip content="Tasks that have been fully processed and uploaded to your document management system." />
          </div>
          <p className="text-xl font-semibold tabular-nums">
            {countByStatus.completed}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / {totalCount}
            </span>
          </p>
        </div>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Failed</span>
          <InfoTooltip content="Tasks that failed and require your attention. Expand each row to see details and retry." />
        </div>
        <div className="flex items-center gap-1.5">
          {failedCount > 0 && (
            <IconAlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
          )}
          <p
            className={`text-xl font-semibold tabular-nums ${
              failedCount > 0 ? "text-rose-600 dark:text-rose-400" : ""
            }`}
          >
            {failedCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Not Ready</span>
          <InfoTooltip content="Tasks waiting for source data or pending review. Will retry automatically." />
        </div>
        <div className="flex items-center gap-1.5">
          {notReadyCount > 0 && (
            <IconClock className="size-4 text-amber-600 dark:text-amber-400" />
          )}
          <p
            className={`text-xl font-semibold tabular-nums ${
              notReadyCount > 0 ? "text-amber-600 dark:text-amber-400" : ""
            }`}
          >
            {notReadyCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Processing</span>
          <InfoTooltip content="Tasks currently being processed. You'll be notified when they complete or if any issues arise." />
        </div>
        <p className="text-xl font-semibold tabular-nums">
          {countByStatus.processing}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            active
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-0.5 pl-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Avg Time</span>
          <InfoTooltip content="Average processing time per task. Most tasks complete within a few minutes." />
        </div>
        <p className="text-xl font-semibold tabular-nums">
          {avgTime}{" "}
          <span className="text-sm font-normal text-muted-foreground">min</span>
        </p>
      </div>
    </div>
  );
};
