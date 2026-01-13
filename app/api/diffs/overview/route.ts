import { NextResponse } from "next/server"

import {
  stateDistribution,
  pendingDiffsBacklog,
  timeToResolution,
} from "@/features/diffs/data/mock.diffs.data"
import type { DiffsOverviewResponse } from "@/features/diffs/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 200))

  const response: DiffsOverviewResponse = {
    stateDistribution,
    backlog: pendingDiffsBacklog,
    timeToResolution,
  }

  return NextResponse.json(response)
}
