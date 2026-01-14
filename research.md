# Sammy Analytics Dashboard - Codebase Research

> **Purpose**: Shared memory document for agents working on this project. Contains comprehensive codebase understanding, patterns, and context.
>
> **Last Updated**: 2026-01-13

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Directory Structure](#2-directory-structure)
3. [Feature Modules](#3-feature-modules)
4. [UI Components](#4-ui-components)
5. [Configuration & Dependencies](#5-configuration--dependencies)
6. [Styling System](#6-styling-system)
7. [App Router & Navigation](#7-app-router--navigation)
8. [Types & Data Structures](#8-types--data-structures)
9. [Mock Data Patterns](#9-mock-data-patterns)
10. [Implementation Patterns](#10-implementation-patterns)
11. [Key Files Reference](#11-key-files-reference)
12. [Future Work Areas](#12-future-work-areas)
13. [API Route Pattern](#13-api-route-pattern)

---

## 1. Project Overview

**Sammy Analytics** is a mocked analytics dashboard for **Sammy Labs Ultrathink** - a PR review analysis tool. It displays:
- PR review metrics
- Diff tracking and status
- Conflict detection and resolution
- Team performance analytics
- Web source synchronization

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.1 (App Router) |
| Language | TypeScript (strict mode) |
| UI | shadcn/ui + Radix primitives |
| Styling | Tailwind CSS 4 with CSS variables |
| Charts | Recharts 2.15.4 |
| Tables | TanStack Table 8.21.3 |
| Drag & Drop | dnd-kit |
| Icons | Lucide React, Tabler Icons |
| Theming | next-themes |
| Validation | Zod 4.3.5 |

### Current State

- **6 dashboard pages** fully implemented with UI
- **Diffs page** fully integrated with API routes + TanStack Query hooks + real charts
- **Other pages** still use hardcoded mock data (follow Diffs pattern to migrate)
- **Fully responsive** with dark mode support
- **Orange theme** - charts use orange palette matching primary color

---

## 2. Directory Structure

```
sammy-analytics/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout + QueryProvider + ThemeProvider
│   ├── page.tsx                   # Home (empty)
│   ├── globals.css                # CSS variables + theme
│   ├── api/                       # API Routes
│   │   └── diffs/
│   │       ├── overview/route.ts  # GET /api/diffs/overview
│   │       ├── daily/route.ts     # GET /api/diffs/daily
│   │       └── weekly/route.ts    # GET /api/diffs/weekly
│   └── dashboard/
│       ├── layout.tsx             # Dashboard shell (sidebar + header)
│       ├── page.tsx               # Overview
│       ├── analysis/page.tsx
│       ├── conflicts/page.tsx
│       ├── diffs/page.tsx
│       ├── team/page.tsx
│       └── web-sources/page.tsx
│
├── features/                      # Feature modules (domain-organized)
│   ├── overview/
│   ├── analysis/
│   ├── team/
│   ├── diffs/                     # FULLY IMPLEMENTED - reference pattern
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── components/
│   │   ├── hooks/
│   │   └── data/
│   ├── conflicts/
│   └── web-sources/
│
├── components/                    # Shared components
│   ├── ui/                        # shadcn/ui primitives (22 components)
│   ├── app-sidebar.tsx            # Main navigation sidebar
│   ├── site-header.tsx            # Page header
│   ├── nav-*.tsx                  # Navigation components
│   ├── data-table.tsx             # Advanced table with dnd
│   ├── query-provider.tsx         # TanStack Query provider
│   └── theme-provider.tsx
│
├── hooks/
│   └── use-mobile.ts              # Mobile breakpoint detection
│
├── lib/
│   ├── utils.ts                   # cn() helper
│   └── constants.ts               # ASSETS object
│
└── public/assets/                 # Static assets
```

### Feature Module Pattern

Each feature follows this structure:
```
/features/<feature-name>/
├── index.ts                 # Public API - exports only
├── types.ts                 # Feature types (when needed)
├── components/
│   ├── <component>.tsx
│   └── <component>-skeleton.tsx
├── hooks/
│   └── use-fetch-<entity>.ts
└── data/
    └── mock.<entity>.data.ts
```

**Diffs feature is fully implemented** with all directories. Other features still only have `index.ts` and `components/` - use Diffs as the reference pattern.

---

## 3. Feature Modules

### Overview (`/dashboard`)

**File**: `features/overview/components/overview-content.tsx`

**Components**:
- SectionCards (4 metric cards)
- ChartAreaInteractive (Diffs vs Conflicts over time)
- DocumentsTable (Top documents by conflicts)

**Metrics Displayed**:
- Pending Diffs: 18
- Pending Conflicts: 5,840
- Conflicts Resolved: 9,250
- Avg Review Time: 9.8h

---

### Diffs Analytics (`/dashboard/diffs`) - FULLY IMPLEMENTED

**Architecture**: UI → Hooks → API Routes → Mock Data

#### File Structure
```
features/diffs/
├── index.ts                           # Public exports
├── types.ts                           # TypeScript types
├── components/
│   ├── diffs-content.tsx              # Main page component
│   ├── metric-card.tsx                # Single metric card
│   ├── metric-grid.tsx                # Grid of metrics
│   ├── chart-placeholder.tsx          # Placeholder (legacy)
│   ├── state-distribution-chart.tsx   # Donut chart
│   ├── daily-diffs-chart.tsx          # Stacked bar chart
│   ├── weekly-trends-chart.tsx        # Stacked area chart
│   └── resolution-time-chart.tsx      # Horizontal bar chart
├── hooks/
│   ├── use-fetch-diffs-overview.ts    # Fetches state + backlog + resolution
│   ├── use-fetch-daily-diffs.ts       # Fetches daily data
│   └── use-fetch-weekly-diffs.ts      # Fetches weekly data
└── data/
    └── mock.diffs.data.ts             # All mock data
```

#### API Routes
| Route | Method | Returns |
|-------|--------|---------|
| `/api/diffs/overview` | GET | `DiffsOverviewResponse` (state distribution, backlog, resolution times) |
| `/api/diffs/daily` | GET | `DailyDiffsResponse` (9 days of daily data) |
| `/api/diffs/weekly` | GET | `WeeklyDiffsResponse` (8 weeks of weekly data) |

#### Types Defined (`types.ts`)
```typescript
type DiffState = "DRAFT" | "PREVIEW" | "APPLIED" | "ARCHIVED"

interface DiffStateDistribution {
  state: DiffState
  count: number
  percentage: string
}

interface DailyDiffs {
  date: string
  diffs_created: number
  drafts_created: number
  applied_on_creation: number
}

interface WeeklyDiffs {
  week: string
  diffs_created: number
  drafts: number
  preview: number
  applied: number
  archived: number
}

interface TimeToResolution {
  final_state: ResolutionState
  count: number
  avg_hours_to_resolve: string
  median_hours: string
  min_hours: string
  max_hours: string
}

interface PendingDiffsBacklog {
  pending_diffs: number
  draft_count: number
  preview_count: number
  affected_documents: number
  from_analysis_runs: number
  oldest_diff: string
  newest_diff: string
  avg_age_hours: string
}
```

#### Chart Components
| Component | Chart Type | Data Source | Key Features |
|-----------|------------|-------------|--------------|
| `StateDistributionChart` | Donut (PieChart) | `stateDistribution` | Center label with total, legend below |
| `DailyDiffsChart` | Stacked Bar | `dailyDiffs` | Drafts vs Applied, proper corner rounding |
| `WeeklyTrendsChart` | Stacked Area | `weeklyDiffs` | 4 states, trend indicator |
| `ResolutionTimeChart` | Horizontal Bar | `timeToResolution` | Avg/median comparison, summary stats |

#### Stacked Bar Corner Rounding Pattern
```typescript
// Bottom segment: round bottom corners only
<Bar dataKey="drafts_created" radius={[0, 0, 4, 4]} stackId="a" />
// Top segment: round top corners only
<Bar dataKey="applied_on_creation" radius={[4, 4, 0, 0]} stackId="a" />
```

#### Data Flow
```
DiffsContent
├── useFetchDiffsOverview() → /api/diffs/overview
│   └── Returns: stateDistribution, backlog, timeToResolution
├── useFetchDailyDiffs() → /api/diffs/daily
│   └── Returns: { data: DailyDiffs[] }
└── useFetchWeeklyDiffs() → /api/diffs/weekly
    └── Returns: { data: WeeklyDiffs[] }
```

**All charts include loading skeletons and handle empty states.**

---

### Conflicts Analytics (`/dashboard/conflicts`)

**File**: `features/conflicts/components/conflicts-content.tsx`

**Exported Components**: ConflictsContent, PriorityBreakdown

**State Distribution**:
| State | Count | Percentage | Badge |
|-------|-------|------------|-------|
| Needs Review | 5,840 | 38.7% | warning |
| Accepted | 6,950 | 46.05% | success |
| Rejected | 2,300 | 15.25% | destructive |

**Priority Breakdown**:
- High: 19% (destructive)
- Medium: 42% (warning)
- Low: 39% (info)

**Sections**:
1. Priority Breakdown (progress bars)
2. Time to Review (avg times)
3. User Corrections (412 corrections, 4.45% rate)
4. Conflicts Over Time (chart placeholder)
5. Pending Conflicts Aging (5-column grid)
6. Review Activity (chart placeholder)

---

### Analysis Engine (`/dashboard/analysis`)

**File**: `features/analysis/components/analysis-content.tsx`

**Exported Components**: AnalysisContent, AnalysisRunsTable

**Key Metrics**:
- Completed Runs: 3,702 (30 days)
- Avg Duration: 487s (~8 min)
- Median Duration: 412s (~7 min)
- Range: 52s - 1,843s

**Table Columns**: Date, Total Runs, With Conflicts, Detected, Avg/Run

---

### Team Activity (`/dashboard/team`)

**File**: `features/team/components/team-content.tsx`

**Exported Components**: TeamContent, ReviewersLeaderboard, WeekdayActivity

**Key Metrics**:
- Active Reviewers: 8
- Total Reviews: 8,750 (30 days)
- Avg Reviews/Day: 292
- Avg Review Time: 9.8h

**Leaderboard Fields**: rank, reviews, accepted, rejected, corrections, avgTime

---

### Web Sources (`/dashboard/web-sources`)

**File**: `features/web-sources/components/web-sources-content.tsx`

**Exported Components**: WebSourcesContent

**Key Metrics**:
- Documents with Conflicts: 1,842
- Pending Conflicts: 5,840 (3.17 avg/doc)
- High Priority: 287
- Medium Priority: 642

---

## 4. UI Components

### shadcn/ui Components Installed

| Component | File | Usage |
|-----------|------|-------|
| Avatar | `ui/avatar.tsx` | User profile images |
| Badge | `ui/badge.tsx` | Status labels (variants: default, success, warning, destructive) |
| Breadcrumb | `ui/breadcrumb.tsx` | Navigation breadcrumbs |
| Button | `ui/button.tsx` | Actions (variants: default, ghost, outline) |
| Card | `ui/card.tsx` | Content containers (CardHeader, CardTitle, CardContent, CardFooter, CardAction) |
| Chart | `ui/chart.tsx` | Recharts wrapper (ChartContainer, ChartTooltip) |
| Checkbox | `ui/checkbox.tsx` | Form checkboxes |
| Drawer | `ui/drawer.tsx` | Side panel modals (vaul) |
| DropdownMenu | `ui/dropdown-menu.tsx` | Context menus |
| Input | `ui/input.tsx` | Text inputs |
| Label | `ui/label.tsx` | Form labels |
| Select | `ui/select.tsx` | Dropdown selects |
| Separator | `ui/separator.tsx` | Visual dividers |
| Sheet | `ui/sheet.tsx` | Sheet modals |
| Sidebar | `ui/sidebar.tsx` | Navigation sidebar system |
| Skeleton | `ui/skeleton.tsx` | Loading placeholders |
| Sonner | `ui/sonner.tsx` | Toast notifications |
| Table | `ui/table.tsx` | Data tables |
| Tabs | `ui/tabs.tsx` | Tab navigation |
| Toggle | `ui/toggle.tsx` | Toggle buttons |
| ToggleGroup | `ui/toggle-group.tsx` | Toggle button groups |
| Tooltip | `ui/tooltip.tsx` | Hover tooltips |

### Custom Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| AppSidebar | `components/app-sidebar.tsx` | Main navigation sidebar |
| SiteHeader | `components/site-header.tsx` | Page header with sidebar trigger |
| NavMain | `components/nav-main.tsx` | Primary navigation items |
| NavSecondary | `components/nav-secondary.tsx` | Settings, Help, Search |
| NavDocuments | `components/nav-documents.tsx` | Reports section |
| NavUser | `components/nav-user.tsx` | User dropdown + theme toggle |
| DataTable | `components/data-table.tsx` | Advanced table with dnd-kit |
| SectionCards | `components/section-cards.tsx` | Overview metric cards |
| ChartAreaInteractive | `components/chart-area-interactive.tsx` | Interactive area chart |
| DocumentsTable | `components/documents-table.tsx` | Documents table |
| ThemeProvider | `components/theme-provider.tsx` | next-themes wrapper |

### Feature-Specific Components

| Component | Feature | Purpose |
|-----------|---------|---------|
| MetricCard | diffs | Single metric display card |
| MetricGrid | diffs | Grid of metrics (3/4/5 columns) |
| ChartPlaceholder | diffs | Placeholder for future charts |
| PriorityBreakdown | conflicts | Priority progress bars |
| AnalysisRunsTable | analysis | Analysis run history table |
| ReviewersLeaderboard | team | Ranked reviewer table |
| WeekdayActivity | team | Day-of-week activity chart |

---

## 5. Configuration & Dependencies

### package.json Key Dependencies

```json
{
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tanstack/react-query": "^5.90.16",
    "@tanstack/react-table": "^8.21.3",
    "recharts": "2.15.4",
    "lucide-react": "^0.562.0",
    "@tabler/icons-react": "^3.36.1",
    "next-themes": "^0.4.6",
    "zod": "^4.3.5",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0"
  }
}
```

### tsconfig.json

- **Target**: ES2017
- **Strict**: true
- **Path Alias**: `@/*` → root directory

### components.json (shadcn)

```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": { "baseColor": "neutral", "cssVariables": true },
  "iconLibrary": "lucide"
}
```

---

## 6. Styling System

### CSS Variables (globals.css)

**Light Mode**:
```css
--background: oklch(1 0 0);           /* White */
--foreground: oklch(0.1450 0 0);      /* Black */
--primary: oklch(0.6552 0.2334 34.2495); /* Orange */
--card: oklch(1 0 0);
--border: oklch(0.9220 0 0);
```

**Dark Mode**:
```css
--background: oklch(0.1450 0 0);      /* Almost black */
--foreground: oklch(0.9850 0 0);      /* Off-white */
--card: oklch(0.2050 0 0);            /* Dark gray */
```

### Status Colors (from CLAUDE.md)

| Status | Light | Dark |
|--------|-------|------|
| Success | `bg-emerald-100 text-emerald-700` | `bg-emerald-900/40 text-emerald-400` |
| Warning | `bg-amber-100 text-amber-700` | `bg-amber-900/40 text-amber-400` |
| Error | `bg-rose-100 text-rose-700` | `bg-rose-900/40 text-rose-400` |
| Info | `bg-blue-100 text-blue-700` | `bg-blue-900/40 text-blue-400` |

### Chart Colors (Orange Theme)

Charts use an orange palette matching the primary color (`--primary: oklch(0.6552 0.2334 34.2495)`):

```css
--chart-1: oklch(0.8200 0.1400 55);       /* Light amber */
--chart-2: oklch(0.7200 0.1800 45);       /* Medium orange */
--chart-3: oklch(0.6552 0.2334 34.2495);  /* Primary orange (matches --primary) */
--chart-4: oklch(0.5500 0.1800 30);       /* Deep orange */
--chart-5: oklch(0.4500 0.1400 25);       /* Dark amber */
```

**Usage in Diffs charts:**
- chart-1: Draft state (lightest)
- chart-2: Preview state
- chart-3: Applied state (primary)
- chart-4: Archived state (darkest)

### Design Tokens

- **Border Radius**: `0.625rem` (10px)
- **Font Stack**: System UI (no web fonts)
- **Card Shadows**: None (removed for flat design)
- **Shadow Scale**: 2xs → 2xl with 0.1 opacity (available but not used on cards)

---

## 7. App Router & Navigation

### Route Structure

| Route | Page | Feature |
|-------|------|---------|
| `/` | Empty | Root |
| `/dashboard` | Overview | OverviewContent |
| `/dashboard/diffs` | Diffs Analytics | DiffsContent |
| `/dashboard/conflicts` | Conflicts Analytics | ConflictsContent |
| `/dashboard/analysis` | Analysis Engine | AnalysisContent |
| `/dashboard/team` | Team Activity | TeamContent |
| `/dashboard/web-sources` | Web Sources | WebSourcesContent |

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
└── QueryProvider (TanStack Query)
    └── ThemeProvider
        └── DashboardLayout (app/dashboard/layout.tsx)
            ├── SidebarProvider
            │   ├── AppSidebar
            │   │   ├── NavMain (6 items)
            │   │   ├── NavDocuments
            │   │   ├── NavSecondary (3 items)
            │   │   └── NavUser
            │   └── SidebarInset
            │       ├── SiteHeader
            │       └── {children}
```

### Navigation Items (NavMain)

```typescript
const items = [
  { title: "Overview", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "Diffs", url: "/dashboard/diffs", icon: IconGitPullRequest },
  { title: "Conflicts", url: "/dashboard/conflicts", icon: IconAlertTriangle },
  { title: "Web Sources", url: "/dashboard/web-sources", icon: IconWorld },
  { title: "Analysis", url: "/dashboard/analysis", icon: IconChartLine },
  { title: "Team", url: "/dashboard/team", icon: IconUsers }
]
```

---

## 8. Types & Data Structures

### MetricCard Props

```typescript
interface MetricCardProps {
  label: string
  value: string
  badge?: string
  badgeVariant?: "default" | "success" | "warning" | "destructive"
  description: string
  icon?: LucideIcon
}
```

### MetricGrid Props

```typescript
interface MetricGridProps {
  items: {
    label: string
    value: string
    subtext?: string
    highlight?: boolean
  }[]
  columns?: 3 | 4 | 5
}
```

### ChartPlaceholder Props

```typescript
interface ChartPlaceholderProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
}
```

### Reviewer Data

```typescript
interface Reviewer {
  rank: number
  reviews: number
  accepted: number
  rejected: number
  corrections: number
  avgTime: string
}
```

### Document Data

```typescript
interface DocumentData {
  title: string
  analysisRuns: number
  totalConflicts: number
  pendingConflicts: number
  acceptedConflicts: number
  rejectedConflicts: number
}
```

### DataTable Schema (Zod)

```typescript
const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string()
})
```

---

## 9. Mock Data Patterns

### Chart Data (chart-area-interactive.tsx)

```typescript
const chartData = [
  { date: "2026-01-04", diffs: 186, conflicts: 80 },
  { date: "2026-01-05", diffs: 305, conflicts: 200 },
  // ...
]
```

### Reviewer Data (reviewers-leaderboard.tsx)

```typescript
const reviewers = [
  { rank: 1, reviews: 2450, accepted: 2103, rejected: 347, corrections: 89, avgTime: "7.2h" },
  // ...
]
```

### Document Data (documents-table.tsx)

```typescript
const documents = [
  {
    title: "authentication.mdx",
    analysisRuns: 378,
    totalConflicts: 921,
    pendingConflicts: 456,
    acceptedConflicts: 423,
    rejectedConflicts: 42
  },
  // ...
]
```

### Analysis Runs Data (analysis-runs-table.tsx)

```typescript
const analysisRuns = [
  { date: "2026-01-12", totalRuns: 127, withConflicts: 89, detected: 234, avgPerRun: 2.63 },
  // ...
]
```

### Weekday Activity Data (weekday-activity.tsx)

```typescript
const weekdayData = [
  { day: "Monday", reviews: 1450, reviewers: 7, avgTime: "8.2h" },
  // ...
]
```

---

## 10. Implementation Patterns

### Component Pattern

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MyComponentProps {
  id: string;
  title: string;
}

export const MyComponent = ({ id, title }: MyComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Early return pattern
  if (!id) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  );
};
```

### Query Hook Pattern (Implemented in Diffs)

```typescript
import { useQuery } from "@tanstack/react-query"
import type { DiffsOverviewResponse } from "../types"

const fetchDiffsOverview = async (): Promise<DiffsOverviewResponse> => {
  const response = await fetch("/api/diffs/overview")
  if (!response.ok) {
    throw new Error("Failed to fetch diffs overview")
  }
  return response.json()
}

export const useFetchDiffsOverview = () => {
  return useQuery({
    queryKey: ["diffs", "overview"],
    queryFn: fetchDiffsOverview,
    staleTime: 60 * 1000,
  })
}
```

**Usage in component:**
```typescript
const { data, isLoading, error } = useFetchDiffsOverview()

if (isLoading) return <Skeleton />
if (error) return <ErrorState />
if (!data) return <EmptyState />

return <Chart data={data.stateDistribution} />
```

### Mutation Hook Pattern (Planned)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRequest) => {
      // API call
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity'] });
    },
  });
};
```

### Animation Pattern

```typescript
<motion.div
  style={{ willChange: 'transform, opacity' }}
  layout
  layoutId={item.id}
  transition={{ duration: 0.2, ease: 'easeOut' }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  initial={{ opacity: 0, y: 10 }}
>
```

### Flex Scroll Fix (Critical)

```typescript
// Scrollable containers in flex parents MUST have min-h-0
<div className="flex h-full min-h-0 flex-col overflow-hidden">
  <ScrollArea className="h-full flex-1">
    {/* Content scrolls properly */}
  </ScrollArea>
</div>
```

---

## 11. Key Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.ts` | Next.js configuration (minimal) |
| `components.json` | shadcn/ui CLI configuration |
| `CLAUDE.md` | Coding standards and patterns |

### Layout Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with ThemeProvider |
| `app/dashboard/layout.tsx` | Dashboard shell with sidebar |
| `app/globals.css` | CSS variables and theme |

### Component Files (Most Commonly Modified)

| File | Purpose |
|------|---------|
| `components/app-sidebar.tsx` | Navigation sidebar |
| `components/nav-main.tsx` | Main nav items (add new routes here) |
| `components/section-cards.tsx` | Overview metric cards |
| `components/chart-area-interactive.tsx` | Main chart component |

### Feature Entry Points

| Feature | Entry Point |
|---------|-------------|
| Overview | `features/overview/index.ts` |
| Diffs | `features/diffs/index.ts` |
| Conflicts | `features/conflicts/index.ts` |
| Analysis | `features/analysis/index.ts` |
| Team | `features/team/index.ts` |
| Web Sources | `features/web-sources/index.ts` |

---

## 12. Future Work Areas

### Completed (Diffs Feature)

- [x] TanStack Query integration with QueryProvider
- [x] API routes pattern (`/api/diffs/*`)
- [x] Query hooks pattern (`useFetch*`)
- [x] Real Recharts charts (donut, bar, area)
- [x] Loading skeletons for all charts
- [x] Mock data in `data/` directory
- [x] Orange theme for charts matching primary color
- [x] Flat card design (no shadows)

### Remaining Work (Other Features)

Follow the Diffs pattern to implement:

1. **Conflicts Feature** (`/dashboard/conflicts`)
   - Mock data files: `9_conflict_disposition_summary.jsonc`, `10_conflicts_per_day.jsonc`, etc.
   - API routes: `/api/conflicts/overview`, `/api/conflicts/daily`, etc.
   - Charts: Priority breakdown, disposition pie, aging distribution

2. **Team Feature** (`/dashboard/team`)
   - Mock data files: `24_most_active_reviewers.jsonc`, `25_review_by_day_of_week.jsonc`
   - API routes: `/api/team/reviewers`, `/api/team/activity`
   - Charts: Leaderboard bar, weekday activity

3. **Analysis Feature** (`/dashboard/analysis`)
   - Mock data files: `22_analysis_runs_per_day.jsonc`, `23_analysis_performance.jsonc`
   - API routes: `/api/analysis/runs`, `/api/analysis/performance`
   - Charts: Runs over time, performance histogram

4. **Web Sources Feature** (`/dashboard/web-sources`)
   - Mock data files: `16_web_watch_overview.jsonc`, `19_web_page_sync_overview.jsonc`
   - API routes: `/api/web-sources/overview`, `/api/web-sources/syncs`
   - Charts: Sync status, conflict distribution

5. **Overview Feature** (`/dashboard`)
   - Aggregate data from other features
   - Update to use real hooks instead of hardcoded data

### General Improvements

- URL state sync for filters/tabs/pagination
- Error boundaries and error states
- Empty states for zero-data scenarios
- Real-time data refresh (WebSocket or polling)

---

## 13. API Route Pattern

### Creating a New API Route

```typescript
// app/api/<feature>/<endpoint>/route.ts
import { NextResponse } from "next/server"
import { mockData } from "@/features/<feature>/data/mock.<entity>.data"
import type { ResponseType } from "@/features/<feature>/types"

export async function GET() {
  // Optional: simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: ResponseType = {
    data: mockData,
  }

  return NextResponse.json(response)
}
```

### API Route Conventions

| Convention | Example |
|------------|---------|
| Base path | `/api/<feature>/` |
| Overview endpoint | `/api/<feature>/overview` |
| Time series | `/api/<feature>/daily`, `/api/<feature>/weekly` |
| Response wrapper | `{ data: T[] }` for arrays |

---

## Quick Reference

### Adding a New Feature

1. Create `features/<name>/` directory
2. Create `index.ts` with exports
3. Create `components/<name>-content.tsx`
4. Add route in `app/dashboard/<name>/page.tsx`
5. Add nav item in `components/nav-main.tsx`

### Adding a New shadcn Component

```bash
npx shadcn@latest add <component-name>
```

### Running the Project

```bash
pnpm dev       # Development server
pnpm build     # Production build
pnpm lint      # ESLint
```

### Important Patterns to Follow

- Use `@/components/ui/*` for all UI primitives
- Use semantic CSS variables, not Tailwind color classes
- Early returns for loading/error/empty states
- Arrow functions and `const` over `let`
- Never use `any` type
- Import motion from `motion/react`
