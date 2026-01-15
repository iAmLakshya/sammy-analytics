import type { StepStatus, TaskStatus } from "../types";

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  processing: {
    label: "Processing",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 animate-pulse",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  retrying: {
    label: "Retrying",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  "not-ready": {
    label: "Not Ready",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  "review-required": {
    label: "Needs Review",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  },
};

export const STATUS_FILTER_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "not-ready", label: "Not Ready" },
  { value: "review-required", label: "Needs Review" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "rejected", label: "Rejected" },
  { value: "retrying", label: "Retrying" },
];

interface StepStatusColors {
  bg: string;
  bgSelected: string;
  text: string;
  border: string;
  connector: string;
}

export const STEP_STATUS_COLORS: Record<StepStatus | "in-progress", StepStatusColors> = {
  completed: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    bgSelected: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500",
    connector: "bg-emerald-300 dark:bg-emerald-700",
  },
  failed: {
    bg: "bg-rose-100 dark:bg-rose-900/40",
    bgSelected: "bg-rose-50 dark:bg-rose-950/50",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-500",
    connector: "bg-muted",
  },
  "not-ready": {
    bg: "bg-amber-100 dark:bg-amber-900/40",
    bgSelected: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500",
    connector: "bg-amber-300 dark:bg-amber-700",
  },
  "review-required": {
    bg: "bg-purple-100 dark:bg-purple-900/40",
    bgSelected: "bg-purple-50 dark:bg-purple-950/50",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-500",
    connector: "bg-purple-300 dark:bg-purple-700",
  },
  pending: {
    bg: "bg-muted",
    bgSelected: "bg-muted",
    text: "text-muted-foreground",
    border: "border-muted-foreground/30",
    connector: "bg-muted",
  },
  "in-progress": {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    bgSelected: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-amber-500",
    connector: "bg-muted",
  },
};
