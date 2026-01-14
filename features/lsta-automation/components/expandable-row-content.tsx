"use client";

import { useState, useMemo, Fragment } from "react";
import { IconRefresh, IconChevronRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Submission, PipelineStep, StepResult } from "../types";
import { StepPill, StepDetailPanel } from "./step-detail-card";

const stepLabels: Record<PipelineStep, string> = {
  "payroll-download": "Download LSTA",
  "data-extraction": "Extract & Map",
  "tax-submission": "Submit to ELSTER",
  "document-upload": "Upload to Personio",
};

const getDefaultSelectedIndex = (steps: StepResult[], currentStep: PipelineStep | null): number => {
  if (currentStep) {
    const idx = steps.findIndex((s) => s.step === currentStep);
    if (idx !== -1) return idx;
  }
  const failedIdx = steps.findIndex((s) => s.status === "failed");
  if (failedIdx !== -1) return failedIdx;
  const lastCompleted = steps.reduceRight(
    (acc, s, i) => (acc === -1 && s.status === "completed" ? i : acc),
    -1
  );
  return lastCompleted !== -1 ? lastCompleted : 0;
};

interface ExpandableRowContentProps {
  submission: Submission;
  onRetry?: () => void;
}

export const ExpandableRowContent = ({
  submission,
  onRetry,
}: ExpandableRowContentProps) => {
  const { steps, currentStep, status } = submission;

  const defaultSelectedIndex = useMemo(() => {
    return getDefaultSelectedIndex(steps, currentStep);
  }, [steps, currentStep]);

  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const selectedStep = steps[selectedIndex];
  const showRetry = status === "needs-review" && onRetry;

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
        <div className="ml-10 border-l-2 border-muted py-2 pl-4 pr-3">
          <div className="flex items-center gap-1">
            {steps.map((stepResult, index) => {
              const isActive = currentStep === stepResult.step;
              const isLast = index === steps.length - 1;
              return (
                <Fragment key={stepResult.step}>
                  <StepPill
                    stepResult={stepResult}
                    stepLabel={stepLabels[stepResult.step]}
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
                onClick={onRetry}
                className="ml-auto h-7 shrink-0 px-2 text-xs"
              >
                <IconRefresh className="mr-1 size-3" />
                Retry
              </Button>
            )}
          </div>
          <StepDetailPanel
            stepResult={selectedStep}
            isActive={currentStep === selectedStep.step}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
