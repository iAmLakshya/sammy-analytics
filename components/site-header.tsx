"use client"

import { Suspense, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { DASHBOARD_TABS, type TabId } from "@/lib/constants"
import { useTabState } from "@/hooks/use-tab-state"

const DATE_RANGES = [
  { value: "1d", label: "1D" },
  { value: "7d", label: "7D" },
  { value: "14d", label: "14D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
]

const HeaderContent = () => {
  const { activeTab, setActiveTab } = useTabState()
  const [dateRange, setDateRange] = useState("30d")

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabId)
  }

  const handleDateRangeChange = (value: string) => {
    if (value) setDateRange(value)
  }

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
  )
}

const HeaderFallback = () => (
  <>
    <Skeleton className="h-9 w-[400px]" />
    <div className="ml-auto">
      <Skeleton className="h-8 w-[180px]" />
    </div>
  </>
)

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Suspense fallback={<HeaderFallback />}>
          <HeaderContent />
        </Suspense>
      </div>
    </header>
  )
}
