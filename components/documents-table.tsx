"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DocumentData = {
  title: string;
  analysisRuns: number;
  totalConflicts: number;
  pendingConflicts: number;
  acceptedConflicts: number;
  rejectedConflicts: number;
};

const documentsData: DocumentData[] = [
  {
    title: "End of year: Important dates and EOY guidance",
    analysisRuns: 378,
    totalConflicts: 921,
    pendingConflicts: 356,
    acceptedConflicts: 423,
    rejectedConflicts: 142,
  },
  {
    title: "Check your company's Secretary of State status",
    analysisRuns: 102,
    totalConflicts: 618,
    pendingConflicts: 234,
    acceptedConflicts: 289,
    rejectedConflicts: 95,
  },
  {
    title: "Dismiss and rehire US employees (for admins)",
    analysisRuns: 182,
    totalConflicts: 540,
    pendingConflicts: 198,
    acceptedConflicts: 256,
    rejectedConflicts: 86,
  },
  {
    title: "Dismiss and rehire employees",
    analysisRuns: 122,
    totalConflicts: 400,
    pendingConflicts: 145,
    acceptedConflicts: 189,
    rejectedConflicts: 66,
  },
  {
    title: "Run a dismissal payroll",
    analysisRuns: 112,
    totalConflicts: 384,
    pendingConflicts: 142,
    acceptedConflicts: 178,
    rejectedConflicts: 64,
  },
];

// Resolution progress bar component
const ResolutionProgress = ({ doc }: { doc: DocumentData }) => {
  const resolved = doc.acceptedConflicts + doc.rejectedConflicts;
  const total = doc.totalConflicts;
  const resolvedPercent = (resolved / total) * 100;
  const acceptedPercent = (doc.acceptedConflicts / total) * 100;
  const rejectedPercent = (doc.rejectedConflicts / total) * 100;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-400"
              style={{ width: `${acceptedPercent}%` }}
            />
            <div
              className="h-full bg-rose-500 dark:bg-rose-400"
              style={{ width: `${rejectedPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-10">
            {resolvedPercent.toFixed(0)}%
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-emerald-500">Approved:</span>
            <span className="tabular-nums">
              {doc.acceptedConflicts} ({acceptedPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-rose-500">Declined:</span>
            <span className="tabular-nums">
              {doc.rejectedConflicts} ({rejectedPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex justify-between gap-4 border-t pt-1 mt-1">
            <span className="text-amber-500">Still pending:</span>
            <span className="tabular-nums">
              {doc.pendingConflicts} ({(100 - resolvedPercent).toFixed(1)}%)
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const DocumentsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Documents Needing Attention
          <InfoTooltip content="Your busiest documents with the most issues. Prioritize documents with many pending items and low completion rates." />
        </CardTitle>
        <CardDescription>
          Top documents by issue volume in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead className="text-right">Scans</TableHead>
              <TableHead className="text-right">Issues</TableHead>
              <TableHead className="text-right">Pending</TableHead>
              <TableHead>Completion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentsData.map((doc) => {
              const pendingPercent =
                (doc.pendingConflicts / doc.totalConflicts) * 100;
              const isHighPending = pendingPercent > 40;

              return (
                <TableRow key={doc.title}>
                  <TableCell className="max-w-[300px] truncate font-medium">
                    {doc.title}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {doc.analysisRuns}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {doc.totalConflicts.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={`tabular-nums ${isHighPending ? "text-destructive border-destructive/30" : "text-warning-foreground"}`}
                    >
                      {doc.pendingConflicts}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ResolutionProgress doc={doc} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
