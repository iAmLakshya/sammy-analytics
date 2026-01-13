"use client"

import { useMemo } from "react"
import { IconAlertTriangle, IconFileText } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { DocumentActivity } from "../types"

interface DocumentsAttentionTableProps {
  data: DocumentActivity[]
  isLoading?: boolean
}

export const DocumentsAttentionTable = ({
  data,
  isLoading,
}: DocumentsAttentionTableProps) => {
  const totalPending = useMemo(() => {
    return data.reduce((acc, d) => acc + d.pending_conflicts, 0)
  }, [data])

  const highPriorityDocs = useMemo(() => {
    return data.filter((d) => d.pending_conflicts > 100).length
  }, [data])

  if (isLoading) {
    return <DocumentsAttentionTableSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconFileText className="h-5 w-5" />
          Documents Requiring Attention
        </CardTitle>
        <CardDescription>
          Top documents by conflict count - prioritize these for review
        </CardDescription>
        <CardAction>
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
          >
            <IconAlertTriangle className="mr-1 h-3 w-3" />
            {highPriorityDocs} high priority
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">Document</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-right">Accepted</TableHead>
                <TableHead className="text-right">Rejected</TableHead>
                <TableHead>Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((doc) => {
                const resolutionRate = Math.round(
                  ((doc.accepted_conflicts + doc.rejected_conflicts) /
                    doc.total_conflicts) *
                    100
                )
                const acceptanceRate = Math.round(
                  (doc.accepted_conflicts /
                    (doc.accepted_conflicts + doc.rejected_conflicts)) *
                    100
                )
                const isPriority = doc.pending_conflicts > 100

                return (
                  <TableRow key={doc.flow_id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              {isPriority && (
                                <IconAlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                              )}
                              <span className="line-clamp-1 font-medium">
                                {doc.document_title}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{doc.document_title}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.analysis_runs} analysis runs
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {doc.total_conflicts.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <Badge
                        variant={isPriority ? "destructive" : "secondary"}
                        className="tabular-nums"
                      >
                        {doc.pending_conflicts.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {doc.accepted_conflicts.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {doc.rejected_conflicts.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${resolutionRate}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {resolutionRate}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Showing {data.length} documents
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Total Pending:</span>
            <span className="font-medium tabular-nums">
              {totalPending.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const DocumentsAttentionTableSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="mt-2 h-4 w-80" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-6 w-[300px]" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
