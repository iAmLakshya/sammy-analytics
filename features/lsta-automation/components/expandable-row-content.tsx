"use client";

import { IconRefresh } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Submission, PipelineStep } from "../types";
import { StepDetailCard } from "./step-detail-card";

const stepLabels: Record<PipelineStep, string> = {
  "payroll-download": "Payroll Download",
  "data-extraction": "Data Extraction",
  "tax-submission": "Tax Submission",
  "document-upload": "Document Upload",
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
        <div className="bg-muted/30 px-4 py-6">
          <div className="relative flex flex-col gap-4 lg:flex-row lg:gap-3">
            {steps.map((stepResult, index) => {
              const isActive = currentStep === stepResult.step;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={stepResult.step}
                  className="relative flex flex-1 flex-col lg:flex-row"
                >
                  <StepDetailCard
                    stepResult={stepResult}
                    stepLabel={stepLabels[stepResult.step]}
                    isActive={isActive}
                  />
                  {!isLast && (
                    <>
                      <div className="mx-auto hidden h-0.5 w-6 self-center bg-border lg:block" />
                      <div className="mx-auto h-4 w-0.5 bg-border lg:hidden" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {showRetry && (
            <div className="mt-4 flex justify-end border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={onRetry}>
                <IconRefresh className="mr-1.5 size-4" />
                Retry Failed Step
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
