import { fetchApi } from "@/shared/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadDemoCsvResponse {
  batchId: string;
  taskIds: string[];
  taskCount: number;
}

interface UseUploadDemoCsvOptions {
  onSuccess?: (data: UploadDemoCsvResponse) => void;
}

export const useUploadDemoCsv = (options: UseUploadDemoCsvOptions = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (csvContent: string) => {
      return fetchApi<UploadDemoCsvResponse>(
        "/api/v1/lsta-automations/demo/upload",
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
