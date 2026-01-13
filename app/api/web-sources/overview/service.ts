import {
  webWatchOverview,
  webPageSyncOverview,
  syncCoverage,
  priorityBreakdown,
} from "@/features/web-sources/data/mock.web-sources.data";
import type { WebSourcesOverviewResponse } from "@/features/web-sources/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

export const getWebSourcesOverview =
  (dependencies: CoreDependencies) =>
  async (): Promise<WebSourcesOverviewResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      webWatch: webWatchOverview,
      syncOverview: webPageSyncOverview,
      syncCoverage,
      priorityBreakdown,
    };
  };
