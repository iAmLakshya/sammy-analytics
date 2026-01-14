import {
  documentsNeedingAttention,
  reviewers,
  teamOverview,
  userCorrections,
  weekdayActivity,
} from "@/features/team/data/mock.team.data";
import type { TeamOverviewResponse } from "@/features/team/types";
import { ServiceError } from "@/shared/utils/server/errors";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

export const getTeamOverview =
  (dependencies: CoreDependencies) =>
  async (): Promise<TeamOverviewResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      overview: teamOverview,
      reviewers,
      weekdayActivity,
      corrections: userCorrections,
      documentsNeedingAttention,
    };
  };
