"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  Submission,
  SubmissionFilters,
  SubmissionStatus,
  PeriodType,
} from "../types";

const DEFAULT_FILTERS: SubmissionFilters = {
  statuses: [],
  periodTypes: [],
  isSpecialCase: null,
  searchQuery: "",
};

export const useSubmissionFilters = () => {
  const [filters, setFilters] = useState<SubmissionFilters>(DEFAULT_FILTERS);

  const setStatuses = useCallback((statuses: SubmissionStatus[]) => {
    setFilters((prev) => ({ ...prev, statuses }));
  }, []);

  const setPeriodTypes = useCallback((periodTypes: PeriodType[]) => {
    setFilters((prev) => ({ ...prev, periodTypes }));
  }, []);

  const setIsSpecialCase = useCallback((isSpecialCase: boolean | null) => {
    setFilters((prev) => ({ ...prev, isSpecialCase }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.statuses.length > 0 ||
      filters.periodTypes.length > 0 ||
      filters.isSpecialCase !== null ||
      filters.searchQuery.trim() !== ""
    );
  }, [filters]);

  const filterSubmissions = useCallback(
    (submissions: Submission[]): Submission[] => {
      return submissions.filter((submission) => {
        if (
          filters.statuses.length > 0 &&
          !filters.statuses.includes(submission.status)
        ) {
          return false;
        }

        if (
          filters.periodTypes.length > 0 &&
          !filters.periodTypes.includes(submission.periodType)
        ) {
          return false;
        }

        if (
          filters.isSpecialCase !== null &&
          submission.isSpecialCase !== filters.isSpecialCase
        ) {
          return false;
        }

        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchesCompanyId = submission.companyId
            .toLowerCase()
            .includes(query);
          const matchesLegalEntityId = submission.legalEntityId
            .toLowerCase()
            .includes(query);
          if (!matchesCompanyId && !matchesLegalEntityId) {
            return false;
          }
        }

        return true;
      });
    },
    [filters]
  );

  return {
    filters,
    setFilters,
    setStatuses,
    setPeriodTypes,
    setIsSpecialCase,
    setSearchQuery,
    clearFilters,
    hasActiveFilters,
    filterSubmissions,
  };
};
