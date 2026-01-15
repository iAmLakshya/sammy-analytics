"use client";

interface DemoControlsProps {
  isRunning: boolean;
  totalTasks: number;
  completedTasks: number;
  failedCount: number;
}

export const DemoControls = ({
  isRunning,
  totalTasks,
  completedTasks,
  failedCount,
}: DemoControlsProps) => {
  const isComplete =
    totalTasks > 0 && completedTasks === totalTasks && !isRunning;

  return (
    <span className="text-xs tabular-nums text-muted-foreground">
      {isComplete ? (
        failedCount > 0
          ? `Completed with ${failedCount} failed`
          : "Processing complete"
      ) : (
        <>
          {completedTasks} of {totalTasks} tasks
        </>
      )}
    </span>
  );
};
