import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { useApiQuery } from "@/shared/lib/use-api-query";

export const useFetchAnalysisOverview = () =>
  useApiQuery(API_ENDPOINTS.analysis.overview);
