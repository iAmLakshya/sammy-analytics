import type { LstaTask, LstaTaskStep, TaskStatus } from "../types";

export const getCurrentStepId = (task: LstaTask): string | null => {
  if (task.status === "processing") {
    const activeStep = task.steps.find((s) => s.status === "pending" && s.startedAt);
    return activeStep?.step ?? null;
  }
  return null;
};

export const getDefaultSelectedStepIndex = (
  steps: LstaTaskStep[],
  currentStepId: string | null
): number => {
  if (currentStepId) {
    const idx = steps.findIndex((s) => s.step === currentStepId);
    if (idx !== -1) return idx;
  }
  const reviewIdx = steps.findIndex((s) => s.status === "review-required");
  if (reviewIdx !== -1) return reviewIdx;
  const failedIdx = steps.findIndex((s) => s.status === "failed");
  if (failedIdx !== -1) return failedIdx;
  const lastCompleted = steps.reduceRight(
    (acc, s, i) => (acc === -1 && s.status === "completed" ? i : acc),
    -1
  );
  return lastCompleted !== -1 ? lastCompleted : 0;
};

const STATUS_PRIORITY: Record<TaskStatus, number> = {
  failed: 0,
  rejected: 1,
  "review-required": 2,
  "not-ready": 3,
  processing: 4,
  retrying: 5,
  pending: 6,
  completed: 7,
};

export const sortTasksByPriority = (tasks: LstaTask[]): LstaTask[] => {
  return [...tasks].sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);
};
