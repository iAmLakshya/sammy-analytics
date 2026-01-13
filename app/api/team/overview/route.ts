import { NextResponse } from "next/server"

import {
  teamOverview,
  reviewers,
  weekdayActivity,
  userCorrections,
  documentsNeedingAttention,
} from "@/features/team/data/mock.team.data"
import type { TeamOverviewResponse } from "@/features/team/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 200))

  const response: TeamOverviewResponse = {
    overview: teamOverview,
    reviewers,
    weekdayActivity,
    corrections: userCorrections,
    documentsNeedingAttention,
  }

  return NextResponse.json(response)
}
