"use client";

import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import type { LstaTaskStep } from "../types";

interface StepPillProps {
  step: LstaTaskStep;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const StepPill = ({
  step,
  isActive,
  isSelected,
  onClick,
}: StepPillProps) => {
  const { status, title } = step;
  const isInProgress = status === "pending" && isActive;

  let icon: React.ReactNode;
  let borderClass: string;
  let bgClass: string;
  let textClass: string;

  if (status === "completed") {
    icon = <IconCheck className="size-3" strokeWidth={2.5} />;
    borderClass = "border-emerald-500";
    bgClass = isSelected
      ? "bg-emerald-50 dark:bg-emerald-950/50"
      : "bg-white dark:bg-background";
    textClass = "text-emerald-600 dark:text-emerald-400";
  } else if (status === "failed") {
    icon = <IconX className="size-3" strokeWidth={2.5} />;
    borderClass = "border-rose-500";
    bgClass = isSelected
      ? "bg-rose-50 dark:bg-rose-950/50"
      : "bg-white dark:bg-background";
    textClass = "text-rose-600 dark:text-rose-400";
  } else if (isInProgress) {
    icon = <IconLoader2 className="size-3 animate-spin" />;
    borderClass = "border-amber-500";
    bgClass = isSelected
      ? "bg-amber-50 dark:bg-amber-950/50"
      : "bg-white dark:bg-background";
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
      <span>{title}</span>
    </button>
  );
};

interface StepDetailPanelProps {
  step: LstaTaskStep;
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

export const StepDetailPanel = ({ step, isActive }: StepDetailPanelProps) => {
  const { status, data, errorReasons, statusDescription } = step;
  const isInProgress = status === "pending" && isActive;
  const hasData = Object.keys(data).length > 0;

  return (
    <div className="mt-1.5 text-xs text-muted-foreground">
      {status === "completed" && hasData && (
        <span className="flex flex-wrap gap-x-3">
          {Object.entries(data).map(([key, value]) => (
            <span key={key}>
              {formatOutputKey(key)}:{" "}
              <span className="font-medium text-foreground">
                {formatOutputValue(value)}
              </span>
            </span>
          ))}
        </span>
      )}

      {isInProgress && (
        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <IconLoader2 className="size-3 animate-spin" />
          {statusDescription || "Processing..."}
        </span>
      )}

      {status === "failed" && (
        <span className="text-rose-600 dark:text-rose-400">
          {errorReasons.length > 0 ? errorReasons.join("; ") : "Step failed"}
        </span>
      )}

      {status === "pending" && !isActive && (
        <span>Waiting for previous steps</span>
      )}
    </div>
  );
};
