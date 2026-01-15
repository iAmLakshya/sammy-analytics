import { mockLstaTasks } from "@/features/lsta-automation/data/mock.tasks.data";
import type {
  LstaTask,
  LstaTaskRetryResponse,
} from "@/features/lsta-automation/types";
import {
  BadRequestError,
  NotFoundError,
  ServiceError,
} from "@/shared/utils/server/errors";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { uploadedBatches } from "../../store";

const findTask = (
  taskId: string
): { task: LstaTask; update: (updated: LstaTask) => void } | null => {
  const mockIndex = mockLstaTasks.findIndex((t) => t.id === taskId);
  if (mockIndex !== -1) {
    return {
      task: mockLstaTasks[mockIndex],
      update: (updated) => {
        mockLstaTasks[mockIndex] = updated;
      },
    };
  }

  for (const batch of uploadedBatches.values()) {
    const taskIndex = batch.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      return {
        task: batch.tasks[taskIndex],
        update: (updated) => {
          batch.tasks[taskIndex] = updated;
        },
      };
    }
  }

  return null;
};

export const retryLstaTask =
  (_dependencies: CoreDependencies) =>
  async (taskId: string): Promise<LstaTaskRetryResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const found = findTask(taskId);
    if (!found) {
      return new NotFoundError(`Task with ID ${taskId} not found`);
    }

    const { task, update } = found;
    if (task.status !== "failed") {
      return new BadRequestError(
        `Task ${taskId} is not in failed status. Current status: ${task.status}`
      );
    }

    const updatedTask: LstaTask = {
      ...task,
      status: "pending",
      statusDescription: null,
      updatedAt: new Date().toISOString(),
      steps: task.steps.map((step) => ({
        ...step,
        status: "pending",
        statusDescription: null,
        errorReasons: [],
        validationChecks: [],
        startedAt: null,
        endedAt: null,
      })),
    };

    update(updatedTask);

    return {
      success: true,
      task: updatedTask,
    };
  };
