import { reviewActivity } from "@/features/conflicts/data/mock.conflicts.data";
import type { ConflictActivityResponse } from "@/features/conflicts/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

export const getReviewActivity =
  (dependencies: CoreDependencies) =>
  async (): Promise<ConflictActivityResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: reviewActivity,
    };
  };
