"use client";

import { useMemo } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import type { Submission } from "../types";

interface AutomationKpiCardsProps {
  submissions: Submission[];
  batchName: string | null;
}

export const AutomationKpiCards = ({
  submissions,
}: AutomationKpiCardsProps) => {
  const metrics = useMemo(() => {
    const completedCount = submissions.filter(
      (s) => s.status === "completed"
    ).length;
    const needsReviewCount = submissions.filter(
      (s) => s.status === "needs-review"
    ).length;
    const processingCount = submissions.filter(
      (s) => s.status === "processing"
    ).length;
    const totalCount = submissions.length;
    const avgTime = 6.4;

    return {
      completedCount,
      needsReviewCount,
      processingCount,
      totalCount,
      avgTime,
    };
  }, [submissions]);

  return (
    <div className="flex items-center divide-x divide-border">
      <div className="flex flex-col gap-0.5 pr-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Completed</span>
          <InfoTooltip content="Submissions that have been fully processed and uploaded to your document management system." />
        </div>
        <p className="text-xl font-semibold tabular-nums">
          {metrics.completedCount}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            / {metrics.totalCount}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-0.5 px-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Needs Review</span>
          <InfoTooltip content="Submissions that require your attention due to data mismatches or validation errors. Expand each row to see details and retry." />
        </div>
        <div className="flex items-center gap-1.5">
          {metrics.needsReviewCount > 0 && (
            <IconAlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
          )}
          <p
            className={`text-xl font-semibold tabular-nums ${
              metrics.needsReviewCount > 0
                ? "text-rose-600 dark:text-rose-400"
                : ""
            }`}
          >
            {metrics.needsReviewCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Processing</span>
          <InfoTooltip content="Submissions currently being processed. You'll be notified when they complete or if any issues arise." />
        </div>
        <p className="text-xl font-semibold tabular-nums">
          {metrics.processingCount}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            active
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-0.5 pl-6">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Avg Time</span>
          <InfoTooltip content="Average processing time per submission. Most submissions complete within a few minutes." />
        </div>
        <p className="text-xl font-semibold tabular-nums">
          {metrics.avgTime}{" "}
          <span className="text-sm font-normal text-muted-foreground">min</span>
        </p>
      </div>
    </div>
  );
};
