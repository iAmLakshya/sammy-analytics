# Sammy Analytics Dashboard

Mocked analytics dashboard for Sammy Labs Ultrathink - displays PR review metrics, team performance, and analysis data.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Data Fetching**: TanStack Query (useQuery, useMutation)
- **UI Components**: shadcn/ui (`@/components/ui/*`)
- **Animation**: Motion for React (`motion/react`)
- **Styling**: Tailwind CSS with semantic CSS variables

## Project Structure

```
/features/<feature-name>/
├── index.ts                 # Public API - exports only
├── types.ts                 # Feature types
├── components/
│   ├── <component>/
│   │   ├── index.ts
│   │   ├── <component>.tsx
│   │   └── <component>-skeleton.tsx
│   └── ...
├── hooks/
│   ├── use-fetch-<entity>.ts
│   └── use-<action>-<entity>.ts
└── data/
    └── mock.<entity>.data.ts
```

## Coding Standards

### General Principles

- Return early from conditionals to reduce nesting
- Never use `any` - prefer strict types
- Never leave async functions unawaited
- Prefer arrow functions and `const` over `let`
- Do not nest custom React components inline

### Component Pattern

```typescript
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
}

export const Component = ({ requiredProp, optionalProp }: ComponentProps) => {
  const [state, setState] = useState<string | null>(null);
  const { data, isLoading, error } = useFetchData({ id: requiredProp });

  // Early returns for loading/error/empty
  if (isLoading) return <ComponentSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return <EmptyState />;

  const handleAction = () => {
    // handler logic
  };

  return <div className="...">{/* JSX */}</div>;
};
```

### Query Hooks

```typescript
import { useQuery } from "@tanstack/react-query";

const fetchEntity = async (id: string): Promise<EntityType> => {
  // fetch logic - return mock data for now
  return mockData;
};

export const useFetchEntity = (params: { id: string | null }) => {
  return useQuery({
    queryKey: ["entity", params.id],
    queryFn: () => fetchEntity(params.id!),
    enabled: !!params.id,
    staleTime: 10000,
  });
};
```

### Mutation Hooks

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRequest) => {
      // mutation logic
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity"] });
    },
  });
};

// Usage - always rename destructured values
const { mutate: updateEntity, isPending: isUpdating } = useUpdateEntity();
```

## Animation (Motion for React)

- Import from `motion/react` (NOT `framer-motion`)
- For server components: `import * as motion from 'motion/react-client'`
- Always add `willChange` for animated properties

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

## UI Components

- Always use `@/components/ui/*` for standard components
- Use component variants for styling, not inline styles
- Do NOT use Tailwind color classes (e.g., `text-gray-600`)
- Use semantic CSS variables from `globals.css`

### Status Colors

| State   | Classes                                                                        |
| ------- | ------------------------------------------------------------------------------ |
| Success | `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400` |
| Info    | `bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400`             |
| Warning | `bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400`         |
| Error   | `bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400`             |

### Flex Scroll Fix (Critical)

Scrollable containers in flex parents MUST have `min-h-0`:

```typescript
// Correct
<div className="flex h-full min-h-0 flex-col overflow-hidden">
  <ScrollArea className="h-full flex-1">
    {/* Content scrolls properly */}
  </ScrollArea>
</div>
```

## Naming Conventions

| Entity           | Convention           | Example            |
| ---------------- | -------------------- | ------------------ |
| Files/Folders    | kebab-case           | `data-table.tsx`   |
| Components       | PascalCase           | `DataTable`        |
| Hooks            | camelCase with `use` | `useFetchAnalysis` |
| Types/Interfaces | PascalCase           | `AnalysisRun`      |
| Variables        | camelCase            | `isLoading`        |

## Accessibility Requirements

- Full keyboard support with visible focus rings (`:focus-visible`)
- Hit targets >= 24px (mobile >= 44px)
- Icon-only buttons must have `aria-label`
- Loading buttons show spinner AND keep original label
- URL reflects state (filters, tabs, pagination)
- Empty/error/loading states always designed
- No color-only status indicators

## Unix Design Philosophy

- **Do one thing well**: Single responsibility per function/module
- **Clarity over cleverness**: Readable > clever code
- **Small, focused interfaces**: Minimal, clear APIs
- **Silence is golden**: No logging unless required
- **Build from simple tools**: Combine small building blocks

---

# Project Guidelines

## Build & Dependencies

- Use Poetry for dependency management
- Keep `.planning/` artifacts local (do not commit)

## Environment

- API keys for Claude, OpenAI, and Gemini are in `.env` (already in `.gitignore`)

## Code Comments

- Skip inline comments for obvious statements
- Add comments for non-obvious logic; docstrings are fine
