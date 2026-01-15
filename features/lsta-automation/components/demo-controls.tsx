"use client";

import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";

interface DemoControlsProps {
  isRunning: boolean;
  isRetrying: boolean;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  failedCount: number;
  onRetryFailed: () => void;
}

export const DemoControls = ({
  isRunning,
  isRetrying,
  progress,
  totalTasks,
  completedTasks,
  failedCount,
  onRetryFailed,
}: DemoControlsProps) => {
  const isComplete = progress === 100 && !isRunning && !isRetrying;
  const showRetryButton = isComplete && failedCount > 0;

  return (
    <div className="flex items-center gap-3">
      {showRetryButton && (
        <Button
          size="sm"
          onClick={onRetryFailed}
          className="cursor-pointer gap-1.5"
        >
          <IconRefresh className="size-4" />
          Retry {failedCount} Failed
        </Button>
      )}

      <div className="flex items-center gap-3">
        <div className="relative h-2 w-40 overflow-hidden rounded-full bg-muted">
          <motion.div
            style={{ willChange: "width" }}
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {isComplete && failedCount === 0 ? (
            "Processing complete"
          ) : isRetrying ? (
            <>Retrying {completedTasks} of {totalTasks}</>
          ) : (
            <>{completedTasks} of {totalTasks} tasks</>
          )}
        </span>
      </div>
    </div>
  );
};
