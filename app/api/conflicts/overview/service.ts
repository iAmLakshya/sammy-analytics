import {
  dispositionSummary,
  pendingAging,
  priorityBreakdown,
  timeToReview,
  userCorrections,
} from "@/features/conflicts/data/mock.conflicts.data";
import type { ConflictsOverviewResponse } from "@/features/conflicts/types";
import { ServiceError } from "@/shared/utils/server/errors";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

export const getConflictsOverview =
  (dependencies: CoreDependencies) =>
  async (): Promise<ConflictsOverviewResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      dispositionSummary,
      timeToReview,
      userCorrections,
      priorityBreakdown,
      pendingAging,
    };
  };
