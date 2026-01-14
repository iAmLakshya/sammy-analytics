import { fetchApi } from "@/shared/lib/api-client";
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { useQuery } from "@tanstack/react-query";
import type { LstaTaskListResponse } from "../types";

interface UseFetchLstaTasksParams {
  batchId?: string | null;
  page?: number;
  size?: number;
}

export const useFetchLstaTasks = (params: UseFetchLstaTasksParams = {}) => {
  const { batchId, page = 1, size = 20 } = params;

  const queryParams = new URLSearchParams();
  if (batchId) queryParams.set("batch_id", batchId);
  queryParams.set("page", String(page));
  queryParams.set("size", String(size));

  const endpoint = `${API_ENDPOINTS.lstaAutomations.list}?${queryParams.toString()}`;

  return useQuery<LstaTaskListResponse>({
    queryKey: ["lsta-automations", "list", { batchId, page, size }],
    queryFn: () => fetchApi<LstaTaskListResponse>(endpoint),
    staleTime: 30_000,
  });
};
