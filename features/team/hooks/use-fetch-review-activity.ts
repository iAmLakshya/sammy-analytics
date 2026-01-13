import { useQuery } from "@tanstack/react-query"

import type { ReviewActivityResponse } from "../types"

const fetchReviewActivity = async (): Promise<ReviewActivityResponse> => {
  const response = await fetch("/api/team/activity")
  if (!response.ok) {
    throw new Error("Failed to fetch review activity")
  }
  return response.json()
}

export const useFetchReviewActivity = () => {
  return useQuery({
    queryKey: ["team", "activity"],
    queryFn: fetchReviewActivity,
    staleTime: 60 * 1000,
  })
}
