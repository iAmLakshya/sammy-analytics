"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import {
  IconCheck,
  IconChevronDown,
  IconDownload,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import type { TaskFilters, TaskStatus } from "../types";

const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
  className: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  {
    value: "processing",
    label: "Processing",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  {
    value: "completed",
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  {
    value: "failed",
    label: "Failed",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  {
    value: "retrying",
    label: "Retrying",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
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

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search company, LE ID, certificate..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-9 w-[260px] pl-8 pr-8 text-sm"
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

      <Select value={getSpecialCaseValue()} onValueChange={handleSpecialCaseChange}>
        <SelectTrigger className="h-9 w-[130px]" aria-label="Filter by special case">
          <SelectValue placeholder="Special Case" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Special Case</SelectItem>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>

      <Select value={getSubmittedValue()} onValueChange={handleSubmittedChange}>
        <SelectTrigger className="h-9 w-[120px]" aria-label="Filter by submitted">
          <SelectValue placeholder="Submitted" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Submitted</SelectItem>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 gap-1.5"
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto h-9 gap-1.5">
            <IconDownload className="size-4" />
            Export
            <IconChevronDown className="size-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExport}>
            <IconDownload className="mr-2 size-4" />
            Export CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
