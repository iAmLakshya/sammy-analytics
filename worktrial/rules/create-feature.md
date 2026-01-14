comprehensive coding style guide based on all the patterns I've observed.

---

# 🏆 Dashboard Gold Standard: Coding Style Guide
## Based on the `source-watch` Feature Reference Implementation

---

## 1. 📜 File Documentation Headers

**Every file MUST begin with a dual documentation header:**

```typescript
/**
 * HUMAN DESCRIPTION:
 *   [1-3 sentence summary for humans - explains the PURPOSE and USER VALUE]
 *
 * LLM DESCRIPTION:
 *   [1-3 sentence technical summary for AI tools - explains IMPLEMENTATION and DATA FLOW]
 */
```

**Example from `analysis-detail-viewer.tsx`:**

```1:10:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/analysis-detail-viewer/analysis-detail-viewer.tsx
/**
 * HUMAN DESCRIPTION:
 *   Component that displays document conflicts for a selected source.
 *   Shows source header, retry analysis expandable, and conflict cards grouped by document.
 *
 * LLM DESCRIPTION:
 *   React component that renders source conflicts in a scrollable view with
 *   animated document conflict cards, retry analysis panel, and acknowledgment functionality.
 */
```

---

## 2. 📁 Feature Folder Structure

**Standard feature folder layout:**

```
/features/<feature-name>/
├── index.ts                    # Public API - ONLY exports
├── types.ts                    # Shared types for the feature
├── <feature-hub>.tsx           # Main container component
├── components/
│   ├── <sub-feature>/
│   │   ├── index.ts            # Sub-feature public API
│   │   ├── types.ts            # Sub-feature specific types
│   │   ├── <main-component>.tsx
│   │   ├── components/
│   │   │   ├── <child>.tsx
│   │   │   └── <child>-skeleton.tsx
│   │   ├── hooks/
│   │   │   ├── use-<data>.ts
│   │   │   └── use-<action>.ts
│   │   └── utils/
│   │       └── <helper>.ts
```

**Example from source-watch:**

```
/source-watch/
├── index.ts                      # exports SourceWatchView
├── types.ts                      # FilterState, FilterDefinition, etc.
├── source-watch-hub.tsx          # Main container
└── components/
    ├── analysis-detail-viewer/
    │   ├── index.ts
    │   ├── types.ts
    │   ├── analysis-detail-viewer.tsx
    │   ├── components/
    │   │   ├── source-header.tsx
    │   │   ├── empty-state.tsx
    │   │   ├── document-conflict-card.tsx
    │   │   ├── document-conflict-card-skeleton.tsx
    │   │   └── new-document/
    │   │       ├── new-document-card.tsx
    │   │       ├── draft-document-modal.tsx
    │   │       ├── draft-document-content.tsx
    │   │       └── draft-document-header.tsx
    │   ├── hooks/
    │   │   ├── use-source-detail.ts
    │   │   ├── use-deep-linking.ts
    │   │   ├── use-add-context.ts
    │   │   └── use-refine-document.ts
    │   └── utils/
    │       └── s3-helpers.ts
    └── source-list/
        ├── index.ts
        ├── types.ts
        └── ...
```

---

## 3. 📤 Index.ts Public API Pattern

**Index files ONLY contain exports - no logic:**

```typescript
// ✅ CORRECT: Single export from index.ts
export { SourceWatchView } from './source-watch-hub';
```

```typescript
// ✅ CORRECT: Component-level index.ts  
export { AnalysisDetailViewer } from './analysis-detail-viewer';
```

```typescript
// ❌ WRONG: Logic or multiple responsibilities in index.ts
import { something } from './file';
export const processedThing = doSomething(something);
```

---

## 4. 🧩 Component Structure Pattern

**Standard component file structure:**

```typescript
/**
 * HUMAN DESCRIPTION: ...
 * LLM DESCRIPTION: ...
 */

'use client';

// 1. External imports (React, libraries)
import { useState, useRef } from 'react';
import { motion } from 'motion/react';

// 2. Internal imports (UI components, hooks, utils)
import { Button } from '@/shared/components/ui/button';
import { useSourceDetail } from './hooks/use-source-detail';

// 3. Local imports (sibling components, types)
import { SourceHeader } from './components/source-header';
import { FilterState } from './types';

// 4. Interface definition (BEFORE component)
interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  onAction: (value: string) => void;
}

// 5. Component as arrow function export
export const ComponentName = ({
  requiredProp,
  optionalProp,
  onAction,
}: ComponentNameProps) => {
  // 6. Hooks first (state, refs, custom hooks)
  const [state, setState] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useSourceDetail({ id: requiredProp });

  // 7. Early returns for loading/error/empty states
  if (!requiredProp) return <EmptyState />;
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;

  // 8. Handlers (defined as const arrow functions)
  const handleAction = () => {
    onAction(state);
  };

  // 9. Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

**Reference:**

```32:73:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/analysis-detail-viewer/analysis-detail-viewer.tsx
export const AnalysisDetailViewer = ({
  selectedOriginId,
}: SourceDocumentViewerProps) => {
  const [isRetryPanelOpen, setIsRetryPanelOpen] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch detail data using the new hook
  const {
    data: analysisDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useSourceDetail({ originId: selectedOriginId });

  if (!selectedOriginId) return <EmptyState />;
  if (isLoadingDetail) return <DocumentConflictCardSkeleton />;

  if (detailError) {
    console.error('Detail fetch error:', detailError);
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <p className="text-destructive">
          Error loading details: {String(detailError)}
        </p>
      </div>
    );
  }

  if (!analysisDetail) return <EmptyState />;
  // ... rest of component
```

---

## 5. 🎣 Hook Patterns

### 5.1 Query Hooks (Data Fetching)

**Pattern: Separate fetch function, then useQuery:**

```typescript
/**
 * HUMAN DESCRIPTION: ...
 * LLM DESCRIPTION: ...
 */

import { useQuery } from '@tanstack/react-query';

// 1. Fetch function defined OUTSIDE hook (pure function)
const fetchSourceDetail = async (originId: string): Promise<DetailResponse> => {
  const response = await fetch(`/api/source-watch/detail?origin_id=${originId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch');
  }
  return response.json();
};

// 2. Type for hook parameters
type UseSourceDetailParams = { originId: string | null };

// 3. Hook export
export const useSourceDetail = (params: UseSourceDetailParams) => {
  return useQuery({
    queryKey: ['source-detail', params.originId],
    queryFn: () => fetchSourceDetail(params.originId!),
    enabled: !!params.originId,
    staleTime: 10000, // Cache duration in ms
  });
};
```

**Reference:**

```17:46:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/analysis-detail-viewer/hooks/use-source-detail.ts
export const useSourceDetail = (params: SourceDetailParams) => {
  return useQuery({
    queryKey: ['source-detail', params?.originId],
    queryFn: async (): Promise<_AnalysisDetailResponse> => {
      if (!params.originId) {
        throw new Error('Missing required parameters');
      }

      // Build query parameters with origin_id
      const queryParams = new URLSearchParams();
      queryParams.set('origin_id', params.originId);

      const response = await fetch(
        `/api/documentation-updates/detail?${queryParams.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Failed to fetch source detail',
        }));
        throw new Error(errorData.message || 'Failed to fetch source detail');
      }

      const data = await response.json();
      return data as _AnalysisDetailResponse;
    },
    enabled: !!params.originId,
    staleTime: 10000, // 10s cache
  });
};
```

### 5.2 Mutation Hooks (Actions)

**Pattern: useMutation with query invalidation:**

```typescript
/**
 * HUMAN DESCRIPTION: ...
 * LLM DESCRIPTION: ...
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

// 1. Request interface
interface RefineDocumentRequest {
  flow_version_id: string;
  parent_run_id: string;
  user_feedback: string;
}

// 2. Hook export
export const useRefineDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RefineDocumentRequest) => {
      const response = await fetch('/api/content-updates/rerun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to refine document');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate related queries to refetch
      queryClient.invalidateQueries({ queryKey: ['source-detail'] });
    },
  });
};
```

**Reference:**

```18:41:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/analysis-detail-viewer/hooks/use-refine-document.ts
export const useRefineDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RefineDocumentRequest) => {
      const response = await fetch('/api/content-updates/rerun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to refine document');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate detail query to refetch updated analysis
      queryClient.invalidateQueries({ queryKey: ['source-detail'] });
    },
  });
};
```

### 5.3 Mutation Hook Consumption

**Pattern: Rename destructured values for clarity:**

```typescript
// ✅ CORRECT: Descriptive naming
const { mutate: addContext, isPending: isAddingContext } = useAddContext();
const { mutate: refineDocument, isPending: isRefining } = useRefineDocument();

// ❌ WRONG: Generic naming
const { mutate, isPending } = useAddContext();
```

---

## 6. 🎨 Motion/Animation Pattern

**Import from `motion/react` for client components:**

```typescript
'use client';

import { AnimatePresence, motion } from 'motion/react';
```

**Standard animation config with willChange optimization:**

```typescript
<motion.div
  style={{ willChange: 'transform, opacity' }}
  layout
  layoutId={item.id}
  transition={{ duration: 0.3, ease: 'easeOut' }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3, ease: 'easeIn' },
  }}
  initial={{ opacity: 0, y: 10, scale: 0.95 }}
>
```

**For server components, use:**

```typescript
import * as motion from 'motion/react-client';
```

**Reference:**

```53:67:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/source-list/components/source-card.tsx
  return (
    <motion.div
      style={{ willChange: 'transform, opacity' }}
      layout
      layoutId={source.sourceId}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.3, ease: 'easeIn' },
      }}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
    >
```

---

## 7. 🖥️ API Route Pattern

### 7.1 Route Handler Structure

```typescript
/**
 * API route for [description]
 * 
 * GET /api/feature/endpoint?param=X
 * 
 * HUMAN: [user-facing description]
 * LLM: [technical description]
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  BadRequestError,
  ServiceError,
  UnknownServerError,
} from '@/shared/utils/server/errors';
import {
  CoreDependencies,
  RouteContext,
  wrapRouteHandler,
} from '@/shared/utils/server/wrap-route-handler';

import { getDataFromSupabase } from './supabase';

// 1. Export HTTP method handler
export const GET = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, handleFetch);
};

// 2. Handler function with CoreDependencies
const handleFetch =
  (dependencies: CoreDependencies) =>
  async (
    request: NextRequest,
    _context: RouteContext
  ): Promise<NextResponse | ServiceError> => {
    const { searchParams } = new URL(request.url);
    const param = searchParams.get('param');

    // 3. Validate inputs - early return
    if (!param) {
      return new BadRequestError({ message: 'Missing param' });
    }

    // 4. Call supabase layer
    const result = await getDataFromSupabase(dependencies, param);
    if (result instanceof ServiceError) return result;

    // 5. Return JSON response
    return NextResponse.json(result);
  };
```

**Reference:**

```31:72:/Users/shav/Code/sammy/dashboard/src/app/api/source-watch/detail/route.ts
export const GET = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, handleSourceDetailFetch);
};

const handleSourceDetailFetch =
  (dependencies: CoreDependencies) =>
  async (
    request: NextRequest,
    _context: RouteContext
  ): Promise<NextResponse | ServiceError> => {
    const { searchParams } = new URL(request.url);
    const originId = searchParams.get('origin_id');

    if (!originId) {
      return new BadRequestError({
        message: 'Must provide origin_id',
      });
    }
    // ... rest of handler
```

### 7.2 Supabase Layer Pattern

```typescript
/**
 * Database queries for [feature] API endpoint
 * 
 * HUMAN: [user description]
 * LLM: [technical description]
 */

import { ServiceError, UnknownServerError } from '@/shared/utils/server/errors';
import { CoreDependencies } from '@/shared/utils/server/wrap-route-handler';

// 1. Export async functions that take dependencies
export const getDataById = async (
  dependencies: CoreDependencies,
  id: string
): Promise<DataType | ServiceError> => {
  const { supabaseClient, organisationId } = dependencies;

  // 2. ALWAYS include organisation_id filter
  const { data, error } = await supabaseClient
    .from('table_name')
    .select('column1, column2')
    .eq('id', id)
    .eq('organisation_id', organisationId);

  // 3. Handle errors with ServiceError
  if (error) {
    return new UnknownServerError({
      message: `Could not fetch data: ${error.message}`,
    });
  }

  return data;
};
```

**Reference:**

```20:47:/Users/shav/Code/sammy/dashboard/src/app/api/source-watch/detail/supabase.ts
export const getOriginKindFromOriginId = async (
  dependencies: CoreDependencies,
  originId: string
): Promise<ServiceError | string> => {
  const { supabaseClient, organisationId } = dependencies;

  const { data: originData, error: originError } = await supabaseClient
    .from('analysis_run_origin_v')
    .select('origin_kind')
    .or(`origin_id.eq.${originId},origin_canonical_id.eq.${originId}`)
    .eq('organisation_id', organisationId);

  if (originError) {
    return new UnknownServerError({
      message: `Could not fetch origin from origin_id: ${originError.message}`,
    });
  }
  // ...
```

---

## 8. 📝 Type Definition Patterns

### 8.1 Feature-Level Types

```typescript
/**
 * HUMAN DESCRIPTION: ...
 * LLM DESCRIPTION: ...
 */

// 1. Import database types when needed
import { Database } from '@/shared/types/database';

// 2. Export interfaces alphabetically
export interface FilterDefinition {
  id: string;
  json_path: string;
  label?: string;
}

export interface FilterOption {
  filter_value: string;
  value_count: number;
}

// 3. Use index signature for dynamic keys
export interface FilterState {
  [filterId: string]: string | null | undefined;
  search?: string | null;
}

// 4. Union types for enums
export type AnalysisStatus =
  | 'ARCHIVED'
  | 'COMPLETED'
  | 'FAILED'
  | 'PROCESSING'
  | 'QUEUED';

// 5. Database enum references
export type SourcePlatform = Database['public']['Enums']['source_platform'];
```

---

## 9. 🎭 UI Component Usage

**ALWAYS use component library:**

```typescript
// ✅ CORRECT: Using component library
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from '@/shared/components/ui/separator';

// ❌ WRONG: Inline styling or custom components
<button className="px-4 py-2 bg-blue-500 text-white">Click</button>
```

**Badge variants for status indicators:**

```typescript
<Badge variant="outline">Default</Badge>
<Badge variant="needsReview">
  <div className="size-2 rounded-full bg-yellow" />
  Needs Review
</Badge>
<Badge variant="new">
  <Sparkles className="size-3" />
  New
</Badge>
<Badge variant="jira">
  <Icons.jira className="size-3" />
  Jira
</Badge>
```

---

## 10. 💀 Skeleton Components

**Pattern: Match the content structure exactly:**

```typescript
/**
 * HUMAN DESCRIPTION:
 *   Skeleton loading component for [component name] during data fetching.
 *   Shows a placeholder with animated loading state.
 *
 * LLM DESCRIPTION:
 *   React component that renders skeleton placeholders matching [component] layout.
 */

'use client';

import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const SourceCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 items-start gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="size-6 shrink-0" />
        </div>
        <Skeleton className="mt-2 h-5 w-20" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
};
```

**Reference:**

```15:34:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/source-list/components/source-card-skeleton.tsx
export const SourceCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 items-start gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="size-6 shrink-0" />
        </div>
        <Skeleton className="mt-2 h-5 w-20" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
};
```

---

## 11. 🚨 Error Handling & Toast Pattern

**Standard toast usage:**

```typescript
import { useToast } from '@/shared/components/ui/use-toast';

const { toast } = useToast();

// Success toast
toast({
  title: 'Success!',
  description: 'Operation completed successfully',
});

// Error toast
toast({
  title: 'Error',
  description: error instanceof Error ? error.message : 'Operation failed',
  variant: 'destructive',
});

// With mutation callbacks
mutate(data, {
  onSuccess: () => {
    toast({ title: 'Success', description: 'Document refined' });
    onSuccess?.();
    onClose();
  },
  onError: (error) => {
    toast({
      title: 'Failed',
      description: error instanceof Error ? error.message : 'Operation failed',
      variant: 'destructive',
    });
  },
});
```

---

## 12. 📋 Modal Pattern

```typescript
/**
 * HUMAN DESCRIPTION: ...
 * LLM DESCRIPTION: ...
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // ... other props
}

export const FeatureModal = ({ isOpen, onClose, ...props }: ModalProps) => {
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormState(initialState);
    }
  }, [isOpen]);

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
        </DialogHeader>
        {/* Modal content */}
      </DialogContent>
    </Dialog>
  );
};
```

**Reference:**

```25:42:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/analysis-detail-viewer/components/new-document/draft-document-modal.tsx
export const DraftDocumentModal = ({
  draftDocument,
  isOpen,
  onClose,
}: DraftDocumentModalProps) => {
  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent size="full">
        <div className="flex h-full flex-col overflow-hidden">
          <DraftDocumentHeader draftDocument={draftDocument} />
          <div className="min-h-0 flex-1">
            <DraftDocumentContent draftDocument={draftDocument} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 13. 🔧 Utility Functions

**Pattern: Pure functions with clear documentation:**

```typescript
/**
 * HUMAN DESCRIPTION: ...
 * LLM DESCRIPTION: ...
 */

/**
 * Extract S3 key from CDN URL
 * @param fileUrl - Full CDN URL
 * @returns S3 key without domain prefix
 */
export function extractS3Key(fileUrl: string): string {
  const cdnUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || 'https://cdn.sammylabs.com';
  return fileUrl.replace(cdnUrl, '').replace(/^\//, '');
}
```

**Reference:**

```9:13:/Users/shav/Code/sammy/dashboard/src/shared/features/source-watch/components/analysis-detail-viewer/utils/s3-helpers.ts
export function extractS3Key(fileUrl: string): string {
  const cdnUrl =
    process.env.NEXT_PUBLIC_CLOUDFRONT_URL || 'https://cdn.sammylabs.com';
  return fileUrl.replace(cdnUrl, '').replace(/^\//, '');
}
```

---

## 14. ⌨️ Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Files/Folders | kebab-case | `source-card.tsx`, `use-source-detail.ts` |
| Components | PascalCase | `SourceCard`, `AnalysisDetailViewer` |
| Hooks | camelCase with `use` prefix | `useSourceDetail`, `useAddContext` |
| Interfaces/Types | PascalCase | `SourceCardProps`, `FilterState` |
| Variables/Functions | camelCase | `handleSubmit`, `isLoading` |
| Constants | SCREAMING_SNAKE_CASE | `ADD_CONTEXT_LOADING_MESSAGES` |

---

## 15. ✅ Checklist for New Features

Before submitting code, verify:

- [ ] Dual documentation header on every file (HUMAN + LLM descriptions)
- [ ] Feature folder follows standard structure
- [ ] `index.ts` only contains exports
- [ ] Types defined in `types.ts`
- [ ] Interfaces defined before components
- [ ] Early returns for loading/error/empty states
- [ ] Query hooks use proper naming: `{ data, isLoading, error }`
- [ ] Mutation hooks use renamed destructuring: `{ mutate: actionName, isPending: isActioning }`
- [ ] UI components from `@/shared/components/ui/*`
- [ ] Skeleton components match content structure
- [ ] Toast notifications for user feedback
- [ ] Motion animations include `willChange` optimization
- [ ] API routes use `wrapRouteHandler` pattern
- [ ] Supabase queries include `organisation_id` filter
- [ ] No inline Tailwind color classes (use CSS variables)
- [ ] No `any` types
- [ ] No unawaited async functions


Concise rules for building accessible, fast, delightful UIs Use MUST/SHOULD/NEVER to guide decisions

## Interactions

- Keyboard
  - MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
  - MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
  - MUST: Manage focus (trap, move, and return) per APG patterns
- Targets & input
  - MUST: Hit target ≥24px (mobile ≥44px) If visual <24px, expand hit area
  - MUST: Mobile `<input>` font-size ≥16px or set:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    ```
  - NEVER: Disable browser zoom
  - MUST: `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design
- Inputs & forms (behavior)
  - MUST: Hydration-safe inputs (no lost focus/value)
  - NEVER: Block paste in `<input>/<textarea>`
  - MUST: Loading buttons show spinner and keep original label
  - MUST: Enter submits focused text input In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
  - MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
  - MUST: Don’t block typing; accept free text and validate after
  - MUST: Allow submitting incomplete forms to surface validation
  - MUST: Errors inline next to fields; on submit, focus first error
  - MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
  - SHOULD: Disable spellcheck for emails/codes/usernames
  - SHOULD: Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
  - MUST: Warn on unsaved changes before navigation
  - MUST: Compatible with password managers & 2FA; allow pasting one-time codes
  - MUST: Trim values to handle text expansion trailing spaces
  - MUST: No dead zones on checkboxes/radios; label+control share one generous hit target
- State & navigation
  - MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels) Prefer libs like [nuqs](https://nuqs.dev)
  - MUST: Back/Forward restores scroll
  - MUST: Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)
- Feedback
  - SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
  - MUST: Confirm destructive actions or provide Undo window
  - MUST: Use polite `aria-live` for toasts/inline validation
  - SHOULD: Ellipsis (`…`) for options that open follow-ups (eg, "Rename…") and loading states (eg, "Loading…", "Saving…", "Generating…")
- Touch/drag/scroll
  - MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
  - MUST: Delay first tooltip in a group; subsequent peers no delay
  - MUST: Intentional `overscroll-behavior: contain` in modals/drawers
  - MUST: During drag, disable text selection and set `inert` on dragged element/containers
  - MUST: No “dead-looking” interactive zones—if it looks clickable, it is
- Autofocus
  - SHOULD: Autofocus on desktop when there’s a single primary input; rarely on mobile (to avoid layout shift)

## Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations are interruptible and input-driven (avoid autoplay)
- MUST: Correct `transform-origin` (motion starts where it “physically” should)

## Layout

- SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (use env(safe-area-inset-*))
- MUST: Avoid unwanted scrollbars; fix overflows

## Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (“ ”); avoid widows/orphans
- MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Don’t ship the schema—visuals may omit labels but accessible names still exist
- MUST: Use the ellipsis character `…` (not ``)
- MUST: `scroll-margin-top` on headings for anchored links; include a “Skip to content” link; hierarchical `<h1–h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers/currency
- MUST: Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- SHOULD: Right-clicking the nav logo surfaces brand assets
- MUST: Use non-breaking spaces to glue terms: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, `Vercel&nbsp;SDK`

## Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
- MUST: Mutations (`POST/PATCH/DELETE`) target <500 ms
- SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- MUST: Virtualize large lists (eg, `virtua`)
- MUST: Preload only above-the-fold images; lazy-load the rest
- MUST: Prevent CLS from images (explicit dimensions or reserved space)

## Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover/:active/:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid gradient banding (use masks when needed)


# :compass: Dashboard Style Guide

## This guide outlines best practices for building and maintaining scalable, readable, and maintainable features within the dashboard codebase.

## :repeat: General Coding Principles

- **Return early** from conditionals to reduce nesting and improve clarity.
- **Avoid wrapping complex logic** inside `if/else` blocks.
- **Use `assertNever`** in `switch` statements to enforce exhaustive checks on enums.
- **Never use `any`** — prefer strict types.
- **Avoid type casting** (`as`) unless absolutely necessary.
- **Never leave async functions unawaited** — no fire-and-forgets.
- **Do not nest custom React components** inline. Extract them to their own file if conditionally rendered.
- **Be cautious with `overflow` styles** — require a sanity check and a "Are you sure?" discussion before merging.

---

## :sparkles: Async API Queries and Mutations

- All asynchronous API calls should be handled through the useQuery and useMutation hooks by tanstack
- For queries, destructure and appropriately rename { data, isLoading, error }
- For mutations, destructure and appropriately rename { mutate, isPending, error }
  - (example): const { mutate: addMemory, isPending: isAddingMemory, error: addMemoryError } = useMutation(...)
- Make use of the `onSuccess`, `onError` and `onSettled` arguments to handle state updates and secondary actions
- API related hooks should ONLY contain API calls and their related state. UI state and secondary function calls should be handled in a different hook that consume this one
- Do NOT wrap API definitions inside of other function calls. Define first, then use later

## UI Components

- **Always** use our component library for standard components (e.g buttons, input, badge)
- When using standard components, use the variations for styling. Not inline styling.
- ## If no variations are appropriate, create a new variation that can be re-used

## UI Components

- **Always** use our component library for standard components (e.g buttons, input, badge)
- When using standard components, use the variations for styling. Not inline styling.
- ## If no variations are appropriate, create a new variation that can be re-used

## 📋 Forms

We are using `react-hook-form` and `{ Controller, useForm }` to managae forms
They should be used for all forms EXCEPT for the live tip tap editor

---

## :sparkles: Code Consistency

1. Prefer **arrow functions** over function declarations.
2. Prefer **`const`** over `let` whenever possible.
3. Prefer use of `@/shared/components/ui` for standard html components like Button and Input

---

## :art: Colours

- :x: Do **not** use Tailwind inline utility color classes like `text-gray-600` or `bg-blue-100`.
- :white_check_mark: Instead, use semantic variables defined in `global.css` combined with Tailwind `\xx` opacity modifiers for variations.

---

## :motorway: Pages Convention

- `page.tsx` files should remain minimal.
- They define **route structure only** and delegate all logic to internal feature components.

---

## :page_facing_up: Maintaining Docs

- If any new features are introduced, or existing functionality has changed. Have the docs been updated?
- If in doubt, leave a comment asking the user to update the docs

---

## :brain: State Management Strategy

State can be managed at four levels, increasing in complexity. Choose the simplest option that works, and scale only when necessary.
| Case | Pattern |
|---------------------------------|---------------------------------|
| Small, self-contained logic | Component-level state |
| Growing complexity | `useX` hook in `/hooks/` |
| Shared across many components | Context Provider in `/context/` |
| Shared globally, persists across| Redux Store /shared/state/ |
| routes, used by many features | |
⸻
:beverage_box: When to Use Redux
:white_check_mark: Use Redux when:
• The state spans multiple features or routes.
• You need to persist and rehydrate state across page loads (e.g., onboarding flows, auth tokens).
• Complex logic benefits from action-based updates and centralized debugging (e.g., Redux DevTools).
• There’s clear benefit from selectors, memoization, or middleware (e.g., logging, async queues).
:no_entry_sign: Avoid Redux when:
• You’re managing isolated local state that doesn’t need to persist across navigation.
• A useState or Context would suffice — don’t reach for Redux too early.
:brain: Default to simpler patterns. Elevate to Redux only when the state demands cross-feature coordination, persistence, or middleware.
⸻
:arrows_counterclockwise: Bridging Redux with Feature Structure
• When a Redux slice only supports a single feature, co-locate it within that feature (e.g. /features/onboarding/state/onboardingSlice.ts).
• If shared across the app, place it in /shared/state/slices/.

> :white_check_mark: Leave comments or suggestions if a pattern feels misused.

---

## :package: File Structure & Boundaries

### 1. **Feature-Oriented Foldering**

Each feature lives in its own folder:
/features/
components/
modals/
hooks/
context/
utils/
index.ts ← Public API

> Keep all logic encapsulated unless intentionally shared.

---

### 2. **Import Boundaries**

Use `index.ts` for public exports. Avoid deep imports.
:white_check_mark: Correct:

```ts
import { OnboardingModal } from '@/features/onboarding'
:x: Incorrect:
import { OnboardingModal } from '@/features/onboarding/modals/OnboardingModal'
⸻
### 3. Component Structure
For large components, split into a dedicated folder:
/components/FlowWizard/
  index.tsx
  StepOne.tsx
  StepTwo.tsx
  useFlowLogic.ts
  types.ts
  utils.ts
Only expose index.tsx to the outside world.
⸻
### 4. Custom Hooks
	•	Scoped to one feature → /features/<x>/hooks/useThing.ts
	•	Shared globally → /shared/hooks/useThing.ts
:white_check_mark: Use clear naming: useX, useXState, useXEffect, etc.
⸻
### 5. Context Providers
	•	Local to feature → /features/<x>/context/
	•	App-wide → /shared/context/ or /app/providers.tsx
Wrap global providers in an <AppProviders> root.
⸻
### 6. When to Create a Folder
Criteria	Create Folder
More than 1 component	components/
More than 1 modal	modals/
More than 1 custom hook	hooks/
Local shared context needed	context/
Helpers reused internally	utils/
⸻
### 7. Component Size Guidelines
Condition	Action
> 300 lines	Split logic/view
Complex children	Create subcomponent folder
Potential reuse	Move to /shared/components/
⸻
### 8. Naming Conventions
	•	:file_folder: Folders/Files → kebab-case
	•	:jigsaw: Components/Types → PascalCase
	•	:brain: Variables/functions → camelCase
Always match file name with exported component.
⸻
# API Styles and Guide
:gear: API Routes Convention
1. Handler Wrapping
All route functions should use the shared wrapper for consistency and dependency injection.
import { CoreDependencies, RouteContext, wrapRouteHandler } from '@/shared/utils/server/wrap-route-handler';
export const POST = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, handle{{DescriptiveFunctionName}});
};
const handle{{DescriptiveFunctionName}} =
  (dependencies: CoreDependencies) =>
  async (request: NextRequest, context: RouteContext): Promise<NextResponse | ServiceError> => {
    const { supabase, organisationId, profile, user } = dependencies;
    // your logic here
  }
⸻
2. Standard Error Handling
Use shared errors instead of raw HTTP responses:
import {
  BadRequestError,
  ServiceError,
  UnknownServerError,
} from '@/shared/utils/server/errors';
if (!content) return new BadRequestError({ message: 'Missing content' });
if (errorFromApi) return new UnknownServerError({ message: error });

⸻

3. Route Folder Structure

Each route should follow this structure:
/api/feature-name/
  route.ts      → high-level orchestration
  service.ts    → business logic
  supabase.ts   → typed Supabase calls (no DB logic in route or service)
  types.ts      → route-specific shared types (if many)

Conditional logic should be handled in the service file not the supabase file.
Supabase file is exclusively handling the DB interaction.
Only bother with a types file if there > 3 types. Otherwise define them where they are first used

⸻

4. Database Types

All supabase interactions should be single function calls.
EVERY single call must include: `.eq('organisation_id', organisationId)`
They should always return the Database typed version.

Eg
If the call looks like this:
```

const { data } = await supabase
.from('flow_versions')
.select('content, created_at, flow_id, flow_version_id')

```
Then the type looks like this:
```

export type FlowVersionRow = Pick<
Database['public']['Tables']['flow_versions']['Row'],
| 'content'
| 'created_at'
| 'flow_id'
| 'flow_version_id'

> ;

```
Define the type ONCE and reuse in frontend and API. Don't redefine the same type multiple times

⸻
🚫 Avoid
	•	Deep-importing other features’ internals.
	•	Over-abstracting too early.
	•	Mixing logic and view in one monolithic file.
```

# Unix Design Philosophy

## Summary
This rule enforces the Unix design philosophy in all code contributions. Code should embody simplicity, composability, and clarity. Every function, class, or module should be designed to **do one thing well**, avoid unnecessary complexity, and enable composition with other tools.

## Rules
- **Do One Thing Well**  
  - Each program, function, or module should have a single responsibility.  
  - Split responsibilities into separate functions or files if they diverge.  

- **Write for Composition**  
  - Design outputs so they can be easily consumed by other parts of the system.  
  - Prefer return values, streams, or simple data structures over side effects.  

- **Clarity over Cleverness**  
  - Prioritize readable and maintainable code.  
  - Avoid unnecessary abstractions or "magic."  

- **Small, Focused Interfaces**  
  - Expose minimal, clear APIs.  
  - Prefer a few small, predictable functions over large, sprawling ones.  

- **Text as a Universal Interface**  
  - Favor plain text or widely supported formats (JSON, CSV, YAML) for data exchange.  
  - Avoid proprietary formats unless absolutely necessary.  

- **Silence is Golden**  
  - Functions should not log or print unless explicitly required.  
  - Errors and warnings should be meaningful and actionable.  

- **Build from Simple Tools**  
  - Prefer combining simple building blocks over writing monolithic code.  
  - Encourage reusability across different contexts.  

## When in Doubt
- Ask: *“Does this do one thing well?”*  
- If not, refactor into smaller parts.  
- If still uncertain, lean toward simplicity and clarity.  
