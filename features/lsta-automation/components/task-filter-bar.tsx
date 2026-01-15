"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { IconDownload, IconFilter, IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import type { TaskFilters, TaskStatus } from "../types";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "not-ready", label: "Not Ready" },
  { value: "review-required", label: "Needs Review" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "retrying", label: "Retrying" },
];

interface TaskFilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onExport: () => void;
}

export const TaskFilterBar = ({
  filters,
  onFiltersChange,
  onExport,
}: TaskFilterBarProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  useEffect(() => {
    setSearchValue(filters.searchQuery);
  }, [filters.searchQuery]);

  const handleStatusToggle = (status: TaskStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleSpecialCaseChange = (value: string) => {
    const specialCase = value === "all" ? null : value === "yes";
    onFiltersChange({ ...filters, specialCase });
  };

  const handleSubmittedChange = (value: string) => {
    const submitted = value === "all" ? null : value === "yes";
    onFiltersChange({ ...filters, submitted });
  };

  const getSpecialCaseValue = () => {
    if (filters.specialCase === null) return "all";
    return filters.specialCase ? "yes" : "no";
  };

  const getSubmittedValue = () => {
    if (filters.submitted === null) return "all";
    return filters.submitted ? "yes" : "no";
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onFiltersChange({ ...filters, searchQuery: "" });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      ...filters,
      specialCase: null,
      submitted: null,
      statuses: [],
    });
  };

  const activeFilterCount =
    (filters.specialCase !== null ? 1 : 0) +
    (filters.submitted !== null ? 1 : 0) +
    filters.statuses.length;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-8 w-[240px] border-muted bg-transparent py-1 pl-8 pr-8 text-sm shadow-none"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 size-6 -translate-y-1/2 cursor-pointer p-0"
            aria-label="Clear search"
          >
            <IconX className="size-3.5" />
          </Button>
        )}
      </div>

      <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto cursor-pointer gap-1.5 border-muted bg-transparent shadow-none"
          >
            <IconFilter className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-5 rounded-full px-1.5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto cursor-pointer p-0 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleClearFilters}
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Special Case</Label>
              <Select value={getSpecialCaseValue()} onValueChange={handleSpecialCaseChange}>
                <SelectTrigger size="sm" className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Submitted</Label>
              <Select value={getSubmittedValue()} onValueChange={handleSubmittedChange}>
                <SelectTrigger size="sm" className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      checked={filters.statuses.includes(option.value)}
                      onCheckedChange={() => handleStatusToggle(option.value)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        size="sm"
        className="cursor-pointer gap-1.5"
        onClick={onExport}
      >
        <IconDownload className="size-4" />
        Export
      </Button>
    </div>
  );
};
