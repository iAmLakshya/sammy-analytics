"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconCheck, IconClock, IconExternalLink, IconEye, IconLoader2, IconRefresh, IconX } from "@tabler/icons-react";
import type { LstaTaskStep, StepStatus } from "../types";
import { STEP_STATUS_COLORS } from "../utils/status-config";
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

  const statusKey: StepStatus | "in-progress" = isInProgress ? "in-progress" : status;
  const colors = STEP_STATUS_COLORS[statusKey];

  const getIcon = (): React.ReactNode => {
    switch (status) {
      case "completed":
        return <IconCheck className="size-3" strokeWidth={2.5} />;
      case "failed":
        return <IconX className="size-3" strokeWidth={2.5} />;
      case "not-ready":
        return <IconClock className="size-3" />;
      case "review-required":
        return <IconEye className="size-3" />;
      case "pending":
        return isInProgress ? (
          <IconLoader2 className="size-3 animate-spin" />
        ) : (
          <span className="size-1 rounded-full bg-muted-foreground/40" />
        );
    }
  };

  const icon = getIcon();
  const borderClass = colors.border;
  const bgClass = isSelected ? colors.bgSelected : "bg-white dark:bg-background";
  const textClass = colors.text;

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
  taskStatus?: "pending" | "completed" | "processing" | "failed" | "rejected" | "retrying" | "not-ready" | "review-required";
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
  const showRetryBanner = isRetrying && status !== "completed";

  return (
    <div className="mt-3 space-y-3 text-xs text-muted-foreground">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
        {title}
      </div>

      {showRetryBanner && (
        <div className="flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-1.5 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
          <IconRefresh className="size-3.5" />
          <span>Scheduled for retry — will restart from beginning</span>
        </div>
      )}

      {hasValidationChecks ? (
        <ValidationCheckList checks={validationChecks} />
      ) : (
        <>
          {status === "completed" && hasData && (
            <div className="flex flex-wrap gap-x-3">
              {Object.entries(data).map(([key, value]) => (
                <span key={key}>
                  {formatOutputKey(key)}:{" "}
                  <span className="font-medium text-foreground">
                    {formatOutputValue(value)}
                  </span>
                </span>
              ))}
            </div>
          )}

          {status === "failed" && (
            <div className="text-rose-600 dark:text-rose-400">
              {errorReasons.length > 0 ? errorReasons.join("; ") : "Step failed"}
            </div>
          )}

          {isInProgress && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <IconLoader2 className="size-3 animate-spin" />
              {statusDescription || "Processing..."}
            </div>
          )}

          {status === "pending" && !isActive && (
            <div className="italic text-muted-foreground/60">
              Waiting for previous steps
            </div>
          )}

          {status === "not-ready" && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <IconClock className="size-3" />
              {statusDescription || "Waiting for source data..."}
            </div>
          )}

          {status === "review-required" && (
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <IconEye className="size-3" />
              {statusDescription || "Awaiting human approval"}
            </div>
          )}
        </>
      )}

      {step.elsterUrl && (
        <a
          href={step.elsterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <IconExternalLink className="size-4 shrink-0 text-purple-500 dark:text-purple-400" />
          <span>ELSTER Portal</span>
          <IconExternalLink className="size-3 opacity-50" />
        </a>
      )}
    </div>
  );
};
