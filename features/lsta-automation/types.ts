export type AutomationStatus = "pending" | "running" | "completed" | "failed";

export interface AutomationStep {
  id: string;
  name: string;
  status: AutomationStatus;
  duration: number | null;
  error: string | null;
}

export interface AutomationTask {
  id: string;
  name: string;
  status: AutomationStatus;
  steps: AutomationStep[];
  totalSteps: number;
  completedSteps: number;
  startedAt: string;
  completedAt: string | null;
}

export interface AutomationKpiData {
  totalTasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
}
