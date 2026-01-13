import { useQuery } from "@tanstack/react-query"

import type { ConflictActivityResponse } from "../types"

const fetchConflictActivity = async (): Promise<ConflictActivityResponse> => {
  const response = await fetch("/api/conflicts/activity")
  if (!response.ok) {
    throw new Error("Failed to fetch conflict activity")
  }
  return response.json()
}

export const useFetchConflictActivity = () => {
  return useQuery({
    queryKey: ["conflicts", "activity"],
    queryFn: fetchConflictActivity,
    staleTime: 60 * 1000,
  })
}
