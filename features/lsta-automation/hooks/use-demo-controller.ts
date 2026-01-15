import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  generateProcessingDuration,
  generateStepDuration,
  shouldTaskFail,
  getFailureStep,
} from "../utils/demo-task-processor";

interface ProcessTaskPayload {
  taskId: string;
  action: "start" | "complete-step" | "fail" | "complete";
  failureStep?: string;
}

const processTaskApi = async (payload: ProcessTaskPayload) => {
  const response = await fetch("/api/v1/lsta-automations/demo/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to process task");
  }
  return response.json();
};

const STEP_COUNT = 4;
const MAX_CONCURRENT = 4;

interface TaskProgress {
  taskId: string;
  currentStep: number;
  willFail: boolean;
  failureStep?: string;
}

export const useDemoController = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const queryClient = useQueryClient();
  const abortRef = useRef(false);
  const activeTasksRef = useRef<Set<string>>(new Set());

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["lsta-automations", "list"] });
  }, [queryClient]);

  const processStep = useCallback(
    async (taskProgress: TaskProgress): Promise<boolean> => {
      if (abortRef.current) return false;

      const { taskId, currentStep, willFail, failureStep } = taskProgress;

      if (willFail && failureStep) {
        const failureStepIndex = [
          "payroll-download",
          "data-extraction",
          "tax-submission",
          "document-upload",
        ].indexOf(failureStep);

        if (currentStep >= failureStepIndex) {
          await processTaskApi({ taskId, action: "fail", failureStep });
          invalidateQueries();
          return true;
        }
      }

      if (currentStep >= STEP_COUNT) {
        await processTaskApi({ taskId, action: "complete" });
        invalidateQueries();
        return true;
      }

      await processTaskApi({ taskId, action: "complete-step" });
      invalidateQueries();
      return false;
    },
    [invalidateQueries]
  );

  const processTask = useCallback(
    async (taskId: string): Promise<void> => {
      if (abortRef.current) return;

      activeTasksRef.current.add(taskId);

      try {
        await processTaskApi({ taskId, action: "start" });
        invalidateQueries();

        const willFail = shouldTaskFail();
        const failureStep = willFail ? getFailureStep() : undefined;

        let currentStep = 0;
        let isComplete = false;

        while (!isComplete && !abortRef.current) {
          const stepDuration = generateStepDuration();
          await new Promise((resolve) => setTimeout(resolve, stepDuration));

          if (abortRef.current) break;

          isComplete = await processStep({
            taskId,
            currentStep,
            willFail,
            failureStep,
          });

          currentStep++;
        }

        setCompletedTasks((prev) => prev + 1);
      } finally {
        activeTasksRef.current.delete(taskId);
      }
    },
    [invalidateQueries, processStep]
  );

  const startDemo = useCallback(
    async (batchId: string, pendingTaskIds: string[]) => {
      if (isRunning) return;

      abortRef.current = false;
      setIsRunning(true);
      setCurrentBatchId(batchId);
      setProgress(0);
      setTotalTasks(pendingTaskIds.length);
      setCompletedTasks(0);
      activeTasksRef.current.clear();

      const queue = [...pendingTaskIds];
      const processingPromises: Promise<void>[] = [];

      const runNext = async (): Promise<void> => {
        while (queue.length > 0 && !abortRef.current) {
          if (activeTasksRef.current.size >= MAX_CONCURRENT) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            continue;
          }

          const taskId = queue.shift();
          if (!taskId) break;

          const duration = generateProcessingDuration();
          const processPromise = (async () => {
            await processTask(taskId);
            await new Promise((resolve) => setTimeout(resolve, duration - 2000));
          })();

          processingPromises.push(processPromise);
          processPromise.then(() => {});
        }
      };

      const workers = Array(MAX_CONCURRENT)
        .fill(null)
        .map(() => runNext());

      await Promise.all(workers);
      await Promise.all(processingPromises);

      if (!abortRef.current) {
        setProgress(100);
        invalidateQueries();
      }

      setIsRunning(false);
    },
    [isRunning, processTask, invalidateQueries]
  );

  const stopDemo = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
    setProgress(0);
    setCurrentBatchId(null);
    activeTasksRef.current.clear();
  }, []);

  const calculatedProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : progress;

  return {
    isRunning,
    progress: calculatedProgress,
    currentBatchId,
    totalTasks,
    completedTasks,
    startDemo,
    stopDemo,
  };
};
