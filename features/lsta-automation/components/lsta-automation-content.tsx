"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconClipboardList, IconLoader2, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { mockBatches } from "../data/mock.batches.data";
import { useFetchLstaTasks } from "../hooks/use-fetch-lsta-tasks";
import { useRetryLstaTask } from "../hooks/use-retry-lsta-task";
import type { Batch, LstaTask, TaskFilters } from "../types";
import { exportTasksToCsv } from "../utils/export-tasks";
import { AddBatchDialog } from "./add-batch-dialog";
import { AutomationKpiCards } from "./automation-kpi-cards";
import { AutomationTable } from "./automation-table";
import { BatchTabs } from "./batch-tabs";
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

    if (filters.specialCase !== null && task.specialCase !== filters.specialCase) {
      return false;
    }

    if (filters.submitted !== null && task.submitted !== filters.submitted) {
      return false;
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
      return false;
    }

    return true;
  });
};

export const LstaAutomationContent = () => {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);

  const { data, isLoading, error } = useFetchLstaTasks({
    batchId: activeBatchId,
    page,
    size: 20,
  });

  const {
    mutate: retryTask,
    isPending: isRetrying,
    variables: retryingTaskId,
  } = useRetryLstaTask();

  const filteredTasks = useMemo(() => {
    if (!data?.tasks) return [];
    return filterTasks(data.tasks, filters);
  }, [data?.tasks, filters]);

  const handleAddBatch = (
    batchData: Omit<Batch, "id" | "createdAt" | "submissionCount">
  ) => {
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissionCount: 0,
    };
    setBatches((prev) => [...prev, newBatch]);
  };

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
        <Card className="mx-4 lg:mx-6">
          <EmptyState
            icon={IconClipboardList}
            title="Welcome to LSTA Automation"
            description="This is your command center for tracking loan submissions. Once you create your first batch, you'll see real-time status updates for each submission, including progress tracking and detailed validation results."
            action={
              <Button onClick={() => setShowAddDialog(true)}>
                <IconPlus className="mr-2 size-4" />
                Create Your First Batch
              </Button>
            }
          />
        </Card>
        <AddBatchDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddBatch={handleAddBatch}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <BatchTabs
          batches={batches}
          activeBatchId={activeBatchId}
          totalSubmissions={data?.metadata.totalCount ?? 0}
          onBatchChange={handleBatchChange}
          onAddBatch={() => setShowAddDialog(true)}
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
          <div className="border-b px-4 py-3">
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
            onRetry={retryTask}
            retryingTaskId={isRetrying ? retryingTaskId : null}
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        ) : null}
      </Card>
      <AddBatchDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddBatch={handleAddBatch}
      />
    </div>
  );
};
