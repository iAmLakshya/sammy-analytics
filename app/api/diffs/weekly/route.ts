import { NextResponse } from "next/server"

import { weeklyDiffs } from "@/features/diffs/data/mock.diffs.data"
import type { WeeklyDiffsResponse } from "@/features/diffs/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: WeeklyDiffsResponse = {
    data: weeklyDiffs,
  }

  return NextResponse.json(response)
}
