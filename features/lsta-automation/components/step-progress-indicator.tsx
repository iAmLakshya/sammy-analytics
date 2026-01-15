"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconCheck, IconClock, IconEye, IconLoader2, IconMinus, IconX } from "@tabler/icons-react";
import type { LstaTaskStep, StepStatus } from "../types";
import { STEP_STATUS_COLORS } from "../utils/status-config";

interface StepProgressIndicatorProps {
  steps: LstaTaskStep[];
  currentStepId: string | null;
}

export const StepProgressIndicator = ({
  steps,
  currentStepId,
}: StepProgressIndicatorProps) => {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const isActive = currentStepId === step.step;
        const isLast = index === steps.length - 1;

        const statusKey: StepStatus | "in-progress" =
          step.status === "pending" && isActive ? "in-progress" : step.status;
        const colors = STEP_STATUS_COLORS[statusKey];

        const getIcon = (): React.ReactNode => {
          switch (step.status) {
            case "completed":
              return <IconCheck className="size-3" />;
            case "failed":
              return <IconX className="size-3" />;
            case "not-ready":
              return <IconClock className="size-3" />;
            case "review-required":
              return <IconEye className="size-3" />;
            case "pending":
              return isActive ? (
                <IconLoader2 className="size-3 animate-spin" />
              ) : (
                <IconMinus className="size-3" />
              );
          }
        };

        const icon = getIcon();
        const bgClass = colors.bg;
        const textClass = colors.text;

        let tooltipContent = step.title;
        if (step.status === "failed" && step.errorReasons.length > 0) {
          tooltipContent += `: ${step.errorReasons[0]}`;
        } else if (step.status === "completed") {
          tooltipContent += " (completed)";
        } else if (step.status === "not-ready") {
          tooltipContent += " (waiting)";
        } else if (step.status === "review-required") {
          tooltipContent += " (needs review)";
        } else if (isActive) {
          tooltipContent += " (in progress)";
        }

        return (
          <div key={step.step} className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex size-6 items-center justify-center rounded-full ${bgClass} ${textClass}`}
                >
                  {icon}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium">{tooltipContent}</p>
                {step.status === "completed" && step.endedAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(step.endedAt).toLocaleTimeString()}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
            {!isLast && (
              <div className={`mx-0.5 h-0.5 w-2 ${colors.connector}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
