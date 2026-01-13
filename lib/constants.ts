import {
  IconLayoutDashboard,
  IconGitPullRequest,
  IconAlertTriangle,
  IconChartLine,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react"
import type { Icon } from "@tabler/icons-react"

export const ASSETS = {
  SAMMY_LOGO: "/assets/sammy-logo.png",
}

export type TabId = "overview" | "diffs" | "conflicts" | "analysis" | "team" | "web-sources"

export interface TabConfig {
  id: TabId
  label: string
  icon: Icon
}

export const DASHBOARD_TABS: TabConfig[] = [
  { id: "overview", label: "Overview", icon: IconLayoutDashboard },
  { id: "diffs", label: "Diffs", icon: IconGitPullRequest },
  { id: "conflicts", label: "Conflicts", icon: IconAlertTriangle },
  { id: "analysis", label: "Analysis", icon: IconChartLine },
  { id: "team", label: "Team", icon: IconUsers },
  { id: "web-sources", label: "Web Sources", icon: IconWorld },
]

export const DEFAULT_TAB: TabId = "overview"

export const isValidTab = (tab: string | null): tab is TabId => {
  return DASHBOARD_TABS.some((t) => t.id === tab)
}
