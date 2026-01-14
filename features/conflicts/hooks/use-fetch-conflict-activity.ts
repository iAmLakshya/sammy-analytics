import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { useApiQuery } from "@/shared/lib/use-api-query";

export const useFetchConflictActivity = () =>
  useApiQuery(API_ENDPOINTS.conflicts.activity);
