"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconLoader2, IconUpload } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";

const getMonthSuggestions = (): string[] => {
  const now = new Date();
  const format = (date: Date) =>
    date.toLocaleString("en-US", { month: "long", year: "numeric" });

  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return [format(prevMonth), format(currMonth), format(nextMonth)];
};

interface CsvUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (csvContent: string, batchName: string) => void;
  isUploading: boolean;
}

export const CsvUploadDialog = ({
  open,
  onOpenChange,
  onUpload,
  isUploading,
}: CsvUploadDialogProps) => {
  const [batchName, setBatchName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestions = useMemo(() => getMonthSuggestions(), []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file || !batchName.trim()) return;

    const content = await file.text();
    onUpload(content, batchName.trim());
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setBatchName("");
      setFile(null);
      setIsDragging(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Upload Demo CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with task data to start the demo processing flow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="batch-name">Batch Name</Label>
            <Input
              id="batch-name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="e.g., January 2026"
            />
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setBatchName(suggestion)}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-xs transition-colors",
                    batchName === suggestion
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <motion.div
            onClick={handleZoneClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ willChange: "transform, border-color" }}
            animate={{
              scale: isDragging ? 1.02 : 1,
              borderColor: isDragging
                ? "hsl(var(--primary))"
                : "hsl(var(--border))",
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              isDragging && "bg-primary/5"
            )}
          >
            <IconUpload className="mb-3 size-8 text-muted-foreground" />
            {file ? (
              <div className="text-center">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click or drop to replace
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium">
                  Drag and drop CSV file or click to browse
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Only .csv files are accepted
                </p>
              </div>
            )}
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!file || !batchName.trim() || isUploading}
          >
            {isUploading ? (
              <>
                <IconLoader2 className="mr-2 size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <IconUpload className="mr-2 size-4" />
                Upload & Process
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
