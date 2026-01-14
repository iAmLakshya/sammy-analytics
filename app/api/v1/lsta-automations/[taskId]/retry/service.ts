import { mockLstaTasks } from "@/features/lsta-automation/data/mock.tasks.data";
import type { LstaTaskRetryResponse, LstaTask } from "@/features/lsta-automation/types";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { NotFoundError, BadRequestError, ServiceError } from "@/shared/utils/server/errors";

export const retryLstaTask =
  (dependencies: CoreDependencies) =>
  async (taskId: string): Promise<LstaTaskRetryResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const taskIndex = mockLstaTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return new NotFoundError(`Task with ID ${taskId} not found`);
    }

    const task = mockLstaTasks[taskIndex];
    if (task.status !== "failed") {
      return new BadRequestError(`Task ${taskId} is not in failed status. Current status: ${task.status}`);
    }

    const updatedTask: LstaTask = {
      ...task,
      status: "retrying",
      statusDescription: "Retry initiated...",
      updatedAt: new Date().toISOString(),
      steps: task.steps.map((step) => ({
        ...step,
        status: "pending",
        statusDescription: null,
        errorReasons: [],
        startedAt: null,
        endedAt: null,
      })),
    };

    mockLstaTasks[taskIndex] = updatedTask;

    return {
      success: true,
      task: updatedTask,
    };
  };
