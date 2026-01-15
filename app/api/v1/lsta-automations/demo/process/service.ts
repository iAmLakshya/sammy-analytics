import { uploadedBatches } from "../../store";
import {
  generateEnrichedData,
  getFailureReason,
  generateFailedValidationChecks,
  generateNotReadyValidationChecks,
  generateReviewRequiredValidationChecks,
} from "@/features/lsta-automation/utils/demo-task-processor";
import type { LstaTask, LstaTaskStep, ProcessAction, ValidationCheck } from "@/features/lsta-automation/types";
import type { ServiceError, NotFoundError } from "@/shared/utils/server/errors";
import type { CoreDependencies } from "@/shared/utils/server/wrap-route-handler";

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
  for (const batch of uploadedBatches.values()) {
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
  enrichedData: { companyName: string; sumCheck: string; taxIdLast4: string }
): ValidationCheck[] => {
  const targetMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const pdfFileName = `lsta_${leId.toLowerCase()}.pdf`;

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
        key: "target-month",
        title: "Target Month",
        value: targetMonth,
        expected: null,
        actual: null,
        description: "Target reporting period for this submission",
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
      {
        key: "le-number-consistent",
        title: "LE Number",
        value: leId,
        expected: null,
        actual: null,
        description: "Legal entity identifier matches across systems",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "no-manual-wage-tax",
        title: "Manual Wage Tax",
        value: "None found",
        expected: null,
        actual: null,
        description: "No manual wage tax document conflicts detected",
        downloadLink: null,
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
        description: "Legal entity name extracted correctly from payroll data",
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
        key: "le-number-consistent",
        title: "LE Number",
        value: leId,
        expected: null,
        actual: null,
        description: "Legal entity number consistent with submission",
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
        key: "downloaded-pdf",
        title: "Certificate PDF",
        value: pdfFileName,
        expected: null,
        actual: null,
        description: "Tax certificate downloaded from ELSTER",
        downloadLink: `/downloads/${pdfFileName}`,
        status: "passed",
      },
      {
        key: "no-existing-doc",
        title: "Existing Document",
        value: "None",
        expected: null,
        actual: null,
        description: "No duplicate submission detected",
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
        key: "sum-check",
        title: "Sum Check",
        value: enrichedData.sumCheck,
        expected: null,
        actual: null,
        description: "Document amounts match submission totals",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "uploaded-pdf",
        title: "Uploaded PDF",
        value: pdfFileName,
        expected: null,
        actual: null,
        description: "Certificate uploaded to Personio",
        downloadLink: `/downloads/${pdfFileName}`,
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

        for (let i = 0; i < failureStepIndex; i++) {
          const step = task.steps[i];
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

        if (failureStepIndex >= 0 && task.steps[failureStepIndex]) {
          const failedStep = task.steps[failureStepIndex];
          failedStep.status = "failed";
          failedStep.endedAt = now;
          failedStep.errorReasons = [getFailureReason(failureStepId)];
          failedStep.statusDescription = "Processing failed";
          failedStep.validationChecks = generateFailedValidationChecks(
            failureStepId,
            task.leId,
            enrichedData
          );
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

      case "not-ready": {
        const notReadyStepId = params.failureStep ?? "payroll-download";
        const notReadyStepIndex = STEP_IDS.indexOf(notReadyStepId);

        task.status = "not-ready";
        task.statusDescription = "Waiting for source data...";
        task.updatedAt = now;

        if (notReadyStepIndex >= 0 && task.steps[notReadyStepIndex]) {
          const notReadyStep = task.steps[notReadyStepIndex];
          notReadyStep.status = "not-ready";
          notReadyStep.endedAt = now;
          notReadyStep.statusDescription = "Waiting for source system";
          notReadyStep.validationChecks = generateNotReadyValidationChecks(
            notReadyStepId,
            task.leId
          );
        }
        break;
      }

      case "review-required": {
        const taxSubmissionIndex = STEP_IDS.indexOf("tax-submission");

        task.status = "review-required";
        task.statusDescription = "Awaiting human approval";
        task.updatedAt = now;

        for (let i = 0; i < taxSubmissionIndex; i++) {
          const step = task.steps[i];
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

        if (taxSubmissionIndex >= 0 && task.steps[taxSubmissionIndex]) {
          const taxStep = task.steps[taxSubmissionIndex];
          taxStep.status = "review-required";
          taxStep.endedAt = now;
          taxStep.statusDescription = "Awaiting human approval";
          taxStep.validationChecks = generateReviewRequiredValidationChecks(
            "tax-submission",
            task.leId,
            enrichedData
          );
          taxStep.elsterUrl = `https://elster.de/review/${task.leId.toLowerCase()}/${Date.now()}`;
        }
        break;
      }

      case "approve": {
        const taxSubmissionIndex = STEP_IDS.indexOf("tax-submission");

        if (taxSubmissionIndex >= 0 && task.steps[taxSubmissionIndex]) {
          const taxStep = task.steps[taxSubmissionIndex];
          taxStep.status = "completed";
          taxStep.endedAt = now;
          taxStep.statusDescription = null;
        }

        const documentUploadIndex = STEP_IDS.indexOf("document-upload");
        if (documentUploadIndex >= 0 && task.steps[documentUploadIndex]) {
          const docStep = task.steps[documentUploadIndex];
          docStep.status = "completed";
          docStep.endedAt = now;
          docStep.statusDescription = null;
          docStep.validationChecks = createValidationChecks(
            docStep.step,
            task.leId,
            enrichedData
          );
        }

        task.status = "completed";
        task.submitted = true;
        task.statusDescription = null;
        task.certificate = "Monthly Wage Tax Certificate";
        task.updatedAt = now;
        break;
      }

      case "reject": {
        const taxSubmissionIndex = STEP_IDS.indexOf("tax-submission");

        task.status = "rejected";
        task.statusDescription = "Rejected during human review";
        task.updatedAt = now;

        if (taxSubmissionIndex >= 0 && task.steps[taxSubmissionIndex]) {
          const taxStep = task.steps[taxSubmissionIndex];
          taxStep.status = "failed";
          taxStep.endedAt = now;
          taxStep.statusDescription = "Rejected by reviewer";
          taxStep.errorReasons = ["Submission rejected during human review"];
        }
        break;
      }
    }

    batch.tasks[taskIndex] = task;

    return { task };
  };
