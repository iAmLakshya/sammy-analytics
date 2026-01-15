import type { LstaTask } from "@/features/lsta-automation/types";

interface StoredBatch {
  id: string;
  name: string;
  tasks: LstaTask[];
}

export const uploadedBatches: Map<string, StoredBatch> = new Map();
