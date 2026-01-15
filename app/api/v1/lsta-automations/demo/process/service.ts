import { demoBatches } from "../upload/service";
import {
  generateEnrichedData,
  getFailureReason,
} from "@/features/lsta-automation/utils/demo-task-processor";
import type { LstaTask, LstaTaskStep, ValidationCheck } from "@/features/lsta-automation/types";
import type { ServiceError, NotFoundError } from "@/shared/utils/server/errors";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

type ProcessAction = "start" | "complete-step" | "fail" | "complete";

interface ProcessTaskParams {
  taskId: string;
  action: ProcessAction;
  failureStep?: string;
}

interface ProcessTaskResponse {
  task: LstaTask;
}

const STEP_IDS = [
  "payroll-download",
  "data-extraction",
  "tax-submission",
  "document-upload",
];

const findTaskById = (
  taskId: string
): { batch: { id: string; name: string; tasks: LstaTask[] }; task: LstaTask; taskIndex: number } | null => {
  for (const batch of demoBatches.values()) {
    const taskIndex = batch.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      return { batch, task: batch.tasks[taskIndex], taskIndex };
    }
  }
  return null;
};

const getCurrentStepIndex = (steps: LstaTaskStep[]): number => {
  const pendingIndex = steps.findIndex((s) => s.status === "pending");
  if (pendingIndex === -1) return steps.length;
  const lastCompletedIndex = steps.findLastIndex((s) => s.status === "completed");
  return lastCompletedIndex + 1;
};

const createValidationChecks = (
  stepId: string,
  leId: string,
  enrichedData: { companyName: string; sumCheck: string; taxIdLast4: string; confirmationNumber: string }
): ValidationCheck[] => {
  const baseChecks: Record<string, ValidationCheck[]> = {
    "payroll-download": [
      {
        key: "status-accepted",
        title: "Status",
        value: "Accepted",
        expected: null,
        actual: null,
        description: "Payroll submission status from Personio",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "lsta-file-found",
        title: "LSTA File",
        value: `payroll_${leId.toLowerCase()}.csv`,
        expected: null,
        actual: null,
        description: "Source payroll file from LSTA system",
        downloadLink: `/downloads/payroll_${leId.toLowerCase()}.csv`,
        status: "passed",
      },
    ],
    "data-extraction": [
      {
        key: "le-name-consistent",
        title: "LE Name",
        value: enrichedData.companyName,
        expected: null,
        actual: null,
        description: "Legal entity name extracted correctly",
        downloadLink: null,
        status: "passed",
      },
    ],
    "tax-submission": [
      {
        key: "full-name",
        title: "Full Name",
        value: enrichedData.companyName,
        expected: null,
        actual: null,
        description: "Legal entity full name for ELSTER submission",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "tax-id-consistent",
        title: "Tax ID",
        value: `****${enrichedData.taxIdLast4}`,
        expected: null,
        actual: null,
        description: "Tax identification number matches records",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "sum-check",
        title: "Sum Check",
        value: enrichedData.sumCheck,
        expected: null,
        actual: null,
        description: "Total wage sum matches calculated amount",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "confirmation",
        title: "Confirmation Number",
        value: enrichedData.confirmationNumber,
        expected: null,
        actual: null,
        description: "ELSTER submission confirmation",
        downloadLink: null,
        status: "passed",
      },
    ],
    "document-upload": [
      {
        key: "le-number-consistent",
        title: "LE Number",
        value: leId,
        expected: null,
        actual: null,
        description: "Legal entity number matches upload destination",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "uploaded-pdf",
        title: "Uploaded PDF",
        value: `lsta_${leId.toLowerCase()}.pdf`,
        expected: null,
        actual: null,
        description: "Certificate uploaded to Personio",
        downloadLink: `/downloads/lsta_${leId.toLowerCase()}.pdf`,
        status: "passed",
      },
    ],
  };

  return baseChecks[stepId] ?? [];
};

export const processTask =
  (_dependencies: CoreDependencies) =>
  async (params: ProcessTaskParams): Promise<ProcessTaskResponse | ServiceError> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const found = findTaskById(params.taskId);
    if (!found) {
      return {
        statusCode: 404,
        message: "Task not found",
        toResponse: () => new Response("Task not found", { status: 404 }),
      } as unknown as NotFoundError;
    }

    const { batch, task, taskIndex } = found;
    const now = new Date().toISOString();

    const enrichedData = generateEnrichedData({
      companyId: task.companyId,
      leId: task.leId,
      certificate: task.certificate,
      specialCase: task.specialCase,
      submitted: task.submitted,
    });

    switch (params.action) {
      case "start": {
        task.status = "processing";
        task.statusDescription = "Starting automation...";
        task.updatedAt = now;
        for (const step of task.steps) {
          step.status = "pending";
          step.startedAt = null;
          step.endedAt = null;
          step.statusDescription = null;
          step.errorReasons = [];
          step.validationChecks = [];
        }
        if (task.steps[0]) {
          task.steps[0].startedAt = now;
          task.steps[0].statusDescription = "Initiating payroll download...";
        }
        break;
      }

      case "complete-step": {
        const currentStepIndex = getCurrentStepIndex(task.steps);
        if (currentStepIndex < task.steps.length) {
          const currentStep = task.steps[currentStepIndex];
          currentStep.status = "completed";
          currentStep.endedAt = now;
          currentStep.statusDescription = null;
          currentStep.validationChecks = createValidationChecks(
            currentStep.step,
            task.leId,
            enrichedData
          );

          if (currentStepIndex + 1 < task.steps.length) {
            const nextStep = task.steps[currentStepIndex + 1];
            nextStep.status = "pending";
            nextStep.startedAt = now;
            nextStep.statusDescription = `Processing ${nextStep.title}...`;
            task.statusDescription = `Processing ${nextStep.title}...`;
          }
        }
        task.updatedAt = now;
        break;
      }

      case "fail": {
        const failureStepId = params.failureStep ?? "tax-submission";
        const failureStepIndex = STEP_IDS.indexOf(failureStepId);

        task.status = "failed";
        task.statusDescription = `Failed at ${task.steps[failureStepIndex]?.title ?? "processing"}`;
        task.updatedAt = now;

        if (failureStepIndex >= 0 && task.steps[failureStepIndex]) {
          const failedStep = task.steps[failureStepIndex];
          failedStep.status = "failed";
          failedStep.endedAt = now;
          failedStep.errorReasons = [getFailureReason(failureStepId)];
          failedStep.statusDescription = "Processing failed";
        }
        break;
      }

      case "complete": {
        task.status = "completed";
        task.submitted = true;
        task.statusDescription = null;
        task.updatedAt = now;
        task.certificate = "Monthly Wage Tax Certificate";

        for (const step of task.steps) {
          if (step.status !== "completed") {
            step.status = "completed";
            step.endedAt = now;
            step.statusDescription = null;
            step.validationChecks = createValidationChecks(
              step.step,
              task.leId,
              enrichedData
            );
          }
        }
        break;
      }
    }

    batch.tasks[taskIndex] = task;

    return { task };
  };
