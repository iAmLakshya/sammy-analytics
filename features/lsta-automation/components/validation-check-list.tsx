"use client";

import { IconCheck, IconDownload, IconLoader2, IconX } from "@tabler/icons-react";
import type { ValidationCheck } from "../types";

interface ValidationCheckListProps {
  checks: ValidationCheck[];
  className?: string;
}

interface CheckItemProps {
  check: ValidationCheck;
}

const PassedCheck = ({ check }: CheckItemProps) => {
  const { title, value, downloadLink } = check;

  return (
    <div className="flex items-center gap-1.5">
      <IconCheck className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
      <span className="text-muted-foreground">{title}</span>
      {value && (
        <>
          {downloadLink ? (
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-muted-foreground/30 underline-offset-2 hover:decoration-foreground"
            >
              {value}
              <IconDownload className="size-3" />
            </a>
          ) : (
            <span className="font-medium text-foreground">{value}</span>
          )}
        </>
      )}
    </div>
  );
};

const PendingCheck = ({ check }: CheckItemProps) => {
  const { title, description } = check;

  return (
    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
      <IconLoader2 className="size-3 shrink-0 animate-spin" />
      <span>{title}</span>
      <span className="text-muted-foreground">{description || "Checking..."}</span>
    </div>
  );
};

const FailedCheck = ({ check }: CheckItemProps) => {
  const { title, value, expected, actual } = check;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <IconX className="size-3 shrink-0 text-rose-600 dark:text-rose-400" strokeWidth={2.5} />
        <span className="text-rose-600 dark:text-rose-400">{title}</span>
        {value && !expected && !actual && (
          <span className="font-medium text-rose-600 line-through dark:text-rose-400">{value}</span>
        )}
      </div>
      {expected && actual && (
        <div className="ml-4.5 flex flex-col gap-0.5 text-muted-foreground">
          <span>Expected: <span className="text-foreground">{expected}</span></span>
          <span>Got: <span className="text-rose-600 dark:text-rose-400">{actual}</span></span>
        </div>
      )}
    </div>
  );
};

export const ValidationCheckList = ({ checks, className }: ValidationCheckListProps) => {
  if (checks.length === 0) return null;

  return (
    <div className={`flex flex-col gap-1.5 text-xs ${className ?? ""}`}>
      {checks.map((check) => {
        switch (check.status) {
          case "passed":
            return <PassedCheck key={check.key} check={check} />;
          case "pending":
            return <PendingCheck key={check.key} check={check} />;
          case "failed":
            return <FailedCheck key={check.key} check={check} />;
        }
      })}
    </div>
  );
};
