export type SubmissionStatus =
  | "queued"
  | "processing"
  | "completed"
  | "needs-review"
  | "retrying";

export type PipelineStep =
  | "payroll-download"
  | "data-extraction"
  | "tax-submission"
  | "document-upload";

export const STEP_LABELS: Record<PipelineStep, string> = {
  "payroll-download": "Download LSTA",
  "data-extraction": "Extract & Map",
  "tax-submission": "Submit to ELSTER",
  "document-upload": "Upload to Personio",
};

export interface StepOutput {
  recordsProcessed?: number;
  documentId?: string;
  confirmationNumber?: string;
  downloadedFile?: string;
  extractedFields?: string[];
  [key: string]: unknown;
}

export interface StepResult {
  step: PipelineStep;
  status: "completed" | "failed" | "skipped" | "pending";
  completedAt: string | null;
  errorMessage: string | null;
  output: StepOutput | null;
  activityDescription: string | null;
}

export interface Submission {
  id: string;
  companyId: string;
  legalEntityId: string;
  certificate: string | null;
  isSpecialCase: boolean;
  isSubmittedAndUploaded: boolean;
  period: string;
  periodType: "monthly" | "quarterly" | "yearly";
  status: SubmissionStatus;
  steps: StepResult[];
  currentStep: PipelineStep | null;
  startedAt: string;
  completedAt: string | null;
  nextRetryAt: string | null;
  retryCount: number;
  batchId: string | null;
}

export interface Batch {
  id: string;
  name: string;
  dateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
  submissionCount: number;
}

export interface LstaKpiMetrics {
  totalSubmissions: number;
  completionRate: number;
  avgProcessingTime: number;

  queuedCount: number;
  processingCount: number;
  completedCount: number;
  needsReviewCount: number;
  retryingCount: number;

  completionRateTrend: number[];
  submissionVolumeTrend: number[];

  periodStats: {
    period: string;
    total: number;
    completed: number;
    failed: number;
  }[];
}
