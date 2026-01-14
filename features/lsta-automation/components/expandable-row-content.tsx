"use client";

import { useState, useMemo } from "react";
import { IconRefresh } from "@tabler/icons-react";
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

const getLastCompletedIndex = (steps: StepResult[]): number => {
  return steps.reduceRight(
    (acc, s, i) => (acc === -1 && s.status === "completed" ? i : acc),
    -1
  );
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

  const lastCompletedIndex = getLastCompletedIndex(steps);
  const progressPercent = lastCompletedIndex >= 0
    ? (lastCompletedIndex / (steps.length - 1)) * 100
    : 0;

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
          <div className="flex items-center gap-1.5">
            {steps.map((stepResult, index) => {
              const isActive = currentStep === stepResult.step;
              return (
                <StepPill
                  key={stepResult.step}
                  stepResult={stepResult}
                  stepLabel={stepLabels[stepResult.step]}
                  isActive={isActive}
                  isSelected={selectedIndex === index}
                  onClick={() => setSelectedIndex(index)}
                />
              );
            })}
            {showRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="ml-auto shrink-0">
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
