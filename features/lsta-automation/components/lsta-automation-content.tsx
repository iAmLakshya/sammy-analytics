"use client";

import { useState, useMemo } from "react";
import { AutomationKpiCards } from "./automation-kpi-cards";
import { AutomationTable } from "./automation-table";
import { BatchTabs } from "./batch-tabs";
import { AddBatchDialog } from "./add-batch-dialog";
import { mockBatches } from "../data/mock.batches.data";
import { mockSubmissions } from "../data/mock.submissions.data";
import type { Batch } from "../types";

export const LstaAutomationContent = () => {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredSubmissions = useMemo(() => {
    if (!activeBatchId) return mockSubmissions;
    return mockSubmissions.filter((s) => s.batchId === activeBatchId);
  }, [activeBatchId]);

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

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="px-4 lg:px-6">
        <BatchTabs
          batches={batches}
          activeBatchId={activeBatchId}
          totalSubmissions={mockSubmissions.length}
          onBatchChange={setActiveBatchId}
          onAddBatch={() => setShowAddDialog(true)}
        />
      </div>
      <AutomationKpiCards />
      <div className="space-y-4 px-4 lg:px-6">
        <AutomationTable submissions={filteredSubmissions} />
      </div>
      <AddBatchDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddBatch={handleAddBatch}
      />
    </div>
  );
};
