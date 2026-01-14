import {
  pendingDiffsBacklog,
  stateDistribution,
  timeToResolution,
} from "@/features/diffs/data/mock.diffs.data";
import type { DiffsOverviewResponse } from "@/features/diffs/types";
import { ServiceError } from "@/shared/utils/server/errors";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

export const getDiffsOverview =
  (dependencies: CoreDependencies) =>
  async (): Promise<DiffsOverviewResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      stateDistribution,
      backlog: pendingDiffsBacklog,
      timeToResolution,
    };
  };
