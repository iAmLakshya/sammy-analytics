import type { CsvRow } from "@/features/lsta-automation/utils/csv-parser";
import type { LstaTask, LstaTaskStep } from "@/features/lsta-automation/types";
import type { ServiceError } from "@/shared/utils/server/errors";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";
import { uploadedBatches } from "../../store";

interface CreateDemoBatchParams {
  rows: CsvRow[];
}

interface CreateDemoBatchResponse {
  batchId: string;
  taskIds: string[];
  taskCount: number;
}

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

const createPendingStep = (stepId: string): LstaTaskStep => ({
  step: stepId,
  title: STEP_DEFINITIONS[stepId].title,
  description: STEP_DEFINITIONS[stepId].description,
  statusDescription: null,
  data: {},
  errorReasons: [],
  validationChecks: [],
  status: "pending",
  startedAt: null,
  endedAt: null,
});

let taskIdCounter = 1000;

const generateTaskId = (): string => {
  taskIdCounter += 1;
  return `demo-task-${taskIdCounter}`;
};

export const createDemoBatch =
  (_dependencies: CoreDependencies) =>
  async (
    params: CreateDemoBatchParams
  ): Promise<CreateDemoBatchResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const batchId = `batch-${Date.now()}`;
    const batchName = new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    const now = new Date().toISOString();

    const tasks: LstaTask[] = params.rows.map((row) => {
      const taskId = generateTaskId();
      return {
        id: taskId,
        organisationId: "demo-org",
        companyId: row.companyId,
        leId: row.leId,
        certificate: row.certificate,
        specialCase: row.specialCase,
        submitted: row.submitted,
        status: "pending",
        statusDescription: null,
        batch: { id: batchId, name: batchName },
        steps: [
          createPendingStep("payroll-download"),
          createPendingStep("data-extraction"),
          createPendingStep("tax-submission"),
          createPendingStep("document-upload"),
        ],
        createdAt: now,
        updatedAt: now,
      };
    });

    uploadedBatches.set(batchId, {
      id: batchId,
      name: batchName,
      tasks,
    });

    return {
      batchId,
      taskIds: tasks.map((t) => t.id),
      taskCount: tasks.length,
    };
  };
