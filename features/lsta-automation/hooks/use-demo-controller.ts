import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/shared/lib/api-client";
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { PIPELINE_STEPS, type DemoProcessResponse, type PipelineStep, type ProcessAction } from "../types";
import {
  generateProcessingDuration,
  generateStepDuration,
  shouldTaskFail,
  shouldTaskBeNotReady,
  shouldRequireReview,
  getFailureStep,
} from "../utils/demo-task-processor";

interface ProcessTaskPayload {
  taskId: string;
  action: ProcessAction;
  failureStep?: string;
}

const processTaskApi = async (payload: ProcessTaskPayload) => {
  return fetchApi<DemoProcessResponse>(
    API_ENDPOINTS.lstaAutomations.demoProcess,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};

const STEP_COUNT = 4;
const MAX_CONCURRENT = 4;

interface TaskProgress {
  taskId: string;
  currentStep: number;
  willFail: boolean;
  failureStep?: string;
  willRequireReview: boolean;
}

export const useDemoController = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
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
    async (taskProgress: TaskProgress): Promise<boolean | "review-required"> => {
      if (abortRef.current) return false;

      const { taskId, currentStep, willFail, failureStep, willRequireReview } = taskProgress;

      if (willFail && failureStep) {
        const failureStepIndex = PIPELINE_STEPS.indexOf(failureStep as PipelineStep);

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

      if (willRequireReview && currentStep === 2) {
        await new Promise((resolve) => setTimeout(resolve, generateStepDuration()));
        if (abortRef.current) return false;
        await processTaskApi({ taskId, action: "review-required" });
        invalidateQueries();
        return "review-required";
      }

      return false;
    },
    [invalidateQueries]
  );

  const processTask = useCallback(
    async (taskId: string, forceSuccess: boolean = false): Promise<void> => {
      if (abortRef.current) return;

      activeTasksRef.current.add(taskId);

      try {
        const isNotReady = !forceSuccess && shouldTaskBeNotReady();

        if (isNotReady) {
          await processTaskApi({ taskId, action: "start" });
          invalidateQueries();
          await new Promise((resolve) => setTimeout(resolve, generateStepDuration()));
          if (abortRef.current) return;
          await processTaskApi({ taskId, action: "not-ready", failureStep: "payroll-download" });
          invalidateQueries();
          setCompletedTasks((prev) => prev + 1);
          return;
        }

        await processTaskApi({ taskId, action: "start" });
        invalidateQueries();

        const willFail = forceSuccess ? false : shouldTaskFail();
        const failureStep = willFail ? getFailureStep() : undefined;
        const willRequireReview = !forceSuccess && !willFail && shouldRequireReview();

        let currentStep = 0;
        let result: boolean | "review-required" = false;

        while (result === false && !abortRef.current) {
          const stepDuration = generateStepDuration();
          await new Promise((resolve) => setTimeout(resolve, stepDuration));

          if (abortRef.current) break;

          result = await processStep({
            taskId,
            currentStep,
            willFail,
            failureStep,
            willRequireReview,
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
    setIsRetrying(false);
    setProgress(0);
    setCurrentBatchId(null);
    activeTasksRef.current.clear();
  }, []);

  const retryFailed = useCallback(
    async (batchId: string, failedTaskIds: string[]) => {
      if (isRunning || isRetrying) return;

      abortRef.current = false;
      setIsRetrying(true);
      setIsRunning(true);
      setCurrentBatchId(batchId);
      setProgress(0);
      setTotalTasks(failedTaskIds.length);
      setCompletedTasks(0);
      activeTasksRef.current.clear();

      const queue = [...failedTaskIds];
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
            await processTask(taskId, true);
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
      setIsRetrying(false);
    },
    [isRunning, isRetrying, processTask, invalidateQueries]
  );

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approvingTaskId, setApprovingTaskId] = useState<string | null>(null);
  const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);

  const approveTask = useCallback(
    async (taskId: string) => {
      setIsApproving(true);
      setApprovingTaskId(taskId);
      try {
        await processTaskApi({ taskId, action: "approve" });
        invalidateQueries();
      } finally {
        setIsApproving(false);
        setApprovingTaskId(null);
      }
    },
    [invalidateQueries]
  );

  const rejectTask = useCallback(
    async (taskId: string) => {
      setIsRejecting(true);
      setRejectingTaskId(taskId);
      try {
        await processTaskApi({ taskId, action: "reject" });
        invalidateQueries();
      } finally {
        setIsRejecting(false);
        setRejectingTaskId(null);
      }
    },
    [invalidateQueries]
  );

  const calculatedProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : progress;

  return {
    isRunning,
    isRetrying,
    isApproving,
    isRejecting,
    approvingTaskId,
    rejectingTaskId,
    progress: calculatedProgress,
    currentBatchId,
    totalTasks,
    completedTasks,
    startDemo,
    stopDemo,
    retryFailed,
    approveTask,
    rejectTask,
  };
};
