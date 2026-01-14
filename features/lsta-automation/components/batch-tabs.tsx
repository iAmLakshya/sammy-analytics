"use client";

import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Batch } from "../types";

interface BatchTabsProps {
  batches: Batch[];
  activeBatchId: string | null;
  totalSubmissions: number;
  onBatchChange: (batchId: string | null) => void;
  onAddBatch: () => void;
}

export const BatchTabs = ({
  batches,
  activeBatchId,
  totalSubmissions,
  onBatchChange,
  onAddBatch,
}: BatchTabsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Tabs
        value={activeBatchId ?? "all"}
        onValueChange={(value) =>
          onBatchChange(value === "all" ? null : value)
        }
      >
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all" className="gap-1.5">
            All
            <span className="text-muted-foreground text-xs">
              {totalSubmissions}
            </span>
          </TabsTrigger>
          {batches.map((batch) => (
            <TabsTrigger key={batch.id} value={batch.id} className="gap-1.5">
              {batch.name}
              <span className="text-muted-foreground text-xs">
                {batch.submissionCount}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Button
        variant="outline"
        size="sm"
        onClick={onAddBatch}
        className="h-9 gap-1"
      >
        <IconPlus className="size-4" />
      </Button>
    </div>
  );
};
