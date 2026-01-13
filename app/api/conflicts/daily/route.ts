import { NextResponse } from "next/server"

import { dailyConflicts } from "@/features/conflicts/data/mock.conflicts.data"
import type { DailyConflictsResponse } from "@/features/conflicts/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: DailyConflictsResponse = {
    data: dailyConflicts,
  }

  return NextResponse.json(response)
}
