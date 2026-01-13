import { dailyConflicts } from "@/features/conflicts/data/mock.conflicts.data";
import type { DailyConflictsResponse } from "@/features/conflicts/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

export const getDailyConflicts =
  (dependencies: CoreDependencies) =>
  async (): Promise<DailyConflictsResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: dailyConflicts,
    };
  };
