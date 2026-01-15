"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  IconClipboardList,
  IconLoader2,
  IconUpload,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDemoController } from "../hooks/use-demo-controller";
import { useFetchLstaTasks } from "../hooks/use-fetch-lsta-tasks";
import { useRetryLstaTask } from "../hooks/use-retry-lsta-task";
import { useUploadDemoCsv } from "../hooks/use-upload-demo-csv";
import type { Batch, LstaTask, TaskFilters } from "../types";
import { exportTasksToCsv } from "../utils/export-tasks";
import { AutomationKpiCards } from "./automation-kpi-cards";
import { AutomationTable } from "./automation-table";
import { BatchTabs } from "./batch-tabs";
import { CsvUploadDialog } from "./csv-upload-dialog";
import { DemoControls } from "./demo-controls";
import { EmptyState } from "./empty-state";
import { TaskFilterBar } from "./task-filter-bar";

const DEFAULT_FILTERS: TaskFilters = {
  searchQuery: "",
  specialCase: null,
  submitted: null,
  statuses: [],
};

const filterTasks = (tasks: LstaTask[], filters: TaskFilters): LstaTask[] => {
  return tasks.filter((task) => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        task.companyId.toLowerCase().includes(query) ||
        task.leId.toLowerCase().includes(query) ||
        (task.certificate?.toLowerCase().includes(query) ?? false);
      if (!matchesSearch) return false;
    }

    if (
      filters.specialCase !== null &&
      task.specialCase !== filters.specialCase
    ) {
      return false;
    }

    if (filters.submitted !== null && task.submitted !== filters.submitted) {
      return false;
    }

    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(task.status)
    ) {
      return false;
    }

    return true;
  });
};

export const LstaAutomationContent = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [pendingAutoStart, setPendingAutoStart] = useState<{
    batchId: string;
    taskIds: string[];
  } | null>(null);
  const [pendingBatchName, setPendingBatchName] = useState<string | null>(null);

  const { data, isLoading, error } = useFetchLstaTasks({
    batchId: activeBatchId,
    page,
    size: 20,
  });

  const {
    mutate: retryTaskMutation,
    isPending: isRetrying,
    variables: retryingTaskId,
  } = useRetryLstaTask();

  const { isRunning, totalTasks, completedTasks, startDemo } =
    useDemoController();

  const handleRetryTask = (taskId: string) => {
    retryTaskMutation(taskId, {
      onSuccess: () => {
        if (activeBatchId) {
          setTimeout(() => {
            startDemo(activeBatchId, [taskId]);
          }, 300);
        }
      },
    });
  };

  const { uploadCsv, isUploading } = useUploadDemoCsv({
    onSuccess: (result) => {
      setShowUploadDialog(false);
      const newBatch: Batch = {
        id: result.batchId,
        name: pendingBatchName ?? "Untitled Batch",
        dateRange: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        submissionCount: result.taskCount,
      };
      setBatches((prev) => [...prev, newBatch]);
      setActiveBatchId(result.batchId);
      setPendingAutoStart({ batchId: result.batchId, taskIds: result.taskIds });
      setPendingBatchName(null);
    },
  });

  const handleUploadCsv = (csvContent: string, batchName: string) => {
    setPendingBatchName(batchName);
    uploadCsv(csvContent);
  };

  const autoStartTriggered = useRef(false);
  useEffect(() => {
    if (pendingAutoStart && !autoStartTriggered.current && !isLoading) {
      autoStartTriggered.current = true;
      startDemo(pendingAutoStart.batchId, pendingAutoStart.taskIds);
      setPendingAutoStart(null);
    }
  }, [pendingAutoStart, isLoading, startDemo]);

  const failedTaskCount = useMemo(() => {
    if (!data?.tasks) return 0;
    return data.tasks.filter((t) => t.status === "failed").length;
  }, [data?.tasks]);

  const filteredTasks = useMemo(() => {
    if (!data?.tasks) return [];
    return filterTasks(data.tasks, filters);
  }, [data?.tasks, filters]);

  const handleBatchChange = (batchId: string | null) => {
    setActiveBatchId(batchId);
    setPage(1);
    setFilters(DEFAULT_FILTERS);
  };

  const handleExport = () => {
    exportTasksToCsv(filteredTasks);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <p className="text-sm text-muted-foreground">Failed to load tasks</p>
        <p className="text-xs text-destructive">{error.message}</p>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="mx-4 lg:mx-6">
          <EmptyState
            icon={IconClipboardList}
            title="Welcome to LSTA Automation"
            description="This is your command center for tracking loan submissions. Upload your CSV file to begin processing. You'll see real-time status updates for each submission, including progress tracking and detailed validation results."
            action={
              <Button onClick={() => setShowUploadDialog(true)}>
                <IconUpload className="mr-2 size-4" />
                Upload CSV
              </Button>
            }
          />
        </div>
        <CsvUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onUpload={handleUploadCsv}
          isUploading={isUploading}
        />
      </div>
    );
  }

  const showControls =
    isRunning || (totalTasks > 0 && completedTasks === totalTasks);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <BatchTabs
          batches={batches}
          activeBatchId={activeBatchId}
          totalSubmissions={data?.metadata.totalCount ?? 0}
          onBatchChange={handleBatchChange}
          onAddBatch={() => setShowUploadDialog(true)}
        />
        {isLoading ? (
          <div className="flex h-16 items-center justify-center">
            <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <AutomationKpiCards
            countByStatus={data.metadata.countByStatus}
            totalCount={data.metadata.totalCount}
          />
        ) : null}
      </div>
      <Card className="mx-4 gap-0 overflow-hidden py-0 lg:mx-6">
        {data && (
          <div className="flex items-center justify-between border-b px-4 py-3">
            {showControls ? (
              <DemoControls
                isRunning={isRunning}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                failedCount={failedTaskCount}
              />
            ) : (
              <div />
            )}
            <TaskFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              onExport={handleExport}
            />
          </div>
        )}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <AutomationTable
            tasks={filteredTasks}
            onRetry={handleRetryTask}
            retryingTaskId={isRetrying ? retryingTaskId : null}
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        ) : null}
      </Card>
      <CsvUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleUploadCsv}
        isUploading={isUploading}
      />
    </div>
  );
};
