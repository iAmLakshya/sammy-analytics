import { weeklyDiffs } from "@/features/diffs/data/mock.diffs.data";
import type { WeeklyDiffsResponse } from "@/features/diffs/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

export const getWeeklyDiffs =
  (dependencies: CoreDependencies) =>
  async (): Promise<WeeklyDiffsResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: weeklyDiffs,
    };
  };
