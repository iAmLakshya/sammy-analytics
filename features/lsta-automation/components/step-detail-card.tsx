"use client";

import { IconCheck, IconX, IconLoader2 } from "@tabler/icons-react";
import type { StepResult } from "../types";

interface StepPillProps {
  stepResult: StepResult;
  stepLabel: string;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const StepPill = ({
  stepResult,
  stepLabel,
  isActive,
  isSelected,
  onClick,
}: StepPillProps) => {
  const { status } = stepResult;
  const isInProgress = status === "pending" && isActive;

  let icon: React.ReactNode;
  let borderClass: string;
  let bgClass: string;
  let textClass: string;

  if (status === "completed") {
    icon = <IconCheck className="size-3" strokeWidth={2.5} />;
    borderClass = "border-emerald-500";
    bgClass = isSelected ? "bg-emerald-50 dark:bg-emerald-950/50" : "bg-white dark:bg-background";
    textClass = "text-emerald-600 dark:text-emerald-400";
  } else if (status === "failed") {
    icon = <IconX className="size-3" strokeWidth={2.5} />;
    borderClass = "border-rose-500";
    bgClass = isSelected ? "bg-rose-50 dark:bg-rose-950/50" : "bg-white dark:bg-background";
    textClass = "text-rose-600 dark:text-rose-400";
  } else if (isInProgress) {
    icon = <IconLoader2 className="size-3 animate-spin" />;
    borderClass = "border-amber-500";
    bgClass = isSelected ? "bg-amber-50 dark:bg-amber-950/50" : "bg-white dark:bg-background";
    textClass = "text-amber-600 dark:text-amber-400";
  } else {
    icon = <span className="size-1 rounded-full bg-muted-foreground/40" />;
    borderClass = "border-muted-foreground/30";
    bgClass = isSelected ? "bg-muted" : "bg-white dark:bg-background";
    textClass = "text-muted-foreground";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all hover:shadow-sm ${borderClass} ${bgClass} ${textClass}`}
    >
      {icon}
      <span>{stepLabel}</span>
    </button>
  );
};

interface StepDetailPanelProps {
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
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
};

export const StepDetailPanel = ({
  stepResult,
  stepLabel,
  isActive,
}: StepDetailPanelProps) => {
  const { status, output, errorMessage, activityDescription, completedAt } =
    stepResult;
  const isInProgress = status === "pending" && isActive;

  return (
    <div className="rounded-md border bg-card px-3 py-2">
      <p className="mb-1 text-xs font-semibold">{stepLabel}</p>

      {status === "completed" && output && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0 text-xs">
          {Object.entries(output).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-muted-foreground">{formatOutputKey(key)}</dt>
              <dd className="font-medium">{formatOutputValue(value)}</dd>
            </div>
          ))}
          {completedAt && (
            <>
              <dt className="text-muted-foreground">Completed</dt>
              <dd className="font-medium">
                {new Date(completedAt).toLocaleTimeString()}
              </dd>
            </>
          )}
        </dl>
      )}

      {isInProgress && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <IconLoader2 className="size-3 animate-spin" />
          <span>{activityDescription || "Processing..."}</span>
        </div>
      )}

      {status === "failed" && (
        <p className="text-xs text-rose-600 dark:text-rose-400">
          {errorMessage || "Step failed"}
        </p>
      )}

      {status === "pending" && !isActive && (
        <p className="text-xs text-muted-foreground">Waiting for previous steps</p>
      )}

      {status === "skipped" && (
        <p className="text-xs text-muted-foreground">Skipped due to previous failure</p>
      )}
    </div>
  );
};
