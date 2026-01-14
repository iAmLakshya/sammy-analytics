"use client";

import { IconEye, IconRefresh } from "@tabler/icons-react";
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
import { mockSubmissions } from "../data/mock.submissions.data";
import { StepProgressIndicator } from "./step-progress-indicator";

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

const periodTypeLabels: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company / Entity</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubmissions.map((submission) => {
              const status = statusConfig[submission.status];
              const isNeedsReview = submission.status === "needs-review";
              const isRetrying = submission.status === "retrying";

              return (
                <TableRow
                  key={submission.id}
                  className={
                    isNeedsReview ? "bg-rose-50/50 dark:bg-rose-950/20" : ""
                  }
                >
                  <TableCell>
                    <div className="font-medium">{submission.companyName}</div>
                    <div className="text-sm text-muted-foreground">
                      {submission.legalEntityName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{submission.period}</span>
                      <Badge variant="outline" className="text-xs">
                        {periodTypeLabels[submission.periodType]}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StepProgressIndicator
                      steps={submission.steps}
                      currentStep={submission.currentStep}
                    />
                  </TableCell>
                  <TableCell>
                    {isRetrying && submission.nextRetryAt ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={status.className}>
                            {status.label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Next retry:{" "}
                            {formatRelativeTime(submission.nextRetryAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              submission.nextRetryAt
                            ).toLocaleString()}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge className={status.className}>{status.label}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <IconEye className="size-4" />
                        View
                      </Button>
                      {isNeedsReview && (
                        <Button variant="ghost" size="sm">
                          <IconRefresh className="size-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
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
