import { mockLstaTasks } from "@/features/lsta-automation/data/mock.tasks.data";
import type { LstaTaskDetailResponse } from "@/features/lsta-automation/types";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { NotFoundError, ServiceError } from "@/shared/utils/server/errors";

export const getLstaTaskDetail =
  (dependencies: CoreDependencies) =>
  async (taskId: string): Promise<LstaTaskDetailResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const task = mockLstaTasks.find((t) => t.id === taskId);
    if (!task) {
      return new NotFoundError(`Task with ID ${taskId} not found`);
    }

    return task;
  };
