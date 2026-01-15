"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconCheck, IconLoader2, IconRefresh, IconX } from "@tabler/icons-react";
import type { LstaTaskStep } from "../types";
import { ValidationCheckList } from "./validation-check-list";

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
  const { status, title, statusDescription, description } = step;
  const isInProgress = status === "pending" && isActive;
  const tooltipContent = statusDescription || description;

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

  const button = (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all hover:shadow-sm ${borderClass} ${bgClass} ${textClass}`}
    >
      {icon}
      <span>{title}</span>
    </button>
  );

  if (!tooltipContent) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

interface StepDetailPanelProps {
  step: LstaTaskStep;
  isActive: boolean;
  taskStatus?: "pending" | "completed" | "processing" | "failed" | "retrying";
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
  step,
  isActive,
  taskStatus,
}: StepDetailPanelProps) => {
  const { title, status, data, errorReasons, statusDescription, validationChecks } =
    step;
  const isInProgress = status === "pending" && isActive;
  const hasData = Object.keys(data).length > 0;
  const hasValidationChecks = validationChecks && validationChecks.length > 0;
  const isRetrying = taskStatus === "retrying";

  return (
    <div className="mt-1.5 text-xs text-muted-foreground">
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
        {title}
      </div>

      {isRetrying && (
        <div className="mb-2 flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-1.5 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
          <IconRefresh className="size-3.5" />
          <span>Scheduled for retry — will restart from beginning</span>
        </div>
      )}

      {hasValidationChecks ? (
        <ValidationCheckList checks={validationChecks} />
      ) : (
        <>
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

          {status === "failed" && (
            <span className="text-rose-600 dark:text-rose-400">
              {errorReasons.length > 0 ? errorReasons.join("; ") : "Step failed"}
            </span>
          )}
        </>
      )}

      {isInProgress && !hasValidationChecks && (
        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <IconLoader2 className="size-3 animate-spin" />
          {statusDescription || "Processing..."}
        </span>
      )}

      {status === "pending" && !isActive && (
        <span>Waiting for previous steps</span>
      )}
    </div>
  );
};
