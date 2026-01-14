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
  {
    id: "batch-004",
    name: "October 2025",
    dateRange: {
      start: "2025-10-01T00:00:00Z",
      end: "2025-10-31T23:59:59Z",
    },
    createdAt: "2025-10-01T00:00:00Z",
    submissionCount: 156,
  },
  {
    id: "batch-005",
    name: "September 2025",
    dateRange: {
      start: "2025-09-01T00:00:00Z",
      end: "2025-09-30T23:59:59Z",
    },
    createdAt: "2025-09-01T00:00:00Z",
    submissionCount: 142,
  },
  {
    id: "batch-006",
    name: "Q3 2025",
    dateRange: {
      start: "2025-07-01T00:00:00Z",
      end: "2025-09-30T23:59:59Z",
    },
    createdAt: "2025-07-01T00:00:00Z",
    submissionCount: 45,
  },
  {
    id: "batch-007",
    name: "August 2025",
    dateRange: {
      start: "2025-08-01T00:00:00Z",
      end: "2025-08-31T23:59:59Z",
    },
    createdAt: "2025-08-01T00:00:00Z",
    submissionCount: 138,
  },
  {
    id: "batch-008",
    name: "July 2025",
    dateRange: {
      start: "2025-07-01T00:00:00Z",
      end: "2025-07-31T23:59:59Z",
    },
    createdAt: "2025-07-01T00:00:00Z",
    submissionCount: 129,
  },
  {
    id: "batch-009",
    name: "June 2025",
    dateRange: {
      start: "2025-06-01T00:00:00Z",
      end: "2025-06-30T23:59:59Z",
    },
    createdAt: "2025-06-01T00:00:00Z",
    submissionCount: 134,
  },
  {
    id: "batch-010",
    name: "Q2 2025",
    dateRange: {
      start: "2025-04-01T00:00:00Z",
      end: "2025-06-30T23:59:59Z",
    },
    createdAt: "2025-04-01T00:00:00Z",
    submissionCount: 42,
  },
];
