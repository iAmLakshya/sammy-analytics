import { dailyDiffs } from "@/features/diffs/data/mock.diffs.data";
import type { DailyDiffsResponse } from "@/features/diffs/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

export const getDailyDiffs =
  (dependencies: CoreDependencies) =>
  async (): Promise<DailyDiffsResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: dailyDiffs,
    };
  };
