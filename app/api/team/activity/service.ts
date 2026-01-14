import { dailyReviewActivity } from "@/features/team/data/mock.team.data";
import type { ReviewActivityResponse } from "@/features/team/types";
import { ServiceError } from "@/shared/utils/server/errors";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

export const getTeamActivity =
  (dependencies: CoreDependencies) =>
  async (): Promise<ReviewActivityResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: dailyReviewActivity,
    };
  };
