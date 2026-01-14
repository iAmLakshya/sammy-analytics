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

import { mockSubmissions } from "../data/mock.submissions.data";
import type { PipelineStep, SubmissionStatus } from "../types";

const statusConfig: Record<SubmissionStatus, { label: string; className: string }> = {
  queued: {
    label: "Queued",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  "needs-review": {
    label: "Needs Review",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  retrying: {
    label: "Retrying",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
};

const stepLabels: Record<PipelineStep, string> = {
  "payroll-download": "Payroll Download",
  "data-extraction": "Data Extraction",
  "tax-submission": "Tax Submission",
  "document-upload": "Document Upload",
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
              <TableHead>Company</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Step</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSubmissions.map((submission) => {
              const status = statusConfig[submission.status];
              const completedSteps = submission.steps.filter(s => s.status === "completed").length;
              return (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="font-medium">{submission.companyName}</div>
                    <div className="text-sm text-muted-foreground">{submission.legalEntityName}</div>
                  </TableCell>
                  <TableCell>
                    <div>{submission.period}</div>
                    <div className="text-sm text-muted-foreground capitalize">{submission.periodType}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={status.className}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    {submission.currentStep ? (
                      <span className="text-sm">{stepLabels[submission.currentStep]}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {completedSteps}/4 steps
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTime(submission.startedAt)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatDuration(submission.startedAt, submission.completedAt)}
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
          Showing 6 of 847 submissions
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
