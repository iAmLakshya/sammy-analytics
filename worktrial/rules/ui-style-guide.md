# Dashboard UI Style Guide

This document outlines the design patterns, styling conventions, and UX principles used across the dashboard. Following these patterns ensures visual consistency and a polished user experience.

---

## Overview

The dashboard uses a modern, clean design language with:

- **Subtle borders and shadows** instead of heavy visual elements
- **Color-coded status indicators** for quick scanning
- **Consistent spacing and typography** throughout
- **Motion animations** for smooth transitions
- **Accessible color contrasts** with dark mode support

---

## 1. Card Patterns

### Standard Content Card

Use `Card` with subtle borders for content containers:

```tsx
<Card className="border-border/50">
  <CardHeader className="pb-4">{/* Header content */}</CardHeader>
  <CardContent>{/* Body content */}</CardContent>
</Card>
```

Key patterns:

- `border-border/50` - Subtle 50% opacity border
- `pb-4` on CardHeader - Consistent padding before content
- Avoid heavy shadows; use borders for definition

### Hero/Feature Card

For prominent content (e.g., policy headers, ticket details):

```tsx
<Card className="border-border/50">
  <CardHeader className="pb-4">
    <div className="flex items-start justify-between gap-4">
      {/* Left: Text content */}
      <div className="min-w-0 flex-1">
        {/* Badges row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            🇺🇸 United States
          </span>
          <StageBadge status={status} />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-xl font-semibold leading-tight lg:text-2xl">
          {title}
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Right: Status icon */}
      <StatusIcon />
    </div>
  </CardHeader>

  <CardContent>
    {/* Metadata grid */}
    <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
      <MetadataItem label="Created" value={date} />
      {/* ... */}
    </div>
  </CardContent>
</Card>
```

### Selectable List Card

For items in a list that can be selected (e.g., policy list, ticket queue):

```tsx
<div
  className={`cursor-pointer rounded-lg border-l-2 bg-card p-4 transition-all duration-200 hover:bg-muted/50 ${
    isSelected ? "border-l-primary bg-primary/5" : "border-l-transparent"
  }`}
  onClick={onClick}
>
  <div className="flex items-start gap-3">
    {/* Status icon */}
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconBgColor}`}
    >
      <Icon className="size-5" />
    </div>

    {/* Content */}
    <div className="min-w-0 flex-1">
      {/* Badges */}
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {country}
        </span>
        <StatusBadge />
      </div>

      {/* Title */}
      <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-snug">
        {title}
      </h3>

      {/* Summary */}
      <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {summary}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between">
        {/* Left: team icons, badges */}
        {/* Right: timestamp, actions */}
      </div>
    </div>
  </div>
</div>
```

Key patterns:

- `border-l-2` with `border-l-primary` for selection indicator
- `bg-primary/5` for selected background
- `hover:bg-muted/50` for hover state
- `rounded-lg` for card corners
- `transition-all duration-200` for smooth state changes

---

## 2. Color Schemes

### Status Colors

Use semantic colors for different states:

| State                | Light Mode                        | Dark Mode                                      |
| -------------------- | --------------------------------- | ---------------------------------------------- |
| **Success/Active**   | `bg-emerald-100 text-emerald-700` | `dark:bg-emerald-900/40 dark:text-emerald-400` |
| **Info/In Progress** | `bg-blue-100 text-blue-700`       | `dark:bg-blue-900/40 dark:text-blue-400`       |
| **Warning/Pending**  | `bg-amber-100 text-amber-700`     | `dark:bg-amber-900/40 dark:text-amber-400`     |
| **Error/Failed**     | `bg-rose-100 text-rose-700`       | `dark:bg-rose-900/40 dark:text-rose-400`       |
| **Neutral/Draft**    | `bg-muted text-muted-foreground`  | Same                                           |

### Badge/Pill Pattern

```tsx
const StageBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PROPOSED:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    IN_PROGRESS:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    ENACTED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    EFFECTIVE:
      "bg-emerald-200 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-300",
    FAILED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {label}
    </span>
  );
};
```

### Status Icon Pattern

Large icons for visual hierarchy in cards:

```tsx
const StatusIcon = ({ status }: { status: string }) => {
  const isActive = status === "EFFECTIVE" || status === "ENACTED";

  return (
    <div
      className={`flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl ${
        isActive
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
      }`}
    >
      {isActive ? (
        <CheckCircle className="size-8" />
      ) : (
        <Clock className="size-8" />
      )}
    </div>
  );
};
```

Sizes:

- `size-16` with `size-8` icon - Hero cards
- `size-12` with `size-6` icon - Secondary cards
- `size-10` with `size-5` icon - List items

---

## 3. List & Panel Layout

### ⚠️ Critical: Flex Scroll Fix

**Whenever you have a scrollable container inside a flex parent, you MUST add `min-h-0` to the flex child:**

```tsx
{
  /* ❌ BROKEN - content overflows, no scroll */
}
<div className="flex h-full flex-col">
  <ScrollArea className="flex-1">{/* Content won't scroll! */}</ScrollArea>
</div>;

{
  /* ✅ FIXED - scroll works correctly */
}
<div className="flex h-full min-h-0 flex-col overflow-hidden">
  <ScrollArea className="h-full flex-1">
    {/* Content scrolls properly */}
  </ScrollArea>
</div>;
```

**Why?** By default, flexbox sets `min-height: auto` on children, preventing them from shrinking below content height. `min-h-0` allows shrinking, enabling scroll.

---

### Two-Pane Resizable Layout

```tsx
<ResizablePanelGroup
  direction="horizontal"
  className="max-h-[calc(100vh-80px)]"
>
  {/* Left Panel - List */}
  <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-r bg-card">
      {/* Header with search/filters */}
      <div className="space-y-3 p-4">
        {/* Search bar */}
        {/* Filter stats */}
      </div>

      {/* Scrollable list */}
      <ScrollArea className="h-full flex-1">
        <div className="space-y-2 px-4 pb-4">
          {items.map((item) => (
            <ItemCard key={item.id} />
          ))}
        </div>
      </ScrollArea>
    </div>
  </ResizablePanel>

  <ResizableHandle
    withHandle
    className="border-transparent bg-gradient-to-t from-transparent via-border to-transparent"
  />

  {/* Right Panel - Detail */}
  <ResizablePanel defaultSize={65}>
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-muted/30">
      <ScrollArea className="h-full flex-1">
        <div className="space-y-6 p-6">
          <div className="mx-auto max-w-4xl space-y-6">{/* Content */}</div>
        </div>
      </ScrollArea>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>
```

Key patterns:

- Left panel: `border-r bg-card` - Solid background with right border
- Right panel: `bg-muted/30` - Subtle background differentiation
- Content: `mx-auto max-w-4xl` - Centered with max width for readability
- Spacing: `space-y-6 p-6` - Consistent padding and gaps

### Search & Filter Header

```tsx
<div className="space-y-3 p-4">
  {/* Search Row */}
  <div className="flex items-center gap-2">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="h-9 pl-9 text-sm"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={activeFilterCount > 0 ? "default" : "outline"}
          size="sm"
          className="gap-1.5"
        >
          <Filter className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-medium text-primary">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        {/* Filter controls */}
      </PopoverContent>
    </Popover>
  </div>

  {/* Stats Row */}
  <div className="flex items-center justify-between text-xs text-muted-foreground">
    <span>{count} items</span>
    <span>Sorted by updated</span>
  </div>
</div>
```

---

## 4. Tabs Pattern

For organizing content into sections:

```tsx
const [activeTab, setActiveTab] = useState<TabId>("first");

const tabs = [
  { id: "first", label: "First Tab", icon: FileText },
  { id: "second", label: "Second Tab", icon: Clock },
  { id: "third", label: "Third Tab", icon: MessageSquare },
];

return (
  <div className="space-y-6">
    {/* Tab Headers */}
    <div className="flex overflow-x-auto border-b">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {tab.label}
          </button>
        );
      })}
    </div>

    {/* Tab Content */}
    {activeTab === "first" && <FirstContent />}
    {activeTab === "second" && <SecondContent />}
    {activeTab === "third" && <ThirdContent />}
  </div>
);
```

---

## 5. Timeline Component

For showing progression/history:

```tsx
<div className="relative">
  {/* Vertical line */}
  <div className="absolute left-4 top-0 h-full w-px bg-border" />

  {timeline.map((item, i) => (
    <div key={i} className="relative flex items-start gap-4 pb-4 last:pb-0">
      {/* Status indicator */}
      <div
        className={`relative z-10 flex size-8 items-center justify-center rounded-full ${
          item.status === "complete"
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            : item.status === "active"
              ? "bg-primary/20 text-primary ring-2 ring-primary/30"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {item.status === "complete" ? (
          <Check className="size-4" />
        ) : item.status === "active" ? (
          <div className="size-2 animate-pulse rounded-full bg-primary" />
        ) : (
          <div className="size-2 rounded-full bg-muted-foreground/50" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-1">
        <p
          className={`text-sm font-medium ${
            item.status === "active"
              ? "text-primary"
              : item.status === "complete"
                ? "text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {item.label}
        </p>
        <p className="text-xs text-muted-foreground">{item.date}</p>
      </div>
    </div>
  ))}
</div>
```

---

## 6. Info Callout Boxes

For contextual information:

```tsx
{
  /* Success/Info callout */
}
<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
  <h4 className="mb-2 text-sm font-medium text-emerald-900 dark:text-emerald-100">
    Title
  </h4>
  <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
    Description text here.
  </p>
</div>;

{
  /* Warning callout */
}
<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 className="mb-2 text-sm font-medium text-amber-900 dark:text-amber-100">
    Title
  </h4>
  <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
    Description text here.
  </p>
</div>;

{
  /* Neutral/muted callout */
}
<div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-5">
  <p className="text-sm leading-relaxed text-muted-foreground">
    Description text here.
  </p>
</div>;
```

---

## 7. Empty States

Centered with icon, title, and description:

```tsx
<div className="flex h-full flex-col items-center justify-center p-6 text-center">
  <div className="rounded-full bg-muted p-6">
    <Icon className="size-12 text-muted-foreground" />
  </div>
  <h3 className="mt-4 text-lg font-medium">Title</h3>
  <p className="mt-1 text-sm text-muted-foreground">Description text here</p>
</div>
```

---

## 8. Loading Skeletons

Match the layout of the actual content:

```tsx
<div className="rounded-lg border-l-2 border-l-transparent bg-card p-4">
  <div className="flex items-start gap-3">
    <Skeleton className="size-10 shrink-0 rounded-xl" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
</div>
```

---

## 9. Metadata Grids

For displaying key-value pairs:

```tsx
<div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
  <div>
    <span className="text-xs uppercase tracking-wider text-muted-foreground">
      Label
    </span>
    <p className="mt-1 text-sm font-medium">{value}</p>
  </div>
  {/* More items... */}
</div>
```

---

## 10. Team/Tag Pills

For showing associated teams or categories:

```tsx
<div className="flex items-center gap-3 border-t pt-4">
  <span className="text-xs uppercase tracking-wider text-muted-foreground">
    Teams
  </span>
  <div className="flex items-center gap-1.5">
    {teams.map((team) => (
      <div
        key={team}
        className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
      >
        <TeamIcon team={team} />
        {team}
      </div>
    ))}
  </div>
</div>
```

---

## 11. Motion Animations

Use `motion/react` for list animations:

```tsx
import { AnimatePresence, motion } from "motion/react";

<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.div
      key={item.id}
      style={{ willChange: "transform, opacity" }}
      layout
      layoutId={item.id}
      transition={{ duration: 0.2, ease: "easeOut" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 10 }}
    >
      <ItemCard item={item} />
    </motion.div>
  ))}
</AnimatePresence>;
```

Key patterns:

- `willChange: 'transform, opacity'` for performance
- `layout` and `layoutId` for smooth reordering
- Short duration (0.2s) for snappy feel
- Subtle y-axis movement (10px) for entrance/exit

---

## 12. Typography Scale

| Element         | Classes                                                  |
| --------------- | -------------------------------------------------------- |
| Page title      | `text-xl font-semibold leading-tight lg:text-2xl`        |
| Section title   | `text-lg font-semibold`                                  |
| Card title      | `text-sm font-medium leading-snug`                       |
| Body text       | `text-sm leading-relaxed`                                |
| Small/meta text | `text-xs text-muted-foreground`                          |
| Labels          | `text-xs uppercase tracking-wider text-muted-foreground` |

---

## 13. Spacing Conventions

| Context           | Spacing              |
| ----------------- | -------------------- |
| Page padding      | `p-6`                |
| Card padding      | `p-4` or `p-5`       |
| Section gaps      | `space-y-6`          |
| Item gaps in list | `space-y-2`          |
| Badge gaps        | `gap-2`              |
| Icon gaps         | `gap-1` or `gap-1.5` |

---

## Quick Reference Checklist

When building a new feature, ensure:

- [ ] Cards use `border-border/50` for subtle borders
- [ ] Selected items use `border-l-primary bg-primary/5`
- [ ] Status indicators use the semantic color palette
- [ ] Empty states are centered with icon + title + description
- [ ] Loading skeletons match content layout
- [ ] Lists use motion animations
- [ ] Detail panels use `bg-muted/30` background
- [ ] Content is constrained with `max-w-4xl mx-auto`
- [ ] Metadata uses uppercase tracking-wider labels
- [ ] Dark mode is supported with `dark:` variants
