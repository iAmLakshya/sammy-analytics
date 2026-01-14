"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTabState } from "@/hooks/use-tab-state";
import { DASHBOARD_TABS, type TabId } from "@/lib/constants";
import { Suspense, useState } from "react";

const DATE_RANGES = [
  { value: "1d", label: "1D" },
  { value: "7d", label: "7D" },
  { value: "14d", label: "14D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
];

const DashboardHeaderContent = () => {
  const { activeTab, setActiveTab } = useTabState();
  const [dateRange, setDateRange] = useState("30d");

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabId);
  };

  const handleDateRangeChange = (value: string) => {
    if (value) setDateRange(value);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="h-9 gap-1">
          {DASHBOARD_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 px-3"
            >
              <tab.icon className="size-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="ml-auto flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={dateRange}
          onValueChange={handleDateRangeChange}
          variant="outline"
          size="sm"
        >
          {DATE_RANGES.map((range) => (
            <ToggleGroupItem
              key={range.value}
              value={range.value}
              aria-label={`Show ${range.label} of data`}
              className="px-2.5 text-xs"
            >
              {range.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </>
  );
};

const DashboardHeaderFallback = () => (
  <>
    <Skeleton className="h-9 w-[400px]" />
    <div className="ml-auto">
      <Skeleton className="h-8 w-[180px]" />
    </div>
  </>
);

export const DashboardHeader = () => {
  return (
    <Suspense fallback={<DashboardHeaderFallback />}>
      <DashboardHeaderContent />
    </Suspense>
  );
};
