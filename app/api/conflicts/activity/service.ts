import { reviewActivity } from "@/features/conflicts/data/mock.conflicts.data";
import type { ConflictActivityResponse } from "@/features/conflicts/types";
import { ServiceError } from "@/shared/utils/server/errors";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

export const getReviewActivity =
  (dependencies: CoreDependencies) =>
  async (): Promise<ConflictActivityResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: reviewActivity,
    };
  };
