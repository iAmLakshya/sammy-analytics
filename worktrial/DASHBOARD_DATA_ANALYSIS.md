# Dashboard Data Analysis & Visualization Strategy

## Executive Summary

This document analyzes the analytics data for building an **action-driven dashboard** for content management operations. The system tracks document version changes (diffs), AI-detected conflicts requiring human review, web source synchronization, and team performance metrics.

---

## Data Domain Overview

The data represents a **content accuracy management system** with four core operational areas:

| Domain | Purpose | Primary Users |
|--------|---------|---------------|
| **Diffs** | Track document version changes | Content managers, editors |
| **Conflicts** | AI-detected issues needing human review | Reviewers, QA team |
| **Web Sources** | External content synchronization | Operations team |
| **Analysis** | Automated content analysis runs | System admins, ops |

---

## Data Structure Analysis

### 1. DIFFS (Document Version Changes)

**Lifecycle:** `DRAFT` → `PREVIEW` → `APPLIED` / `ARCHIVED`

| File | Data Type | Metrics |
|------|-----------|---------|
| `1.jsonc` | Snapshot | State distribution (DRAFT: 58%, PREVIEW: 15%, APPLIED: 20%, ARCHIVED: 6%) |
| `3_diffs_per_day.jsonc` | Time series | Daily creation with draft/applied breakdown |
| `4_diffs_weekly.jsonc` | Time series | Weekly aggregation by state (90 days) |
| `5_diff_state_transitions.jsonc` | Time series | State change events (currently empty) |
| `6_time_to_resolution.jsonc` | Aggregate | Resolution time stats by final state |
| `7_pending_diffs_backlog.jsonc` | Snapshot | Current backlog: 10,600 pending, avg age 142 hrs |

**Key Insights:**
- Large backlog of 8,420 DRAFTs (79% of pending)
- Applied diffs take ~37 hrs average to resolve
- 1,842 documents have pending changes

---

### 2. CONFLICTS (AI-Detected Issues)

**Lifecycle:** `NEEDS_REVIEW` → `ACCEPTED` / `REJECTED`

| File | Data Type | Metrics |
|------|-----------|---------|
| `9_conflict_disposition_summary.jsonc` | Snapshot | 39% pending, 46% accepted, 15% rejected |
| `10_conflicts_per_day.jsonc` | Time series | Daily creation with disposition breakdown |
| `11_conflict_review_activity.jsonc` | Time series | Daily reviews + unique reviewers |
| `12_time_to_review_conflicts.jsonc` | Aggregate | Accepted: 8.5 hrs avg, Rejected: 12 hrs avg |
| `13_user_corrections.jsonc` | Snapshot | 412 corrections (4.5% rate), 7 unique correctors |
| `14_conflicts_by_priority.jsonc` | Snapshot | High: 2,850, Medium: 6,420, Low: 5,820 |
| `15_pending_conflicts_aging.jsonc` | Snapshot | 5,840 pending, 48 hrs avg age, 716 older than 30d |

**Key Insights:**
- 5,840 conflicts awaiting review (38.7% of total)
- 1,240 HIGH priority conflicts pending (critical!)
- 716 conflicts are older than 30 days (stale backlog)
- ~200 reviews/day on average

---

### 3. WEB SOURCES (External Content)

| File | Data Type | Metrics |
|------|-----------|---------|
| `16_web_watch_overview.jsonc` | Snapshot | 1,842 docs with conflicts, 287 with high priority |
| `19_web_page_sync_overview.jsonc` | Snapshot | 8,242 pages, 35% synced in last 24h |
| `20_syncs_per_day.jsonc` | Time series | Daily sync counts + pages with updates |

**Key Insights:**
- Good sync coverage (79% within 30 days)
- ~51% of synced pages detect updates (high change rate)

---

### 4. ANALYSIS RUNS (Automated Processing)

| File | Data Type | Metrics |
|------|-----------|---------|
| `22_analysis_runs_per_day.jsonc` | Time series | Daily runs, ~96% detect conflicts |
| `23_analysis_performance.jsonc` | Aggregate | Avg 8 min execution, median 7 min |

**Key Insights:**
- High conflict detection rate suggests accurate analysis
- Performance is consistent (7-8 min median)

---

### 5. TEAM ACTIVITY

| File | Data Type | Metrics |
|------|-----------|---------|
| `24_most_active_reviewers.jsonc` | Leaderboard | 8 active reviewers, top reviewer: 1,842 reviews |
| `25_review_by_day_of_week.jsonc` | Pattern | Weekday peak, weekend drop (90%+ reduction) |
| `27_documents_most_updates.jsonc` | Table | Top 20 documents by conflict count |

**Key Insights:**
- Small team (8 reviewers) handling large volume
- Clear weekday pattern - weekend coverage gap
- Top document has 921 conflicts (needs attention)

---

## Recommended Dashboard Structure

### Information Architecture

```
Dashboard
├── Overview (Home)           → Executive KPIs + alerts
├── Diffs                     → Version change management
├── Conflicts                 → Review queue + resolution
├── Web Sources               → External content health
├── Analysis                  → System performance
└── Team                      → Reviewer productivity
```

---

## Page-by-Page Visualization Strategy

### 1. OVERVIEW (Home Dashboard)

**Goal:** Surface critical actions needed NOW

#### Hero Section: Action Cards
| Card | Data Source | Visual | Action |
|------|-------------|--------|--------|
| "High Priority Pending" | `14_conflicts_by_priority` | Large number (1,240) + trend | → Go to conflict queue |
| "Stale Conflicts (>30d)" | `15_pending_conflicts_aging` | Alert badge (716) | → Filter stale items |
| "Draft Backlog" | `7_pending_diffs_backlog` | Number (8,420) + avg age | → Review draft queue |
| "Review Velocity" | `11_conflict_review_activity` | Today vs 7d avg | → Team performance |

#### Charts Section
| Chart | Type | Data | Purpose |
|-------|------|------|---------|
| Activity Trend | Area chart | `10_conflicts_per_day` + `11_conflict_review_activity` | Created vs Resolved comparison |
| Resolution Funnel | Stacked bar | `9_conflict_disposition_summary` | Show acceptance rate |

---

### 2. DIFFS PAGE

**Goal:** Manage document version change pipeline

#### KPI Cards
| Metric | Value | Source |
|--------|-------|--------|
| Total Pending | 10,600 | `7_pending_diffs_backlog` |
| In Draft | 8,420 | `7_pending_diffs_backlog` |
| In Preview | 2,180 | `7_pending_diffs_backlog` |
| Avg Age (hrs) | 142.35 | `7_pending_diffs_backlog` |

#### Charts
| Chart | Type | Data | Insight |
|-------|------|------|---------|
| State Distribution | Donut | `1.jsonc` | Pipeline health |
| Daily Creation | Line + bars | `3_diffs_per_day` | Draft vs Applied trend |
| Weekly Trend | Area (stacked) | `4_diffs_weekly` | Long-term pattern |
| Resolution Time | Bar chart | `6_time_to_resolution` | By final state |

#### Table
- Documents with most pending diffs (derive from `7_pending_diffs_backlog`)

---

### 3. CONFLICTS PAGE

**Goal:** Prioritize and clear review queue efficiently

#### Action Header
| Alert | Condition | Visual |
|-------|-----------|--------|
| "Critical Backlog" | High priority pending > 500 | Red badge |
| "Stale Items" | Items > 30 days old | Yellow warning |

#### KPI Cards
| Metric | Source | Action |
|--------|--------|--------|
| Needs Review | `9_conflict_disposition_summary` (5,840) | Primary CTA |
| High Priority | `14_conflicts_by_priority` (1,240 pending) | Filter button |
| Avg Review Time | `12_time_to_review_conflicts` (8.45 hrs) | Benchmark |
| Today's Reviews | `11_conflict_review_activity` | Progress indicator |

#### Charts
| Chart | Type | Data | Purpose |
|-------|------|------|---------|
| Disposition Breakdown | Pie/Donut | `9_conflict_disposition_summary` | Overall health |
| Daily Conflict Flow | Dual-axis line | `10_conflicts_per_day` + `11_conflict_review_activity` | Created vs Reviewed |
| Priority Distribution | Horizontal bar | `14_conflicts_by_priority` | Urgency breakdown |
| Aging Breakdown | Segmented bar | `15_pending_conflicts_aging` | <24h, 7d, 30d, >30d |

#### Table
- Pending conflicts sortable by priority, age, document

---

### 4. WEB SOURCES PAGE

**Goal:** Monitor external content sync health

#### KPI Cards (from `19_web_page_sync_overview`)
| Metric | Value |
|--------|-------|
| Total Pages | 8,242 |
| Synced Today | 2,847 (35%) |
| Synced This Week | 6,521 (79%) |
| Avg Hours Since Sync | 18.45 |

#### Charts
| Chart | Type | Data | Purpose |
|-------|------|------|---------|
| Sync Activity | Line (dual) | `20_syncs_per_day` | Pages synced vs updates detected |
| Documents with Conflicts | Summary | `16_web_watch_overview` | By priority level |

---

### 5. ANALYSIS PAGE

**Goal:** System health and performance monitoring

#### KPI Cards
| Metric | Source |
|--------|--------|
| Runs Today | `22_analysis_runs_per_day` |
| Avg Duration | `23_analysis_performance` (8.1 min) |
| Detection Rate | Calculated (~72%) |

#### Charts
| Chart | Type | Data |
|-------|------|------|
| Runs Per Day | Line | `22_analysis_runs_per_day` |
| Conflicts Detected | Stacked area | `22_analysis_runs_per_day` |
| Performance Distribution | Histogram | `23_analysis_performance` |

---

### 6. TEAM PAGE

**Goal:** Reviewer productivity and capacity planning

#### KPI Cards
| Metric | Source |
|--------|--------|
| Active Reviewers | `24_most_active_reviewers` (8) |
| Total Reviews (30d) | Sum from `24_most_active_reviewers` |
| Correction Rate | `13_user_corrections` (4.45%) |

#### Charts
| Chart | Type | Data |
|-------|------|------|
| Reviewer Leaderboard | Horizontal bar | `24_most_active_reviewers` |
| Day of Week Pattern | Bar chart | `25_review_by_day_of_week` |
| Acceptance/Rejection Ratio | Stacked bar | `24_most_active_reviewers` |

#### Table
- `27_documents_most_updates` - Documents needing most attention

---

## Action-Driven Design Principles

### 1. Surface Problems First
- Red/yellow badges for critical thresholds
- "Older than 30 days" should be prominent
- High priority pending count always visible

### 2. Enable Quick Filtering
- Every KPI card should be clickable → filtered view
- Priority filters prominent on Conflicts page
- Time range filters for trend analysis

### 3. Show Trends, Not Just Numbers
- Compare today vs 7-day average
- Show "created vs resolved" gaps
- Highlight backlog growth/reduction

### 4. Guide Next Steps
- "Review 10 high-priority conflicts" CTA
- "Oldest pending items" quick link
- "Documents needing attention" table

---

## Suggested Alert Thresholds

| Condition | Level | Threshold |
|-----------|-------|-----------|
| High priority pending | Critical | > 500 |
| Items older than 30 days | Warning | > 200 |
| Draft backlog | Warning | > 5,000 |
| Review velocity drop | Warning | < 50% of 7d avg |
| Sync coverage | Info | < 70% in 7 days |

---

## Data Refresh Strategy

| Data Type | Refresh Rate | Reason |
|-----------|--------------|--------|
| Snapshot (KPIs) | Real-time / 1 min | Critical for action |
| Time series (daily) | Hourly | Trend accuracy |
| Leaderboards | 15 min | Performance tracking |
| Performance metrics | 5 min | System health |

---

## Summary: Priority Order for Implementation

1. **Conflicts page** - Highest business impact (review queue management)
2. **Overview dashboard** - Executive visibility + alerts
3. **Diffs page** - Pipeline management
4. **Team page** - Resource planning
5. **Web Sources page** - Source health monitoring
6. **Analysis page** - System performance (lower priority for business users)
