"use client";

import { useState, useEffect, useRef } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconFilter,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubmissionFilters, SubmissionStatus } from "../../types";

const STATUS_OPTIONS: { value: SubmissionStatus; label: string; className: string }[] = [
  {
    value: "queued",
    label: "Queued",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  {
    value: "processing",
    label: "Processing",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  {
    value: "completed",
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  {
    value: "needs-review",
    label: "Needs Review",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  {
    value: "retrying",
    label: "Retrying",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
];

interface SubmissionFilterBarProps {
  filters: SubmissionFilters;
  onFiltersChange: (filters: SubmissionFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export const SubmissionFilterBar = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: SubmissionFilterBarProps) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.searchQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (searchValue !== filters.searchQuery) {
        onFiltersChange({ ...filters, searchQuery: searchValue });
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, filters, onFiltersChange]);

  const handleStatusToggle = (status: SubmissionStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleSpecialCaseChange = (value: string) => {
    if (value === "all") {
      onFiltersChange({ ...filters, isSpecialCase: null });
    } else if (value === "special") {
      onFiltersChange({ ...filters, isSpecialCase: true });
    } else {
      onFiltersChange({ ...filters, isSpecialCase: false });
    }
  };

  const getSpecialCaseValue = () => {
    if (filters.isSpecialCase === null) return "all";
    return filters.isSpecialCase ? "special" : "sammy";
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onFiltersChange({ ...filters, searchQuery: "" });
  };

  const handleClearAll = () => {
    setSearchValue("");
    onFiltersChange({
      statuses: [],
      periodTypes: [],
      isSpecialCase: null,
      searchQuery: "",
    });
  };

  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.isSpecialCase !== null ||
    filters.searchQuery.trim() !== "";

  const isFiltered = filteredCount !== totalCount;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <IconFilter className="size-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            aria-label="Filter by status"
          >
            Status
            {filters.statuses.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 rounded-full px-1.5 text-xs"
              >
                {filters.statuses.length}
              </Badge>
            )}
            <IconChevronDown className="size-3.5 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {STATUS_OPTIONS.map((option) => {
                  const isSelected = filters.statuses.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleStatusToggle(option.value)}
                    >
                      <div
                        className={`mr-2 flex size-4 items-center justify-center rounded border ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <IconCheck className="size-3" />}
                      </div>
                      <Badge className={option.className}>{option.label}</Badge>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Select value={getSpecialCaseValue()} onValueChange={handleSpecialCaseChange}>
        <SelectTrigger size="sm" className="h-8 w-[100px]" aria-label="Filter by submission type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="special">Special</SelectItem>
          <SelectItem value="sammy">Sammy</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative">
        <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search company or LE ID..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-8 w-[200px] pl-8 pr-8 text-sm"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            aria-label="Clear search"
          >
            <IconX className="size-3.5" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}

      <div className="ml-auto text-sm text-muted-foreground">
        {isFiltered ? (
          <span>
            Showing <span className="font-medium text-foreground">{filteredCount}</span> of{" "}
            {totalCount}
          </span>
        ) : (
          <span>{totalCount} submissions</span>
        )}
      </div>
    </div>
  );
};
