import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { useApiQuery } from "@/shared/lib/use-api-query";

export const useFetchReviewActivity = () =>
  useApiQuery(API_ENDPOINTS.team.activity);
