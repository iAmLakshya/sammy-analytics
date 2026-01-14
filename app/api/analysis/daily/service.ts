import { dailyAnalysisRuns } from "@/features/analysis/data/mock.analysis.data";
import type { DailyAnalysisResponse } from "@/features/analysis/types";
import { ServiceError } from "@/shared/utils/server/errors";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

export const getDailyAnalysis =
  (dependencies: CoreDependencies) =>
  async (): Promise<DailyAnalysisResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: dailyAnalysisRuns,
    };
  };
