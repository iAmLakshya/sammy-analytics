import type { LstaTask } from "@/features/lsta-automation/types";

interface StoredBatch {
  id: string;
  name: string;
  tasks: LstaTask[];
}

interface GlobalStore {
  __lstaUploadedBatches?: Map<string, StoredBatch>;
}

const globalStore = globalThis as unknown as GlobalStore;

if (!globalStore.__lstaUploadedBatches) {
  globalStore.__lstaUploadedBatches = new Map();
}

export const uploadedBatches = globalStore.__lstaUploadedBatches;
