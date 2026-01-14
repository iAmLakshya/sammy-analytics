"use client";

import { IconCheck, IconX, IconLoader2, IconMinus } from "@tabler/icons-react";
import type { StepResult } from "../types";

interface StepDetailCardProps {
  stepResult: StepResult;
  stepLabel: string;
  isActive: boolean;
}

const formatOutputKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatOutputValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return String(value);
};

export const StepDetailCard = ({
  stepResult,
  stepLabel,
  isActive,
}: StepDetailCardProps) => {
  const { status, output, errorMessage, activityDescription, completedAt } =
    stepResult;

  const isInProgress = status === "pending" && isActive;

  let statusIcon: React.ReactNode;
  let statusBadge: React.ReactNode;
  let containerClass: string;

  switch (status) {
    case "completed":
      statusIcon = <IconCheck className="size-4" />;
      statusBadge = (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
          {statusIcon}
          Completed
        </span>
      );
      containerClass = "border-emerald-200 dark:border-emerald-800/50";
      break;
    case "failed":
      statusIcon = <IconX className="size-4" />;
      statusBadge = (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-400">
          {statusIcon}
          Failed
        </span>
      );
      containerClass = "border-rose-200 dark:border-rose-800/50";
      break;
    case "pending":
      if (isActive) {
        statusIcon = <IconLoader2 className="size-4 animate-spin" />;
        statusBadge = (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            {statusIcon}
            In Progress
          </span>
        );
        containerClass = "border-blue-200 dark:border-blue-800/50";
      } else {
        statusIcon = <IconMinus className="size-4" />;
        statusBadge = (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {statusIcon}
            Pending
          </span>
        );
        containerClass = "border-muted";
      }
      break;
    case "skipped":
      statusIcon = <IconMinus className="size-4" />;
      statusBadge = (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground/60">
          {statusIcon}
          Skipped
        </span>
      );
      containerClass = "border-muted opacity-60";
      break;
  }

  return (
    <div
      className={`flex flex-1 flex-col gap-3 rounded-lg border bg-card p-4 ${containerClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium">{stepLabel}</h4>
        {statusBadge}
      </div>

      {status === "completed" && output && (
        <div className="space-y-1.5">
          {Object.entries(output).map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-2 text-sm">
              <span className="text-muted-foreground">
                {formatOutputKey(key)}:
              </span>
              <span className="font-medium">{formatOutputValue(value)}</span>
            </div>
          ))}
          {completedAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Completed at {new Date(completedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {isInProgress && activityDescription && (
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
          <IconLoader2 className="size-3.5 animate-spin" />
          <span>{activityDescription}</span>
        </div>
      )}

      {status === "failed" && errorMessage && (
        <div className="space-y-2">
          <p className="text-sm text-rose-700 dark:text-rose-400">
            {errorMessage}
          </p>
          <p className="text-xs text-muted-foreground">
            Retry may resolve this issue
          </p>
        </div>
      )}

      {status === "pending" && !isActive && (
        <p className="text-sm text-muted-foreground">Waiting...</p>
      )}

      {status === "skipped" && (
        <p className="text-sm text-muted-foreground/60">
          Step was skipped due to previous failure
        </p>
      )}
    </div>
  );
};
