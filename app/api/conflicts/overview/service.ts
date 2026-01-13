import {
  dispositionSummary,
  timeToReview,
  userCorrections,
  priorityBreakdown,
  pendingAging,
} from "@/features/conflicts/data/mock.conflicts.data";
import type { ConflictsOverviewResponse } from "@/features/conflicts/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

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
