"use client"

import { IconCheck, IconX } from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { TimeToReview } from "../types"

interface TimeToReviewCardProps {
  data: TimeToReview[]
  isLoading?: boolean
}

export const TimeToReviewCard = ({ data, isLoading }: TimeToReviewCardProps) => {
  if (isLoading) {
    return <TimeToReviewCardSkeleton />
  }

  const accepted = data.find((d) => d.disposition === "ACCEPTED")
  const rejected = data.find((d) => d.disposition === "REJECTED")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time to Review</CardTitle>
        <CardDescription>
          How long conflicts wait before being reviewed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accepted && (
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                  <IconCheck className="size-4 text-emerald-700 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Accepted Conflicts</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {accepted.count.toLocaleString()} total
                </span>
              </div>
              <div className="text-2xl font-semibold tabular-nums">
                {accepted.avg_hours_to_review}h
                <span className="ml-1 text-sm font-normal text-muted-foreground">avg</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Median: {accepted.median_hours}h • Min: {accepted.min_hours}h • Max: {accepted.max_hours}h
              </div>
            </div>
          )}
          {rejected && (
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40">
                  <IconX className="size-4 text-rose-700 dark:text-rose-400" />
                </div>
                <span className="text-sm font-medium">Rejected Conflicts</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {rejected.count.toLocaleString()} total
                </span>
              </div>
              <div className="text-2xl font-semibold tabular-nums">
                {rejected.avg_hours_to_review}h
                <span className="ml-1 text-sm font-normal text-muted-foreground">avg</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Median: {rejected.median_hours}h • Min: {rejected.min_hours}h • Max: {rejected.max_hours}h
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const TimeToReviewCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
