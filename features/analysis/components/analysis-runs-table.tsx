"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DailyAnalysisRuns } from "../types";

interface AnalysisRunsTableProps {
  data: DailyAnalysisRuns[];
  isLoading?: boolean;
}

export const AnalysisRunsTable = ({
  data,
  isLoading,
}: AnalysisRunsTableProps) => {
  if (isLoading) {
    return <AnalysisRunsTableSkeleton />;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDetectionRateBadge = (runs: DailyAnalysisRuns) => {
    const rate = (runs.runs_with_conflicts / runs.total_runs) * 100;
    if (rate >= 70) {
      return (
        <Badge variant="default" className="ml-2 font-normal">
          {rate.toFixed(0)}%
        </Badge>
      );
    }
    if (rate >= 50) {
      return (
        <Badge variant="secondary" className="ml-2 font-normal">
          {rate.toFixed(0)}%
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="ml-2 font-normal">
        {rate.toFixed(0)}%
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conflict Detection Metrics</CardTitle>
        <CardDescription>
          Daily breakdown of analysis effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total Runs</TableHead>
              <TableHead className="text-right">With Conflicts</TableHead>
              <TableHead className="text-right">Detected</TableHead>
              <TableHead className="text-right">Avg/Run</TableHead>
              <TableHead className="text-right">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.date}>
                <TableCell className="font-medium">
                  {formatDate(row.date)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.total_runs.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.runs_with_conflicts.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.conflicts_detected.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.avg_conflicts_per_run.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {getDetectionRateBadge(row)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const AnalysisRunsTableSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
