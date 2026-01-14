import { fetchApi } from "@/shared/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LstaTaskRetryResponse } from "../types";

export const useRetryLstaTask = () => {
  const queryClient = useQueryClient();

  return useMutation<LstaTaskRetryResponse, Error, string>({
    mutationFn: (taskId: string) =>
      fetchApi<LstaTaskRetryResponse>(
        `/api/v1/lsta-automations/${taskId}/retry`,
        {
          method: "POST",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lsta-automations"] });
    },
  });
};
