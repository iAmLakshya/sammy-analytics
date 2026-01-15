import { fetchApi } from "@/shared/lib/api-client";
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DemoUploadResponse } from "../types";

interface UseUploadDemoCsvOptions {
  onSuccess?: (data: DemoUploadResponse) => void;
}

export const useUploadDemoCsv = (options: UseUploadDemoCsvOptions = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (csvContent: string) => {
      return fetchApi<DemoUploadResponse>(
        API_ENDPOINTS.lstaAutomations.demoUpload,
        {
          method: "POST",
          body: JSON.stringify({ csvContent }),
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lsta-automations"] });
      options.onSuccess?.(data);
    },
  });

  return {
    uploadCsv: mutation.mutate,
    isUploading: mutation.isPending,
    error: mutation.error,
  };
};
