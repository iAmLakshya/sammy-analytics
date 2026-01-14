"use client";

import { useState } from "react";
import {
  IconChevronRight,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
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
import type { Submission, SubmissionStatus } from "../types";
import { mockSubmissions } from "../data/mock.tasks.data";
import { StepProgressIndicator } from "./step-progress-indicator";
import { ExpandableRowContent } from "./expandable-row-content";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  queued: {
    label: "Queued",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
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
  "needs-review": {
    label: "Needs Review",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  retrying: {
    label: "Retrying",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
};

const sortSubmissions = (submissions: Submission[]): Submission[] => {
  const priority: Record<SubmissionStatus, number> = {
    "needs-review": 0,
    processing: 1,
    retrying: 2,
    queued: 3,
    completed: 4,
  };
  return [...submissions].sort(
    (a, b) => priority[a.status] - priority[b.status]
  );
};

const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 0) return "overdue";
  if (diffHours < 24) return `in ${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  return `in ${diffDays}d`;
};

interface AutomationTableProps {
  submissions?: Submission[];
}

export const AutomationTable = ({
  submissions = mockSubmissions,
}: AutomationTableProps) => {
  const sortedSubmissions = sortSubmissions(submissions);
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

  const handleRetry = () => {};

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
            {sortedSubmissions.map((submission) => {
              const status = statusConfig[submission.status];
              const isRetrying = submission.status === "retrying";
              const isExpanded = expandedIds.has(submission.id);
              const needsReview = submission.status === "needs-review";

              return (
                <AnimatePresence key={submission.id} initial={false}>
                  <TableRow
                    onClick={() => toggleExpand(submission.id)}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      needsReview ? "bg-rose-50/50 dark:bg-rose-950/20" : ""
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
                      {submission.companyId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono">
                      {submission.legalEntityId}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {submission.certificate ? (
                        <span>{submission.certificate}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-center md:table-cell">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex">
                            {submission.isSpecialCase ? (
                              <IconCheck className="mx-auto size-4 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <IconX className="mx-auto size-4 text-muted-foreground" />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {submission.isSpecialCase ? "Special case" : "Sammy submitted"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center">
                      {submission.isSubmittedAndUploaded ? (
                        <IconCheck className="mx-auto size-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <IconX className="mx-auto size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <StepProgressIndicator
                        steps={submission.steps}
                        currentStep={submission.currentStep}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {isRetrying && submission.nextRetryAt ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={status.className}>{status.label}</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Next retry: {formatRelativeTime(submission.nextRetryAt)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(submission.nextRetryAt).toLocaleString()}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge className={status.className}>{status.label}</Badge>
                      )}
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
                            submission={submission}
                            onRetry={handleRetry}
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
          Showing {sortedSubmissions.length} submissions
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
