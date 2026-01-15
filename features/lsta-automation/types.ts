export type TaskStatus =
  | "pending"
  | "completed"
  | "processing"
  | "failed"
  | "retrying";

export type StepStatus = "pending" | "failed" | "completed";

export type ValidationCheckStatus = "passed" | "pending" | "failed";

export interface ValidationCheck {
  key: string;
  title: string;
  value: string | null;
  expected: string | null;
  actual: string | null;
  description: string | null;
  downloadLink: string | null;
  status: ValidationCheckStatus;
}

export interface LstaTaskStep {
  step: string;
  title: string;
  description: string;
  statusDescription: string | null;
  data: Record<string, unknown>;
  errorReasons: string[];
  validationChecks: ValidationCheck[];
  status: StepStatus;
  startedAt: string | null;
  endedAt: string | null;
}

export interface LstaTaskBatch {
  id: string;
  name: string;
}

export interface LstaTask {
  id: string;
  organisationId: string;
  companyId: string;
  leId: string;
  certificate: string | null;
  specialCase: boolean;
  submitted: boolean;
  status: TaskStatus;
  statusDescription: string | null;
  batch: LstaTaskBatch;
  steps: LstaTaskStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CountByStatus {
  pending: number;
  completed: number;
  processing: number;
  failed: number;
  retrying: number;
}

export interface LstaTaskListMetadata {
  totalCount: number;
  countByStatus: CountByStatus;
}

export interface LstaTaskListResponse {
  metadata: LstaTaskListMetadata;
  tasks: LstaTask[];
  page: number;
  size: number;
  totalPages: number;
}

export type LstaTaskDetailResponse = LstaTask;

export interface LstaTaskRetryResponse {
  success: boolean;
  task: LstaTask;
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

export type PeriodType = "monthly" | "quarterly" | "yearly";

export interface SubmissionFilters {
  statuses: SubmissionStatus[];
  periodTypes: PeriodType[];
  isSpecialCase: boolean | null;
  searchQuery: string;
}

export interface TaskFilters {
  searchQuery: string;
  specialCase: boolean | null;
  submitted: boolean | null;
  statuses: TaskStatus[];
}
