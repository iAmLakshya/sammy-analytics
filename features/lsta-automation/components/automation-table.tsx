"use client";

import { useState } from "react";
import { IconChevronRight, IconCheck, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LstaTask, TaskStatus } from "../types";
import { StepProgressIndicator } from "./step-progress-indicator";
import { ExpandableRowContent } from "./expandable-row-content";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 animate-pulse",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  retrying: {
    label: "Retrying",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
};

const sortTasks = (tasks: LstaTask[]): LstaTask[] => {
  const priority: Record<TaskStatus, number> = {
    failed: 0,
    processing: 1,
    retrying: 2,
    pending: 3,
    completed: 4,
  };
  return [...tasks].sort((a, b) => priority[a.status] - priority[b.status]);
};

const getCurrentStepId = (task: LstaTask): string | null => {
  if (task.status === "processing") {
    const activeStep = task.steps.find((s) => s.status === "pending" && s.startedAt);
    return activeStep?.step ?? null;
  }
  return null;
};

interface AutomationTableProps {
  tasks: LstaTask[];
  onRetry?: (taskId: string) => void;
  retryingTaskId?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AutomationTable = ({
  tasks,
  onRetry,
  retryingTaskId,
  page,
  totalPages,
  onPageChange,
}: AutomationTableProps) => {
  const sortedTasks = sortTasks(tasks);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Company ID</TableHead>
              <TableHead>LE ID</TableHead>
              <TableHead className="hidden md:table-cell">Certificate</TableHead>
              <TableHead className="hidden text-center md:table-cell">
                Special Case
              </TableHead>
              <TableHead className="text-center">Submitted</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => {
              const config = statusConfig[task.status];
              const isExpanded = expandedIds.has(task.id);
              const isFailed = task.status === "failed";
              const currentStepId = getCurrentStepId(task);

              return (
                <AnimatePresence key={task.id} initial={false}>
                  <TableRow
                    onClick={() => toggleExpand(task.id)}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      isFailed ? "bg-rose-50/50 dark:bg-rose-950/20" : ""
                    } ${isExpanded ? "bg-muted/30" : ""}`}
                  >
                    <TableCell className="w-10 pr-0">
                      <IconChevronRight
                        className={`size-4 text-muted-foreground transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono">
                      {task.companyId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono">
                      {task.leId}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {task.certificate ? (
                        <span>{task.certificate}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-center md:table-cell">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex">
                            {task.specialCase ? (
                              <IconCheck className="mx-auto size-4 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <IconX className="mx-auto size-4 text-muted-foreground" />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {task.specialCase ? "Special case" : "Standard submission"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center">
                      {task.submitted ? (
                        <IconCheck className="mx-auto size-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <IconX className="mx-auto size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <StepProgressIndicator steps={task.steps} currentStepId={currentStepId} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={config.className}>{config.label}</Badge>
                        </TooltipTrigger>
                        {task.statusDescription && (
                          <TooltipContent>
                            <p>{task.statusDescription}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="border-b bg-muted/20 p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          style={{ willChange: "height, opacity" }}
                          className="overflow-hidden"
                        >
                          <ExpandableRowContent
                            task={task}
                            onRetry={onRetry}
                            isRetrying={retryingTaskId === task.id}
                          />
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Showing {sortedTasks.length} tasks
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
