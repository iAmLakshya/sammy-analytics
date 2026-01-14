import {
  computeCountByStatus,
  mockLstaTasks,
} from "@/features/lsta-automation/data/mock.tasks.data";
import type { LstaTaskListResponse } from "@/features/lsta-automation/types";
import type { ServiceError } from "@/shared/utils/server/errors";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

interface ListParams {
  batchId?: string;
  page: number;
  size: number;
}

export const getLstaTaskList =
  (dependencies: CoreDependencies) =>
  async (params: ListParams): Promise<LstaTaskListResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const filteredTasks = params.batchId
      ? mockLstaTasks.filter((task) => task.batch.id === params.batchId)
      : mockLstaTasks;

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
