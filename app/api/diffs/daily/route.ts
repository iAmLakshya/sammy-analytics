import { NextResponse } from "next/server"

import { dailyDiffs } from "@/features/diffs/data/mock.diffs.data"
import type { DailyDiffsResponse } from "@/features/diffs/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: DailyDiffsResponse = {
    data: dailyDiffs,
  }

  return NextResponse.json(response)
}
