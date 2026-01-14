# Architecture

**Analysis Date:** 2026-01-14

## Pattern Overview

**Overall:** Next.js Full-Stack Feature-Based Architecture

**Key Characteristics:**
- Monolithic frontend-focused application
- Feature-based folder structure with explicit public APIs
- Layered architecture with clear separation
- Mock data layer ready for real backend integration
- Strong module boundaries via `index.ts` exports

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Contains: React components, shadcn/ui library, charts
- Location: `components/*`, `features/*/components/*`
- Depends on: State management layer, shared utilities
- Used by: Next.js pages

**State Management Layer:**
- Purpose: Data fetching, caching, and state
- Contains: TanStack Query hooks, custom hooks
- Location: `hooks/*`, `shared/lib/*`, `features/*/hooks/*`
- Depends on: API client layer
- Used by: Presentation layer

**API Client Layer:**
- Purpose: HTTP communication with type safety
- Contains: Fetch wrapper, endpoint mapping
- Location: `shared/lib/api-client.ts`, `shared/lib/api-endpoints.ts`
- Depends on: Browser fetch API
- Used by: State management layer

**API Route Layer:**
- Purpose: Server-side request handling
- Contains: Route handlers, services
- Location: `app/api/*/*/route.ts`, `app/api/*/*/service.ts`
- Depends on: Data layer, shared utilities
- Used by: External HTTP requests

**Data Layer:**
- Purpose: Data access and mock providers
- Contains: Mock data files
- Location: `features/*/data/mock.*.data.ts`
- Depends on: Nothing (leaf layer)
- Used by: Service layer

**Shared Utilities:**
- Purpose: Cross-cutting concerns
- Contains: DI wrapper, error classes, helpers
- Location: `shared/utils/*`, `lib/*`
- Depends on: Nothing
- Used by: All layers

## Data Flow

**Client-Side Data Flow:**

1. UI Component renders
2. Feature Hook invoked (e.g., `useFetchAnalysisOverview`)
3. `useApiQuery<E>` wrapper called
4. `fetchApi<T>` executes HTTP GET
5. Response cached in TanStack Query
6. Component re-renders with `{ data, isLoading, error }`

**Server-Side Request Lifecycle:**

1. GET `/api/analysis/overview` received
2. `wrapRouteHandler` injects `CoreDependencies`
3. Service function called with dependencies
4. Mock data fetched from feature data files
5. `NextResponse.json()` returned

**State Management:**
- Client-side caching via TanStack Query (60s staleTime)
- Tab state persisted to localStorage (`hooks/use-tab-state.ts`)
- No global state management (Redux not needed)

## Key Abstractions

**Feature Module:**
- Purpose: Domain-specific functionality encapsulation
- Examples: `features/analysis/`, `features/conflicts/`, `features/team/`
- Pattern: Public API via `index.ts`, internal implementation hidden
- Contains: components, hooks, data, types

**Service Function:**
- Purpose: Business logic with dependency injection
- Examples: `getAnalysisOverview(deps)`, `getConflictsOverview(deps)`
- Pattern: Curried function taking `CoreDependencies`
- Location: `app/api/*/*/service.ts`

**Query Hook:**
- Purpose: Type-safe data fetching
- Examples: `useFetchAnalysisOverview`, `useFetchDailyConflicts`
- Pattern: Thin wrapper around `useApiQuery`
- Location: `features/*/hooks/use-fetch-*.ts`

**API Endpoint:**
- Purpose: Type-safe endpoint mapping
- Examples: `API_ENDPOINTS.analysis.overview`
- Pattern: Const object with TypeScript inference
- Location: `shared/lib/api-endpoints.ts`

## Entry Points

**Application Entry:**
- Location: `app/layout.tsx`
- Triggers: Page load
- Responsibilities: Provider setup (QueryProvider, ThemeProvider)

**Dashboard Entry:**
- Location: `app/dashboard/page.tsx`
- Triggers: `/dashboard` route
- Responsibilities: Render `<DashboardTabs />`

**API Entries:**
- Location: `app/api/{domain}/{endpoint}/route.ts`
- Triggers: HTTP requests to `/api/*`
- Responsibilities: Handle requests, call services, return JSON

## Error Handling

**Strategy:** Throw errors at service level, catch at route handler

**Patterns:**
- Services return `Promise<T | ServiceError>`
- Route handlers check for `statusCode` property
- `ServiceError` base class with subclasses:
  - `BadRequestError` (400)
  - `UnknownServerError` (500)

**Error Classes:**
- Location: `shared/utils/server/errors.ts`
- Pattern: All errors have `toResponse()` method

## Cross-Cutting Concerns

**Logging:**
- Console only in development
- No structured logging service

**Validation:**
- Zod schemas for form data (`components/data-table.tsx`)
- No API response validation (mock data trusted)

**Authentication:**
- Not implemented
- `wrapRouteHandler` mocks user/profile data

**Theming:**
- next-themes for dark mode
- CSS variables in `globals.css`

---

*Architecture analysis: 2026-01-14*
*Update when major patterns change*
