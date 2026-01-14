"use client";

import { IconCheck, IconX, IconLoader2, IconMinus } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LstaTaskStep } from "../types";

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

        let icon: React.ReactNode;
        let bgClass: string;
        let textClass: string;

        switch (step.status) {
          case "completed":
            icon = <IconCheck className="size-3" />;
            bgClass = "bg-emerald-100 dark:bg-emerald-900/40";
            textClass = "text-emerald-700 dark:text-emerald-400";
            break;
          case "failed":
            icon = <IconX className="size-3" />;
            bgClass = "bg-rose-100 dark:bg-rose-900/40";
            textClass = "text-rose-700 dark:text-rose-400";
            break;
          case "pending":
            if (isActive) {
              icon = <IconLoader2 className="size-3 animate-spin" />;
              bgClass = "bg-blue-100 dark:bg-blue-900/40";
              textClass = "text-blue-700 dark:text-blue-400";
            } else {
              icon = <IconMinus className="size-3" />;
              bgClass = "bg-muted";
              textClass = "text-muted-foreground";
            }
            break;
        }

        let tooltipContent = step.title;
        if (step.status === "failed" && step.errorReasons.length > 0) {
          tooltipContent += `: ${step.errorReasons[0]}`;
        } else if (step.status === "completed") {
          tooltipContent += " ✓";
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
              <div
                className={`mx-0.5 h-0.5 w-2 ${
                  step.status === "completed"
                    ? "bg-emerald-300 dark:bg-emerald-700"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
