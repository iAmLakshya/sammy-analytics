"use client"

import { Suspense, lazy } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { type TabId } from "@/lib/constants"
import { useTabState } from "@/hooks/use-tab-state"

// Lazy load content components for performance
const OverviewContent = lazy(() =>
  import("@/features/overview").then((mod) => ({ default: mod.OverviewContent }))
)
const DiffsContent = lazy(() =>
  import("@/features/diffs").then((mod) => ({ default: mod.DiffsContent }))
)
const ConflictsContent = lazy(() =>
  import("@/features/conflicts").then((mod) => ({ default: mod.ConflictsContent }))
)
const AnalysisContent = lazy(() =>
  import("@/features/analysis").then((mod) => ({ default: mod.AnalysisContent }))
)
const TeamContent = lazy(() =>
  import("@/features/team").then((mod) => ({ default: mod.TeamContent }))
)
const WebSourcesContent = lazy(() =>
  import("@/features/web-sources").then((mod) => ({ default: mod.WebSourcesContent }))
)

const TabContentFallback = () => (
  <div className="flex flex-col gap-6 p-4 md:p-6">
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
)

const TAB_CONTENT_MAP: Record<TabId, React.LazyExoticComponent<React.ComponentType>> = {
  overview: OverviewContent,
  diffs: DiffsContent,
  conflicts: ConflictsContent,
  analysis: AnalysisContent,
  team: TeamContent,
  "web-sources": WebSourcesContent,
}

const DashboardTabsInner = () => {
  const { activeTab } = useTabState()
  const ContentComponent = TAB_CONTENT_MAP[activeTab]

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <Suspense fallback={<TabContentFallback />}>
        <ContentComponent />
      </Suspense>
    </div>
  )
}

export const DashboardTabs = () => (
  <Suspense fallback={<TabContentFallback />}>
    <DashboardTabsInner />
  </Suspense>
)
