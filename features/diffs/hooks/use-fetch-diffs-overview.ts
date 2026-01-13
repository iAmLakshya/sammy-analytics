import { useQuery } from "@tanstack/react-query"

import type { DiffsOverviewResponse } from "../types"

const fetchDiffsOverview = async (): Promise<DiffsOverviewResponse> => {
  const response = await fetch("/api/diffs/overview")
  if (!response.ok) {
    throw new Error("Failed to fetch diffs overview")
  }
  return response.json()
}

export const useFetchDiffsOverview = () => {
  return useQuery({
    queryKey: ["diffs", "overview"],
    queryFn: fetchDiffsOverview,
    staleTime: 60 * 1000,
  })
}
