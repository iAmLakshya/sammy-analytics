import { NextResponse } from "next/server"

import { reviewActivity } from "@/features/conflicts/data/mock.conflicts.data"
import type { ConflictActivityResponse } from "@/features/conflicts/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: ConflictActivityResponse = {
    data: reviewActivity,
  }

  return NextResponse.json(response)
}
