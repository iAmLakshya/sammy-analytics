import {
  computeCountByStatus,
  mockLstaTasks,
} from "@/features/lsta-automation/data/mock.tasks.data";
import type { LstaTask, LstaTaskListResponse } from "@/features/lsta-automation/types";
import type { ServiceError } from "@/shared/utils/server/errors";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { uploadedBatches } from "./store";

interface ListParams {
  batchId?: string;
  page: number;
  size: number;
}

const getAllTasks = (): LstaTask[] => {
  const uploadedTasks = Array.from(uploadedBatches.values()).flatMap((b) => b.tasks);
  return [...mockLstaTasks, ...uploadedTasks];
};

export const getLstaTaskList =
  (_dependencies: CoreDependencies) =>
  async (params: ListParams): Promise<LstaTaskListResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const allTasks = getAllTasks();
    const filteredTasks = params.batchId
      ? allTasks.filter((task) => task.batch.id === params.batchId)
      : allTasks;

    const totalCount = filteredTasks.length;
    const totalPages = Math.ceil(totalCount / params.size);
    const startIndex = (params.page - 1) * params.size;
    const paginatedTasks = filteredTasks.slice(
      startIndex,
      startIndex + params.size
    );

    return {
      metadata: {
        totalCount,
        countByStatus: computeCountByStatus(filteredTasks),
      },
      tasks: paginatedTasks,
      page: params.page,
      size: params.size,
      totalPages,
    };
  };
