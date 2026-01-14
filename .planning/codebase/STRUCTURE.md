# Codebase Structure

**Analysis Date:** 2026-01-14

## Directory Layout

```
sammy-analytics/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Global shared components
│   └── ui/                # shadcn/ui library
├── features/               # Feature modules
│   ├── analysis/          # Analysis feature
│   ├── conflicts/         # Conflicts feature
│   ├── diffs/             # Diffs feature
│   ├── overview/          # Overview feature
│   ├── team/              # Team feature
│   └── web-sources/       # Web sources feature
├── hooks/                  # Global custom hooks
├── lib/                    # Utilities & constants
├── shared/                 # Cross-cutting shared code
│   ├── lib/               # API client, query hooks
│   └── utils/             # Server utilities
├── public/                 # Static assets
│   └── assets/            # Images
├── worktrial/              # Project rules & guidelines
│   └── rules/             # Coding standards docs
└── .planning/              # Planning documents
    └── codebase/          # Codebase analysis
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Pages, layouts, API route handlers
- Key files: `layout.tsx`, `dashboard/page.tsx`
- Subdirectories: `api/` (server routes), `dashboard/` (main page)

**app/api/**
- Purpose: REST API endpoints
- Contains: Route handlers and services per domain
- Structure: `{domain}/{endpoint}/route.ts`, `{domain}/{endpoint}/service.ts`
- Domains: `analysis/`, `conflicts/`, `diffs/`, `team/`, `web-sources/`

**components/**
- Purpose: Global shared React components
- Contains: Dashboard components, navigation, data display
- Key files: `dashboard-tabs.tsx`, `app-sidebar.tsx`, `data-table.tsx`
- Subdirectories: `ui/` (shadcn/ui library)

**components/ui/**
- Purpose: shadcn/ui component library
- Contains: 30+ UI primitives (Button, Card, Dialog, etc.)
- Source: Generated via shadcn CLI
- Usage: Import via `@/components/ui/*`

**features/**
- Purpose: Domain feature modules
- Contains: Feature-specific components, hooks, data, types
- Pattern: Each feature has `index.ts` public API
- Structure per feature:
  ```
  features/{name}/
  ├── index.ts           # Public exports
  ├── types.ts           # Type definitions
  ├── components/        # Feature UI
  ├── hooks/             # Data fetching
  └── data/              # Mock data
  ```

**hooks/**
- Purpose: Global custom hooks
- Contains: Cross-feature hooks
- Key files: `use-tab-state.ts` (tab persistence)

**lib/**
- Purpose: Global utilities and constants
- Contains: Helpers, configuration
- Key files: `constants.ts` (tabs, assets), `utils.ts` (cn helper)

**shared/**
- Purpose: Cross-cutting shared code
- Contains: API client, query hooks, server utilities

**shared/lib/**
- Purpose: Client-side shared libraries
- Key files:
  - `api-client.ts` - HTTP fetch wrapper
  - `api-endpoints.ts` - Type-safe endpoint mapping
  - `use-api-query.ts` - TanStack Query wrapper

**shared/utils/server/**
- Purpose: Server-side utilities
- Key files:
  - `wrap-route-handler.ts` - Dependency injection
  - `errors.ts` - ServiceError classes

**worktrial/rules/**
- Purpose: Project coding standards documentation
- Contains: Style guides, patterns, review checklists
- Key files:
  - `create-feature.md` - Feature creation guide
  - `dashboard-coding-standards.mdc`
  - `pr-review-dashboard.md` - Review checklist

## Key File Locations

**Entry Points:**
- `app/layout.tsx` - Root layout with providers
- `app/dashboard/page.tsx` - Main dashboard entry
- `app/page.tsx` - Home page (empty)

**Configuration:**
- `tsconfig.json` - TypeScript config
- `next.config.ts` - Next.js config
- `postcss.config.mjs` - PostCSS/Tailwind config
- `eslint.config.mjs` - ESLint config
- `components.json` - shadcn/ui config

**Core Logic:**
- `components/dashboard-tabs.tsx` - Tab routing
- `shared/lib/use-api-query.ts` - Data fetching
- `shared/utils/server/wrap-route-handler.ts` - API DI

**Testing:**
- Not configured - No test files present

**Documentation:**
- `CLAUDE.md` - AI assistant instructions
- `worktrial/rules/*.md` - Coding standards

## Naming Conventions

**Files:**
- kebab-case for all files: `analysis-content.tsx`
- `use-*.ts` for hook files: `use-fetch-analysis.ts`
- `mock.*.data.ts` for mock data: `mock.analysis.data.ts`
- `*-skeleton.tsx` for loading states: `analysis-skeleton.tsx`

**Directories:**
- kebab-case: `web-sources/`
- Plural for collections: `components/`, `hooks/`, `features/`

**Special Patterns:**
- `index.ts` for public API exports
- `types.ts` for type definitions
- `route.ts` for API handlers
- `service.ts` for business logic

## Where to Add New Code

**New Feature:**
- Primary code: `features/{feature-name}/`
- Create: `index.ts`, `types.ts`, `components/`, `hooks/`, `data/`
- Export via: `features/{feature-name}/index.ts`

**New Component:**
- Global: `components/{component-name}.tsx`
- Feature-specific: `features/{feature}/components/{name}.tsx`
- Skeleton: Same location with `-skeleton.tsx` suffix

**New API Route:**
- Definition: `app/api/{domain}/{endpoint}/route.ts`
- Service: `app/api/{domain}/{endpoint}/service.ts`
- Add endpoint: `shared/lib/api-endpoints.ts`

**New Hook:**
- Global: `hooks/use-{name}.ts`
- Feature: `features/{feature}/hooks/use-{name}.ts`
- Query: `use-fetch-{entity}.ts`
- Mutation: `use-{action}-{entity}.ts`

**Utilities:**
- Shared client: `shared/lib/{name}.ts`
- Server: `shared/utils/server/{name}.ts`
- General: `lib/{name}.ts`

## Special Directories

**.planning/**
- Purpose: Project planning documents
- Source: Generated by GSD commands
- Committed: Yes

**worktrial/**
- Purpose: Project rules and guidelines
- Source: Manual documentation
- Committed: Yes

**node_modules/**
- Purpose: Dependencies
- Source: pnpm install
- Committed: No (.gitignore)

---

*Structure analysis: 2026-01-14*
*Update when directory structure changes*
