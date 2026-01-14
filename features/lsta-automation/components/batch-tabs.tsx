"use client";

import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { Batch } from "../types";

interface BatchTabsProps {
  batches: Batch[];
  activeBatchId: string | null;
  totalSubmissions: number;
  onBatchChange: (batchId: string | null) => void;
  onAddBatch: () => void;
}

interface TabItemProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  count: number;
}

const TabItem = ({ isActive, onClick, label, count }: TabItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative px-4 py-2.5 text-sm transition-colors ${
      isActive
        ? "font-semibold text-foreground"
        : "font-medium text-muted-foreground hover:text-foreground"
    }`}
  >
    <span className="flex items-center gap-1.5">
      {label}
      <span
        className={`tabular-nums ${
          isActive ? "text-muted-foreground" : "text-muted-foreground/70"
        }`}
      >
        {count}
      </span>
    </span>
    {isActive && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
    )}
  </button>
);

export const BatchTabs = ({
  batches,
  activeBatchId,
  totalSubmissions,
  onBatchChange,
  onAddBatch,
}: BatchTabsProps) => {
  return (
    <div className="flex items-center border-b">
      <div className="flex items-center">
        <TabItem
          isActive={activeBatchId === null}
          onClick={() => onBatchChange(null)}
          label="All"
          count={totalSubmissions}
        />
        {batches.map((batch) => (
          <TabItem
            key={batch.id}
            isActive={activeBatchId === batch.id}
            onClick={() => onBatchChange(batch.id)}
            label={batch.name}
            count={batch.submissionCount}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddBatch}
        className="ml-1 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
      >
        <IconPlus className="size-4" />
      </Button>
    </div>
  );
};
