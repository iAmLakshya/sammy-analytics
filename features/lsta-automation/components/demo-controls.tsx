"use client";

import { Button } from "@/components/ui/button";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { motion } from "motion/react";

interface DemoControlsProps {
  isRunning: boolean;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  onStart: () => void;
  onStop: () => void;
}

export const DemoControls = ({
  isRunning,
  progress,
  totalTasks,
  completedTasks,
  onStart,
  onStop,
}: DemoControlsProps) => {
  const isComplete = progress === 100 && !isRunning;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {isRunning ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onStop}
            className="cursor-pointer gap-1.5"
          >
            <IconPlayerPause className="size-4" />
            Stop
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onStart}
            disabled={isComplete}
            className="cursor-pointer gap-1.5"
          >
            <IconPlayerPlay className="size-4" />
            {isComplete ? "Complete" : "Start Processing"}
          </Button>
        )}
      </div>

      {(isRunning || isComplete) && (
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
            {isComplete ? (
              "Processing complete"
            ) : (
              <>
                {completedTasks} of {totalTasks} tasks
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};
