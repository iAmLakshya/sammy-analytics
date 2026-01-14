# Technology Stack

**Analysis Date:** 2026-01-14

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`package.json`, `tsconfig.json`)

**Secondary:**
- JavaScript - Build scripts, config files (`.mjs` configs)

## Runtime

**Environment:**
- Node.js - Implied through Next.js 16.1.1
- No `.nvmrc` or `engines` field specified

**Package Manager:**
- pnpm - `pnpm-lock.yaml` present
- Lockfile: `pnpm-lock.yaml`

## Frameworks

**Core:**
- Next.js 16.1.1 - App Router, API routes (`package.json`)
- React 19.2.3 - UI framework (`package.json`)
- React DOM 19.2.3 - DOM rendering (`package.json`)

**Testing:**
- Not configured - No test framework in `package.json`

**Build/Dev:**
- TypeScript 5.9.3 - Type checking (`tsconfig.json`)
- PostCSS - CSS processing (`postcss.config.mjs`)
- ESLint 9 - Code linting (`eslint.config.mjs`)
- Tailwind CSS 4 - Utility-first CSS (`postcss.config.mjs`)

## Key Dependencies

**Critical:**
- @tanstack/react-query 5.90.16 - Data fetching and caching (`shared/lib/use-api-query.ts`)
- @tanstack/react-table 8.21.3 - Data table components (`components/data-table.tsx`)
- recharts 2.15.4 - Chart library (`features/*/components/*-chart.tsx`)
- zod 4.3.5 - Schema validation (`components/data-table.tsx`)

**UI Components:**
- @radix-ui/* - Base component primitives (avatar, checkbox, dialog, dropdown-menu, etc.)
- class-variance-authority 0.7.1 - Component variants
- clsx 2.1.1 - Class name utility
- tailwind-merge 3.4.0 - Tailwind class merging
- lucide-react 0.562.0 - Icon library
- @tabler/icons-react 3.36.1 - Additional icons (`lib/constants.ts`)

**Animation:**
- motion/react - Animation library (per `CLAUDE.md`, not framer-motion)

**UI Feedback:**
- sonner 2.0.7 - Toast notifications (`components/ui/sonner.tsx`)
- next-themes 0.4.6 - Dark mode support (`components/theme-provider.tsx`)

**Drag & Drop:**
- @dnd-kit/core 6.3.1 - Drag-and-drop
- @dnd-kit/sortable 10.0.0 - Sortable lists
- @dnd-kit/modifiers 9.0.0 - DnD modifiers

**Infrastructure:**
- vaul 1.1.2 - Dialog/drawer management

## Configuration

**Environment:**
- No `.env` files detected
- Configuration via hardcoded defaults (mock data)
- Future: Environment variables for Supabase, etc.

**Build:**
- `tsconfig.json` - TypeScript strict mode, ES2017 target, `@/*` path alias
- `next.config.ts` - Minimal Next.js configuration
- `postcss.config.mjs` - Tailwind CSS 4 plugin
- `eslint.config.mjs` - ESLint 9 flat config with Next.js presets
- `components.json` - shadcn/ui configuration

## Platform Requirements

**Development:**
- Any platform with Node.js
- pnpm required for dependency management
- No Docker or external services required (mock data)

**Production:**
- Vercel - Implied by Next.js best practices
- No explicit deployment configuration yet

---

*Stack analysis: 2026-01-14*
*Update after major dependency changes*
