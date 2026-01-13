import { useQuery } from "@tanstack/react-query"

import type { TeamOverviewResponse } from "../types"

const fetchTeamOverview = async (): Promise<TeamOverviewResponse> => {
  const response = await fetch("/api/team/overview")
  if (!response.ok) {
    throw new Error("Failed to fetch team overview")
  }
  return response.json()
}

export const useFetchTeamOverview = () => {
  return useQuery({
    queryKey: ["team", "overview"],
    queryFn: fetchTeamOverview,
    staleTime: 60 * 1000,
  })
}
