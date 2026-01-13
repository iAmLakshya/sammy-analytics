"use client"

import { IconPencil, IconUsers } from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { UserCorrections } from "../types"

interface UserCorrectionsCardProps {
  data: UserCorrections
  isLoading?: boolean
}

export const UserCorrectionsCard = ({ data, isLoading }: UserCorrectionsCardProps) => {
  if (isLoading) {
    return <UserCorrectionsCardSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Corrections</CardTitle>
        <CardDescription>
          When users provide their own corrections vs just rejecting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                <IconPencil className="size-4 text-blue-700 dark:text-blue-400" />
              </div>
              <span className="text-xs text-muted-foreground">Total Corrections</span>
            </div>
            <div className="text-2xl font-semibold tabular-nums">
              {data.total_user_corrections.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {data.correction_rate_percentage}% of reviewed
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                <IconUsers className="size-4 text-amber-700 dark:text-amber-400" />
              </div>
              <span className="text-xs text-muted-foreground">Unique Correctors</span>
            </div>
            <div className="text-2xl font-semibold tabular-nums">
              {data.unique_correctors}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Active users</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const UserCorrectionsCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
