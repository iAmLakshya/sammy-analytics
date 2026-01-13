import { NextResponse } from "next/server"

import {
  dispositionSummary,
  timeToReview,
  userCorrections,
  priorityBreakdown,
  pendingAging,
} from "@/features/conflicts/data/mock.conflicts.data"
import type { ConflictsOverviewResponse } from "@/features/conflicts/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 200))

  const response: ConflictsOverviewResponse = {
    dispositionSummary,
    timeToReview,
    userCorrections,
    priorityBreakdown,
    pendingAging,
  }

  return NextResponse.json(response)
}
