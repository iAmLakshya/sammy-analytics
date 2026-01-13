import { NextResponse } from "next/server"

import { dailyReviewActivity } from "@/features/team/data/mock.team.data"
import type { ReviewActivityResponse } from "@/features/team/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: ReviewActivityResponse = {
    data: dailyReviewActivity,
  }

  return NextResponse.json(response)
}
