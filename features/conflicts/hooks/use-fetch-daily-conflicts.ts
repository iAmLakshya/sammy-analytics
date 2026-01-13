import { useQuery } from "@tanstack/react-query"

import type { DailyConflictsResponse } from "../types"

const fetchDailyConflicts = async (): Promise<DailyConflictsResponse> => {
  const response = await fetch("/api/conflicts/daily")
  if (!response.ok) {
    throw new Error("Failed to fetch daily conflicts")
  }
  return response.json()
}

export const useFetchDailyConflicts = () => {
  return useQuery({
    queryKey: ["conflicts", "daily"],
    queryFn: fetchDailyConflicts,
    staleTime: 60 * 1000,
  })
}
