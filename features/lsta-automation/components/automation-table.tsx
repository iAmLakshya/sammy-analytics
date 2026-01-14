"use client";

import { IconEye } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AutomationTask, AutomationStatus } from "../types";

const mockTasks: AutomationTask[] = [
  {
    id: "task-1",
    name: "Process Q4 Financial Reports",
    status: "running",
    steps: [],
    totalSteps: 8,
    completedSteps: 5,
    startedAt: "2025-01-14T09:23:00Z",
    completedAt: null,
  },
  {
    id: "task-2",
    name: "Sync Customer Database Records",
    status: "completed",
    steps: [],
    totalSteps: 12,
    completedSteps: 12,
    startedAt: "2025-01-14T08:45:00Z",
    completedAt: "2025-01-14T08:52:00Z",
  },
  {
    id: "task-3",
    name: "Generate Monthly Analytics Summary",
    status: "completed",
    steps: [],
    totalSteps: 6,
    completedSteps: 6,
    startedAt: "2025-01-14T07:30:00Z",
    completedAt: "2025-01-14T07:34:00Z",
  },
  {
    id: "task-4",
    name: "Update Product Catalog Index",
    status: "failed",
    steps: [],
    totalSteps: 4,
    completedSteps: 2,
    startedAt: "2025-01-14T06:15:00Z",
    completedAt: "2025-01-14T06:18:00Z",
  },
  {
    id: "task-5",
    name: "Archive Legacy User Sessions",
    status: "pending",
    steps: [],
    totalSteps: 10,
    completedSteps: 0,
    startedAt: "2025-01-14T10:00:00Z",
    completedAt: null,
  },
  {
    id: "task-6",
    name: "Validate API Response Schemas",
    status: "completed",
    steps: [],
    totalSteps: 15,
    completedSteps: 15,
    startedAt: "2025-01-13T22:00:00Z",
    completedAt: "2025-01-13T22:08:00Z",
  },
];

const statusConfig: Record<AutomationStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  running: {
    label: "Running",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
};

const formatDuration = (startedAt: string, completedAt: string | null): string => {
  const start = new Date(startedAt);
  const end = completedAt ? new Date(completedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s`;
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return `${mins}m ${secs}s`;
};

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const AutomationTable = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTasks.map((task) => {
              const status = statusConfig[task.status];
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <Badge className={status.className}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {task.completedSteps}/{task.totalSteps}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTime(task.startedAt)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatDuration(task.startedAt, task.completedAt)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <IconEye className="size-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Showing 6 of 1,247 tasks
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
