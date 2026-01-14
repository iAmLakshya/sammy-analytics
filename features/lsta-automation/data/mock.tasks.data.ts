import type { CountByStatus, LstaKpiMetrics, LstaTask } from "../types";

const STEP_DEFINITIONS: Record<string, { title: string; description: string }> =
  {
    "payroll-download": {
      title: "Download LSTA",
      description: "Download payroll data from LSTA system",
    },
    "data-extraction": {
      title: "Extract & Map",
      description: "Extract and map data fields",
    },
    "tax-submission": {
      title: "Submit to ELSTER",
      description: "Submit tax data to ELSTER portal",
    },
    "document-upload": {
      title: "Upload to Personio",
      description: "Upload documents to Personio system",
    },
  };

const createStep = (
  stepId: string,
  status: "pending" | "failed" | "completed",
  options: {
    statusDescription?: string;
    data?: Record<string, unknown>;
    errorReasons?: string[];
    startedAt?: string;
    endedAt?: string;
  } = {}
) => ({
  step: stepId,
  title: STEP_DEFINITIONS[stepId].title,
  description: STEP_DEFINITIONS[stepId].description,
  statusDescription: options.statusDescription ?? null,
  data: options.data ?? {},
  errorReasons: options.errorReasons ?? [],
  status,
  startedAt: options.startedAt ?? null,
  endedAt: options.endedAt ?? null,
});

export const mockLstaTasks: LstaTask[] = [
  {
    id: "task-001",
    organisationId: "ORG-001",
    companyId: "COMP-001",
    leId: "LE-001",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: true,
    status: "completed",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 156 },
        startedAt: "2026-01-14T08:00:00Z",
        endedAt: "2026-01-14T08:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions"],
          recordsProcessed: 156,
        },
        startedAt: "2026-01-14T08:02:00Z",
        endedAt: "2026-01-14T08:04:00Z",
      }),
      createStep("tax-submission", "completed", {
        data: { confirmationNumber: "TAX-2026-48291", documentId: "DOC-73829" },
        startedAt: "2026-01-14T08:04:00Z",
        endedAt: "2026-01-14T08:08:00Z",
      }),
      createStep("document-upload", "completed", {
        data: { documentId: "DOC-73830" },
        startedAt: "2026-01-14T08:08:00Z",
        endedAt: "2026-01-14T08:09:00Z",
      }),
    ],
    createdAt: "2026-01-14T08:00:00Z",
    updatedAt: "2026-01-14T08:09:00Z",
  },
  {
    id: "task-002",
    organisationId: "ORG-001",
    companyId: "COMP-002",
    leId: "LE-002",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: true,
    status: "completed",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 89 },
        startedAt: "2026-01-14T07:30:00Z",
        endedAt: "2026-01-14T07:32:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions", "socialSecurity"],
          recordsProcessed: 89,
        },
        startedAt: "2026-01-14T07:32:00Z",
        endedAt: "2026-01-14T07:34:00Z",
      }),
      createStep("tax-submission", "completed", {
        data: { confirmationNumber: "TAX-2026-31472", documentId: "DOC-61924" },
        startedAt: "2026-01-14T07:34:00Z",
        endedAt: "2026-01-14T07:38:00Z",
      }),
      createStep("document-upload", "completed", {
        data: { documentId: "DOC-61925" },
        startedAt: "2026-01-14T07:38:00Z",
        endedAt: "2026-01-14T07:39:00Z",
      }),
    ],
    createdAt: "2026-01-14T07:30:00Z",
    updatedAt: "2026-01-14T07:39:00Z",
  },
  {
    id: "task-003",
    organisationId: "ORG-001",
    companyId: "COMP-003",
    leId: "LE-003",
    certificate: "Q4 Wage Report",
    specialCase: false,
    submitted: true,
    status: "completed",
    statusDescription: null,
    batch: { id: "batch-002", name: "Q4 2025 Quarterly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_q4_2025.csv", recordsProcessed: 468 },
        startedAt: "2026-01-13T22:00:00Z",
        endedAt: "2026-01-13T22:03:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions", "bonuses"],
          recordsProcessed: 468,
        },
        startedAt: "2026-01-13T22:03:00Z",
        endedAt: "2026-01-13T22:06:00Z",
      }),
      createStep("tax-submission", "completed", {
        data: {
          confirmationNumber: "TAX-2025-Q4-7821",
          documentId: "DOC-82910",
        },
        startedAt: "2026-01-13T22:06:00Z",
        endedAt: "2026-01-13T22:12:00Z",
      }),
      createStep("document-upload", "completed", {
        data: { documentId: "DOC-82911" },
        startedAt: "2026-01-13T22:12:00Z",
        endedAt: "2026-01-13T22:13:00Z",
      }),
    ],
    createdAt: "2026-01-13T22:00:00Z",
    updatedAt: "2026-01-13T22:13:00Z",
  },
  {
    id: "task-004",
    organisationId: "ORG-001",
    companyId: "COMP-004",
    leId: "LE-004",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "processing",
    statusDescription: "Submitting tax data to ELSTER portal...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 234 },
        startedAt: "2026-01-14T09:00:00Z",
        endedAt: "2026-01-14T09:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions"],
          recordsProcessed: 234,
        },
        startedAt: "2026-01-14T09:02:00Z",
        endedAt: "2026-01-14T09:04:00Z",
      }),
      createStep("tax-submission", "pending", {
        statusDescription: "Connecting to ELSTER portal...",
        startedAt: "2026-01-14T09:04:00Z",
      }),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T09:00:00Z",
    updatedAt: "2026-01-14T09:04:30Z",
  },
  {
    id: "task-005",
    organisationId: "ORG-002",
    companyId: "COMP-005",
    leId: "LE-005",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: true,
    submitted: false,
    status: "processing",
    statusDescription: "Extracting and mapping payroll fields...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 67 },
        startedAt: "2026-01-14T09:10:00Z",
        endedAt: "2026-01-14T09:12:00Z",
      }),
      createStep("data-extraction", "pending", {
        statusDescription: "Processing 67 employee records...",
        startedAt: "2026-01-14T09:12:00Z",
      }),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T09:10:00Z",
    updatedAt: "2026-01-14T09:12:30Z",
  },
  {
    id: "task-006",
    organisationId: "ORG-002",
    companyId: "COMP-006",
    leId: "LE-006",
    certificate: null,
    specialCase: true,
    submitted: false,
    status: "processing",
    statusDescription: "Downloading payroll data from LSTA...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "pending", {
        statusDescription: "Authenticating with LSTA system...",
        startedAt: "2026-01-14T09:15:00Z",
      }),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T09:15:00Z",
    updatedAt: "2026-01-14T09:15:15Z",
  },
  {
    id: "task-007",
    organisationId: "ORG-001",
    companyId: "COMP-007",
    leId: "LE-007",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "failed",
    statusDescription: "Tax submission failed after 3 attempts",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 112 },
        startedAt: "2026-01-14T06:00:00Z",
        endedAt: "2026-01-14T06:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions"],
          recordsProcessed: 112,
        },
        startedAt: "2026-01-14T06:02:00Z",
        endedAt: "2026-01-14T06:04:00Z",
      }),
      createStep("tax-submission", "failed", {
        errorReasons: [
          "ELSTER portal returned error code 503",
          "Service temporarily unavailable",
          "Retry limit exceeded",
        ],
        startedAt: "2026-01-14T06:04:00Z",
        endedAt: "2026-01-14T06:15:00Z",
      }),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T06:00:00Z",
    updatedAt: "2026-01-14T06:15:00Z",
  },
  {
    id: "task-008",
    organisationId: "ORG-002",
    companyId: "COMP-008",
    leId: "LE-008",
    certificate: null,
    specialCase: true,
    submitted: false,
    status: "failed",
    statusDescription: "Data extraction failed - invalid format",
    batch: { id: "batch-002", name: "Q4 2025 Quarterly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_q4_2025.csv", recordsProcessed: 345 },
        startedAt: "2026-01-13T14:00:00Z",
        endedAt: "2026-01-13T14:03:00Z",
      }),
      createStep("data-extraction", "failed", {
        errorReasons: [
          "Legal entity name doesn't match records",
          "Missing required field: socialSecurityNumber",
          "Data validation failed for 12 records",
        ],
        startedAt: "2026-01-13T14:03:00Z",
        endedAt: "2026-01-13T14:05:00Z",
      }),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-13T14:00:00Z",
    updatedAt: "2026-01-13T14:05:00Z",
  },
  {
    id: "task-009",
    organisationId: "ORG-001",
    companyId: "COMP-009",
    leId: "LE-009",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "pending",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "pending"),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T10:00:00Z",
    updatedAt: "2026-01-14T10:00:00Z",
  },
  {
    id: "task-010",
    organisationId: "ORG-002",
    companyId: "COMP-010",
    leId: "LE-010",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "pending",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "pending"),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T10:05:00Z",
    updatedAt: "2026-01-14T10:05:00Z",
  },
  {
    id: "task-011",
    organisationId: "ORG-001",
    companyId: "COMP-011",
    leId: "LE-011",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "retrying",
    statusDescription: "Retrying tax submission (attempt 2 of 3)...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 78 },
        startedAt: "2026-01-14T05:00:00Z",
        endedAt: "2026-01-14T05:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions"],
          recordsProcessed: 78,
        },
        startedAt: "2026-01-14T05:02:00Z",
        endedAt: "2026-01-14T05:04:00Z",
      }),
      createStep("tax-submission", "pending", {
        statusDescription: "Waiting for retry window...",
        startedAt: "2026-01-14T05:04:00Z",
      }),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T05:00:00Z",
    updatedAt: "2026-01-14T05:20:00Z",
  },
  {
    id: "task-012",
    organisationId: "ORG-002",
    companyId: "COMP-012",
    leId: "LE-012",
    certificate: null,
    specialCase: true,
    submitted: false,
    status: "retrying",
    statusDescription: "Retrying data extraction with corrected mapping...",
    batch: { id: "batch-002", name: "Q4 2025 Quarterly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_q4_2025.csv", recordsProcessed: 201 },
        startedAt: "2026-01-13T16:00:00Z",
        endedAt: "2026-01-13T16:03:00Z",
      }),
      createStep("data-extraction", "pending", {
        statusDescription: "Re-processing with updated field mapping...",
        startedAt: "2026-01-13T18:00:00Z",
      }),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-13T16:00:00Z",
    updatedAt: "2026-01-13T18:05:00Z",
  },
];

export const computeCountByStatus = (tasks: LstaTask[]): CountByStatus => {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status]++;
      return acc;
    },
    { pending: 0, completed: 0, processing: 0, failed: 0, retrying: 0 }
  );
};

export const mockKpiMetrics: LstaKpiMetrics = {
  totalSubmissions: 847,
  completionRate: 94.2,
  avgProcessingTime: 6.4,

  queuedCount: 12,
  processingCount: 3,
  completedCount: 798,
  needsReviewCount: 8,
  retryingCount: 26,

  completionRateTrend: [92.1, 93.4, 91.8, 94.5, 95.2, 93.8, 94.2],
  submissionVolumeTrend: [112, 98, 134, 121, 108, 145, 129],

  periodStats: [
    { period: "December 2025", total: 156, completed: 148, failed: 8 },
    { period: "Q4 2025", total: 42, completed: 41, failed: 1 },
    { period: "2025 Annual", total: 12, completed: 11, failed: 1 },
  ],
};
