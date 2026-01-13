import { useApiQuery } from "@/shared/lib/use-api-query"
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints"

export const useFetchAnalysisOverview = () =>
  useApiQuery(API_ENDPOINTS.analysis.overview)
