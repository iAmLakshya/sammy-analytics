import { useQuery } from "@tanstack/react-query"

import type { DailyDiffsResponse } from "../types"

const fetchDailyDiffs = async (): Promise<DailyDiffsResponse> => {
  const response = await fetch("/api/diffs/daily")
  if (!response.ok) {
    throw new Error("Failed to fetch daily diffs")
  }
  return response.json()
}

export const useFetchDailyDiffs = () => {
  return useQuery({
    queryKey: ["diffs", "daily"],
    queryFn: fetchDailyDiffs,
    staleTime: 60 * 1000,
  })
}
