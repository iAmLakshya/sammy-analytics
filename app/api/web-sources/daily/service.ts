import { dailySyncs } from "@/features/web-sources/data/mock.web-sources.data";
import type { DailySyncsResponse } from "@/features/web-sources/types";
import { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { ServiceError } from "@/shared/utils/server/errors";

export const getDailySyncs =
  (dependencies: CoreDependencies) =>
  async (): Promise<DailySyncsResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      data: dailySyncs,
    };
  };
