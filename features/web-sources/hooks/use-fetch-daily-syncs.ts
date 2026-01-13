import { useApiQuery } from "@/shared/lib/use-api-query"
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints"

export const useFetchDailySyncs = () =>
  useApiQuery(API_ENDPOINTS.webSources.daily)
