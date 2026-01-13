import {
  analysisPerformance,
  performanceDistribution,
} from "@/features/analysis/data/mock.analysis.data";
import type { AnalysisOverviewResponse } from "@/features/analysis/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

export const getAnalysisOverview =
  (dependencies: CoreDependencies) =>
  async (): Promise<AnalysisOverviewResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      performance: analysisPerformance,
      performanceDistribution,
    };
  };
