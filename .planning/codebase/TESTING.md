# Testing Patterns

**Analysis Date:** 2026-01-14

## Test Framework

**Runner:**
- Not configured - No testing framework installed

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test commands configured
npm run lint      # Only linting available
```

## Test File Organization

**Location:**
- No test files exist
- Recommended: `*.test.ts` co-located with source

**Naming:**
- No tests present
- Convention would be: `{module}.test.ts`

**Structure:**
- No test directories
- No `__tests__/` folders
- No `tests/` directory

## Test Structure

**Suite Organization:**
- Not applicable (no tests)

**Recommended Pattern:**
```typescript
import { describe, it, expect, beforeEach, vi } from "vitest"

describe("ModuleName", () => {
  describe("functionName", () => {
    beforeEach(() => {
      // reset state
    })

    it("should handle valid input", () => {
      // arrange
      const input = createTestInput()

      // act
      const result = functionName(input)

      // assert
      expect(result).toEqual(expectedOutput)
    })
  })
})
```

## Mocking

**Framework:**
- Not configured

**Recommended Approach:**
- Vitest built-in mocking (vi)
- Mock external dependencies (API calls, services)

**What to Mock:**
- API client (`shared/lib/api-client.ts`)
- External services
- TanStack Query

**What NOT to Mock:**
- Pure utility functions
- Simple helpers

## Fixtures and Factories

**Test Data:**
- Mock data exists in `features/*/data/mock.*.data.ts`
- These can be reused for testing

**Location:**
- Mock data: `features/{feature}/data/mock.{entity}.data.ts`
- Test fixtures would go: `features/{feature}/__tests__/fixtures/`

## Coverage

**Requirements:**
- None defined - No coverage tooling

**Configuration:**
- Not configured

## Test Types

**Unit Tests:**
- Not implemented
- Candidates: Service functions, hooks, utilities

**Integration Tests:**
- Not implemented
- Candidates: API routes, feature flows

**E2E Tests:**
- Not implemented
- Candidate tool: Playwright

## Current Quality Practices

**Type Safety (Active):**
- TypeScript strict mode enforces types
- No `any` allowed per coding standards
- Compilation catches type errors

**Linting (Active):**
- ESLint with Next.js presets
- Run: `npm run lint`

**Code Review (Active):**
- PR review checklist: `worktrial/rules/pr-review-dashboard.md`
- Manual testing in browser

## Testable Architecture

The codebase is designed for testability:

**Separated Concerns:**
- API Layer: `shared/lib/use-api-query.ts`
- Endpoint Mapping: `shared/lib/api-endpoints.ts`
- Service Layer: `app/api/*/*/service.ts`
- Data Layer: `features/*/data/mock.*.data.ts`

**Dependency Injection:**
```typescript
// Service functions take dependencies
const handleFetch = (dependencies: CoreDependencies) =>
  async (request: NextRequest) => { /* handler */ }
```

**Hook-Based Fetching:**
- All queries use `useApiQuery` wrapper
- Easy to mock React Query in tests

## Recommended Testing Setup

**Framework:** Vitest (fast, TypeScript-first)

**Dependencies to add:**
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
})
```

**High-Priority Test Candidates:**

1. **Query Hooks** (`features/*/hooks/use-fetch-*.ts`)
   - Easy to test with mocked React Query
   - Critical data path

2. **Service Functions** (`app/api/*/*/service.ts`)
   - Pure functions, deterministic
   - Core business logic

3. **Utility Functions** (`lib/utils.ts`, `shared/lib/*`)
   - Simple to test
   - High reuse

4. **API Routes** (`app/api/*/*/route.ts`)
   - Error handling paths
   - Input validation

---

*Testing analysis: 2026-01-14*
*Update when test patterns change*
