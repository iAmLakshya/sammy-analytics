export type TaskStatus =
  | "pending"
  | "completed"
  | "processing"
  | "failed"
  | "rejected"
  | "retrying"
  | "not-ready"
  | "review-required";

export type StepStatus =
  | "pending"
  | "failed"
  | "completed"
  | "not-ready"
  | "review-required";

export type ValidationCheckStatus = "passed" | "pending" | "failed" | "waiting";

export type ProcessAction =
  | "start"
  | "complete-step"
  | "fail"
  | "complete"
  | "not-ready"
  | "review-required"
  | "approve"
  | "reject";

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
  elsterUrl?: string;
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
  rejected: number;
  retrying: number;
  notReady: number;
  reviewRequired: number;
}

export interface LstaTaskListMetadata {
  totalCount: number;
  countByStatus: CountByStatus;
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

export interface DemoUploadResponse {
  batchId: string;
  taskIds: string[];
  taskCount: number;
}

export type DemoProcessResponse = LstaTask;

export interface LstaTaskListRequest {
  batchId?: string;
  page?: number;
  size?: number;
}

export interface DemoProcessRequest {
  taskId: string;
  action: ProcessAction;
  failureStep?: string;
}

export interface DemoUploadRequest {
  csvContent: string;
  batchName: string;
}

export interface TaskFilters {
  searchQuery: string;
  specialCase: boolean | null;
  submitted: boolean | null;
  statuses: TaskStatus[];
}

export type PipelineStep =
  | "payroll-download"
  | "data-extraction"
  | "tax-submission"
  | "document-upload";

export const PIPELINE_STEPS: readonly PipelineStep[] = [
  "payroll-download",
  "data-extraction",
  "tax-submission",
  "document-upload",
] as const;

export const STEP_LABELS: Record<PipelineStep, string> = {
  "payroll-download": "Download LSTA",
  "data-extraction": "Extract & Map",
  "tax-submission": "Submit to ELSTER",
  "document-upload": "Upload to Personio",
};

export interface StepDefinition {
  step: PipelineStep;
  title: string;
  description: string;
  statusDescription: string;
}

export const STEP_DEFINITIONS: Record<PipelineStep, StepDefinition> = {
  "payroll-download": {
    step: "payroll-download",
    title: "Download LSTA",
    description: "Download payroll data from LSTA system",
    statusDescription: "Downloading LSTA file",
  },
  "data-extraction": {
    step: "data-extraction",
    title: "Extract & Map",
    description: "Extract and map data fields",
    statusDescription: "Extracting and mapping data",
  },
  "tax-submission": {
    step: "tax-submission",
    title: "Submit to ELSTER",
    description: "Submit tax data to ELSTER portal",
    statusDescription: "Submitting to ELSTER",
  },
  "document-upload": {
    step: "document-upload",
    title: "Upload to Personio",
    description: "Upload documents to Personio system",
    statusDescription: "Uploading to Personio",
  },
};
