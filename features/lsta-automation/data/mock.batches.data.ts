import type { Batch } from "../types";

export const mockBatches: Batch[] = [
  {
    id: "batch-001",
    name: "December 2025",
    dateRange: {
      start: "2025-12-01T00:00:00Z",
      end: "2025-12-31T23:59:59Z",
    },
    createdAt: "2025-12-01T00:00:00Z",
    submissionCount: 4,
  },
  {
    id: "batch-002",
    name: "Q4 2025",
    dateRange: {
      start: "2025-10-01T00:00:00Z",
      end: "2025-12-31T23:59:59Z",
    },
    createdAt: "2025-10-01T00:00:00Z",
    submissionCount: 1,
  },
  {
    id: "batch-003",
    name: "November 2025",
    dateRange: {
      start: "2025-11-01T00:00:00Z",
      end: "2025-11-30T23:59:59Z",
    },
    createdAt: "2025-11-01T00:00:00Z",
    submissionCount: 1,
  },
];
