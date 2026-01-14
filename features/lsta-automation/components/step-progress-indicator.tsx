"use client";

import { IconCheck, IconX, IconLoader2, IconMinus } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { StepResult, PipelineStep } from "../types";

const stepLabels: Record<PipelineStep, string> = {
  "payroll-download": "Payroll Download",
  "data-extraction": "Data Extraction",
  "tax-submission": "Tax Submission",
  "document-upload": "Document Upload",
};

interface StepProgressIndicatorProps {
  steps: StepResult[];
  currentStep: PipelineStep | null;
}

export const StepProgressIndicator = ({
  steps,
  currentStep,
}: StepProgressIndicatorProps) => {
  return (
    <div className="flex items-center gap-1">
      {steps.map((stepResult, index) => {
        const isActive = currentStep === stepResult.step;
        const isLast = index === steps.length - 1;

        let icon: React.ReactNode;
        let bgClass: string;
        let textClass: string;

        switch (stepResult.status) {
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
          case "skipped":
            icon = <IconMinus className="size-3" />;
            bgClass = "bg-muted";
            textClass = "text-muted-foreground/50";
            break;
        }

        let tooltipContent = stepLabels[stepResult.step];
        if (stepResult.status === "failed" && stepResult.errorMessage) {
          tooltipContent += `: ${stepResult.errorMessage}`;
        } else if (stepResult.status === "completed") {
          tooltipContent += " ✓";
        } else if (isActive) {
          tooltipContent += " (in progress)";
        }

        return (
          <div key={stepResult.step} className="flex items-center">
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
                {stepResult.status === "completed" && stepResult.completedAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(stepResult.completedAt).toLocaleTimeString()}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
            {!isLast && (
              <div
                className={`mx-0.5 h-0.5 w-2 ${
                  stepResult.status === "completed"
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
