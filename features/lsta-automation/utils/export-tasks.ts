import type { LstaTask, LstaTaskStep } from "../types";

const getValidationValue = (
  steps: LstaTaskStep[],
  stepId: string,
  checkKey: string
): string => {
  const step = steps.find((s) => s.step === stepId);
  if (!step) return "";
  const check = step.validationChecks.find((c) => c.key === checkKey);
  return check?.value ?? "";
};

const formatTimestamp = (isoString: string | null): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateProcessingTime = (steps: LstaTaskStep[]): string => {
  const firstStarted = steps.find((s) => s.startedAt)?.startedAt;
  const lastEnded = [...steps].reverse().find((s) => s.endedAt)?.endedAt;
  if (!firstStarted || !lastEnded) return "";

  const durationMs = new Date(lastEnded).getTime() - new Date(firstStarted).getTime();
  const seconds = Math.round(durationMs / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const exportTasksToCsv = (tasks: LstaTask[], filename?: string) => {
  const headers = [
    "Company ID",
    "LE ID",
    "Certificate",
    "Special Case",
    "Submitted",
    "Status",
    "Company Name",
    "Sum Check",
    "Tax ID Last 4",
    "Confirmation Number",
    "Processing Time",
    "Completed At",
    "Created At",
  ];

  const rows = tasks.map((task) => [
    task.companyId,
    task.leId,
    task.certificate ?? "",
    task.specialCase ? "Yes" : "No",
    task.submitted ? "Yes" : "No",
    task.status,
    getValidationValue(task.steps, "data-extraction", "le-name-consistent"),
    getValidationValue(task.steps, "tax-submission", "sum-check"),
    getValidationValue(task.steps, "tax-submission", "tax-id-consistent"),
    getValidationValue(task.steps, "tax-submission", "confirmation"),
    calculateProcessingTime(task.steps),
    formatTimestamp(task.steps.find((s) => s.step === "document-upload")?.endedAt ?? null),
    formatTimestamp(task.createdAt),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename ?? `lsta-tasks-enriched-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
