import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { useApiQuery } from "@/shared/lib/use-api-query";

export const useFetchDailySyncs = () =>
  useApiQuery(API_ENDPOINTS.webSources.daily);
