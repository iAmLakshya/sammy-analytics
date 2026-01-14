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

export interface StepResult {
  step: PipelineStep;
  status: "completed" | "failed" | "skipped" | "pending";
  completedAt: string | null;
  errorMessage: string | null;
}

export interface Submission {
  id: string;
  companyName: string;
  legalEntityName: string;
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
