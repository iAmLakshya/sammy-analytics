import { useApiQuery } from "@/shared/lib/use-api-query"
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints"

export const useFetchTeamOverview = () =>
  useApiQuery(API_ENDPOINTS.team.overview)
