import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { useApiQuery } from "@/shared/lib/use-api-query";

export const useFetchTeamOverview = () =>
  useApiQuery(API_ENDPOINTS.team.overview);
