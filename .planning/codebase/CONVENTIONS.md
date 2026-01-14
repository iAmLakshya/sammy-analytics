# Coding Conventions

**Analysis Date:** 2026-01-14

## Naming Patterns

**Files:**
- kebab-case for all files: `analysis-content.tsx`, `use-fetch-data.ts`
- `*.test.ts` for tests (none exist yet)
- `mock.*.data.ts` for mock data files

**Functions:**
- camelCase for all functions: `fetchApi`, `getAnalysisOverview`
- No special prefix for async functions
- `handle*` for event handlers: `handleAction`, `handleSubmit`

**Variables:**
- camelCase for variables: `isLoading`, `activeTab`
- SCREAMING_SNAKE_CASE for constants: `DEFAULT_TAB`, `API_ENDPOINTS`
- No underscore prefix for private members

**Types:**
- PascalCase for interfaces: `AnalysisOverviewResponse`, `ConflictDisposition`
- PascalCase for type aliases: `TabId`, `ApiEndpoint`
- No `I` prefix for interfaces (use `User`, not `IUser`)

## Code Style

**Formatting:**
- 2-space indentation
- Double quotes for strings and imports
- Semicolons at end of statements
- Unix line endings

**Linting:**
- ESLint 9 with Next.js presets (`eslint.config.mjs`)
- TypeScript strict mode
- Run: `npm run lint`

## Import Organization

**Order:**
1. React/External libraries: `import { useState } from "react"`
2. UI Components: `import { Button } from "@/components/ui/button"`
3. Feature modules: `import { useFetchData } from "@/features/analysis"`
4. Relative imports: `import { Component } from "./component"`
5. Type imports: `import type { User } from "./types"`

**Grouping:**
- Blank line between groups
- Alphabetical within groups (not strictly enforced)

**Path Aliases:**
- `@/` maps to project root
- Always use alias for imports: `@/components/`, `@/features/`

## Error Handling

**Patterns:**
- Services return `Promise<T | ServiceError>`
- Route handlers check for `statusCode` property
- Throw errors, catch at boundaries

**Error Types:**
- `ServiceError` - Base class (`shared/utils/server/errors.ts`)
- `BadRequestError` - 400 errors
- `UnknownServerError` - 500 errors

**Async:**
- Use try/catch for async operations
- All async functions must be awaited (per `CLAUDE.md`)

## Logging

**Framework:**
- Console.log for development
- No structured logging configured

**Patterns:**
- Minimal logging (Unix philosophy: silence is golden)
- Log errors before throwing

## Comments

**When to Comment:**
- Explain why, not what
- Document business logic and edge cases
- Avoid obvious comments

**JSDoc/TSDoc:**
- Optional for internal functions
- No strict JSDoc requirement

**TODO Comments:**
- None found in codebase
- Format: `// TODO: description`

## Function Design

**Size:**
- Keep under 50 lines when possible
- Extract helpers for complex logic

**Parameters:**
- Max 3 parameters, use object for more
- Destructure in parameter list: `({ id, name }: Props)`

**Return Values:**
- Early returns for guard clauses (per `CLAUDE.md`)
- Explicit returns preferred

## Module Design

**Exports:**
- Named exports preferred
- Default exports for React components optional
- Public API via `index.ts` barrel files

**Barrel Files:**
- `index.ts` re-exports public API
- No deep imports into feature internals
- Example: `export { AnalysisContent } from "./components/analysis-content"`

## Component Patterns

**Structure:**
```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ComponentProps {
  requiredProp: string
  optionalProp?: number
}

export const Component = ({ requiredProp, optionalProp }: ComponentProps) => {
  const [state, setState] = useState<string | null>(null)
  const { data, isLoading, error } = useFetchData({ id: requiredProp })

  // Early returns for loading/error/empty
  if (isLoading) return <ComponentSkeleton />
  if (error) return <ErrorDisplay error={error} />
  if (!data) return <EmptyState />

  return <div className="...">{/* JSX */}</div>
}
```

**Key Rules (from `CLAUDE.md`):**
- Return early from conditionals
- Never use `any`
- Never leave async unawaited
- Prefer `const` over `let`
- Do not nest custom components inline

## Query Hook Pattern

```typescript
import { useApiQuery } from "@/shared/lib/use-api-query"
import { API_ENDPOINTS } from "@/shared/lib/api-endpoints"

export const useFetchEntity = () =>
  useApiQuery(API_ENDPOINTS.entity.endpoint)
```

## Mutation Hook Pattern

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateEntity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateRequest) => { /* ... */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity"] })
    },
  })
}

// Usage - always rename destructured values
const { mutate: updateEntity, isPending: isUpdating } = useUpdateEntity()
```

## UI Styling

**Component Library:**
- Always use `@/components/ui/*` for standard components
- Use component variants, not inline styles

**Colors:**
- Do NOT use Tailwind color classes (e.g., `text-gray-600`)
- Use semantic CSS variables from `globals.css`

**Status Colors (from `CLAUDE.md`):**
| State | Classes |
|-------|---------|
| Success | `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400` |
| Info | `bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400` |
| Warning | `bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400` |
| Error | `bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400` |

**Flex Scroll Fix:**
```typescript
// Scrollable containers in flex parents MUST have min-h-0
<div className="flex h-full min-h-0 flex-col overflow-hidden">
  <ScrollArea className="h-full flex-1">
    {/* Content */}
  </ScrollArea>
</div>
```

## Animation (Motion)

- Import from `motion/react` (NOT `framer-motion`)
- For server components: `import * as motion from "motion/react-client"`
- Always add `willChange` for animated properties

```typescript
<motion.div
  style={{ willChange: "transform, opacity" }}
  layout
  layoutId={item.id}
  transition={{ duration: 0.2, ease: "easeOut" }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  initial={{ opacity: 0, y: 10 }}
>
```

---

*Convention analysis: 2026-01-14*
*Update when patterns change*
