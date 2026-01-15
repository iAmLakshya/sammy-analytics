"use client";

import { Button } from "@/components/ui/button";
import { IconCheck, IconChevronRight, IconRefresh, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useMemo, useState } from "react";
import type { LstaTask } from "../types";
import { getCurrentStepId, getDefaultSelectedStepIndex } from "../utils/task-helpers";
import { StepDetailPanel, StepPill } from "./step-detail-card";

interface ExpandableRowContentProps {
  task: LstaTask;
  onRetry?: (taskId: string) => void;
  isRetrying?: boolean;
  onApprove?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export const ExpandableRowContent = ({
  task,
  onRetry,
  isRetrying,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ExpandableRowContentProps) => {
  const { steps, status } = task;
  const currentStepId = getCurrentStepId(task);

  const defaultSelectedIndex = useMemo(() => {
    return getDefaultSelectedStepIndex(steps, currentStepId);
  }, [steps, currentStepId]);

  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const selectedStep = steps[selectedIndex];
  const showRetry = status === "failed" && onRetry;
  const showReviewActions = status === "review-required" && onApprove && onReject;

  return (
    <AnimatePresence>
      <motion.div
        style={{ willChange: "opacity, height" }}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="ml-10 border-l-2 border-muted py-3 pl-4 pr-3">
          <div className="flex items-center gap-1">
            {steps.map((step, index) => {
              const isActive = currentStepId === step.step;
              const isLast = index === steps.length - 1;
              return (
                <Fragment key={step.step}>
                  <StepPill
                    step={step}
                    isActive={isActive}
                    isSelected={selectedIndex === index}
                    onClick={() => setSelectedIndex(index)}
                  />
                  {!isLast && (
                    <IconChevronRight className="size-3 shrink-0 text-muted-foreground/50" />
                  )}
                </Fragment>
              );
            })}
            {showRetry && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRetry(task.id)}
                disabled={isRetrying}
                className="ml-auto h-7 shrink-0 px-2 text-xs"
              >
                <IconRefresh
                  className={`mr-1 size-3 ${isRetrying ? "animate-spin" : ""}`}
                />
                {isRetrying ? "Retrying..." : "Retry"}
              </Button>
            )}
            {showReviewActions && (
              <div className="ml-auto flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(task.id)}
                  disabled={isApproving || isRejecting}
                  className="h-7 px-2 text-xs"
                >
                  <IconX className="mr-1 size-3" />
                  {isRejecting ? "Rejecting..." : "Reject"}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onApprove(task.id)}
                  disabled={isApproving || isRejecting}
                  className="h-7 px-2 text-xs"
                >
                  <IconCheck className="mr-1 size-3" />
                  {isApproving ? "Approving..." : "Approve"}
                </Button>
              </div>
            )}
          </div>
          <StepDetailPanel
            step={selectedStep}
            isActive={currentStepId === selectedStep.step}
            taskStatus={status}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
