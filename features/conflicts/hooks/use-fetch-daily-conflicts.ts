import { useApiQuery } from "@/shared/lib/use-api-query"
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints"

export const useFetchDailyConflicts = () =>
  useApiQuery(API_ENDPOINTS.conflicts.daily)
