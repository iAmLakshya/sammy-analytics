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
        <div className="space-y-4 bg-muted/20 px-4 py-5 sm:px-6">
          <div className="relative hidden sm:block">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
            <div
              className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="relative flex items-center justify-between">
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:hidden">
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
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <StepDetailPanel
                stepResult={selectedStep}
                stepLabel={stepLabels[selectedStep.step]}
                isActive={currentStep === selectedStep.step}
              />
            </div>
            {showRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
                <IconRefresh className="mr-1.5 size-4" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
