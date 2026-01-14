# Codebase Concerns

**Analysis Date:** 2026-01-14

## Tech Debt

**`any` Types in Dependency Injection:**
- Issue: Three dependencies use `any` type in wrap-route-handler
- Files: `shared/utils/server/wrap-route-handler.ts`
- Why: Supabase client types not yet available
- Impact: Reduced type safety in API routes
- Fix approach: Replace with proper Supabase types when client is configured

**Uncontrolled Form Inputs:**
- Issue: Form inputs in data table use `defaultValue` without state management
- Files: `components/data-table.tsx`
- Why: Placeholder implementation for UI demo
- Impact: User edits not captured or submitted
- Fix approach: Add React Hook Form or controlled state management

## Known Bugs

**Division by Zero Risk:**
- Symptoms: Could display `Infinity` or `NaN` in UI
- Trigger: Empty data arrays or zero totals
- Files:
  - `features/analysis/components/analysis-content.tsx` (line ~59, ~69)
  - `features/team/components/review-trends-chart.tsx` (line ~74, ~79, ~86)
- Workaround: Mock data always has non-zero values
- Root cause: Missing guards before division operations
- Fix: Add zero-checks: `const rate = total > 0 ? (part / total) * 100 : 0`

**Incomplete Form Submissions:**
- Symptoms: Toast shows "Done" but no data captured
- Trigger: Submit form in data table drawer
- Files: `components/data-table.tsx` (lines ~208-216, ~233-241)
- Workaround: None - data is lost
- Root cause: Form handler captures event but not field values

## Security Considerations

**No Authentication:**
- Risk: API routes accessible without auth
- Files: All routes in `app/api/`
- Current mitigation: Mock data only, no sensitive information
- Recommendations: Implement Supabase Auth before real data integration

**Hardcoded Mock IDs:**
- Risk: Predictable mock identifiers
- Files: `shared/utils/server/wrap-route-handler.ts`
- Current mitigation: Development only, no production deployment
- Recommendations: Replace with real auth when ready

## Performance Bottlenecks

**No Performance Issues Detected:**
- Mock data returns instantly (150ms artificial delay)
- TanStack Query caching works correctly
- No N+1 patterns (all data pre-assembled)

**Future Concern - Chart Re-renders:**
- Problem: Charts may re-render unnecessarily
- Measurement: Not measured (mock data)
- Cause: Props changes triggering full re-renders
- Improvement path: Memoize chart data with useMemo

## Fragile Areas

**Data Table Component:**
- Files: `components/data-table.tsx` (807 lines)
- Why fragile: Large file with many interconnected features (DnD, forms, toasts)
- Common failures: Form state not syncing with table state
- Safe modification: Extract drawer form into separate component
- Test coverage: None - manually test all interactions

**Endpoint Type Mapping:**
- Files: `shared/lib/api-endpoints.ts`
- Why fragile: Manual type mapping between endpoints and responses
- Common failures: Adding endpoint without updating `ApiEndpointMap`
- Safe modification: Add tests verifying type inference

## Scaling Limits

**Mock Data Only:**
- Current capacity: Unlimited (static data)
- Limit: Cannot handle real data volumes
- Symptoms at limit: N/A
- Scaling path: Implement real Supabase backend

## Dependencies at Risk

**No High-Risk Dependencies:**
- All major dependencies actively maintained
- Next.js 16, React 19, TanStack Query 5 are current versions

## Missing Critical Features

**No Testing Framework:**
- Problem: No automated tests configured
- Current workaround: Manual testing, TypeScript type checking
- Blocks: Cannot verify regressions, difficult CI/CD
- Implementation complexity: Low (add Vitest + React Testing Library)

**No Authentication:**
- Problem: No user authentication or authorization
- Current workaround: Mock user in wrapRouteHandler
- Blocks: Cannot deploy with real data
- Implementation complexity: Medium (Supabase Auth integration)

**Form Data Capture:**
- Problem: Data table inline edits not captured
- Current workaround: None
- Blocks: Cannot save user modifications
- Implementation complexity: Low (add controlled inputs + mutation)

## Test Coverage Gaps

**All Code Untested:**
- What's not tested: Everything - no tests exist
- Risk: Regressions undetected
- Priority: Medium (mock dashboard, no production use)
- Difficulty to test: Low - architecture supports testing

**High-Priority Test Candidates:**
1. Query hooks (`features/*/hooks/use-fetch-*.ts`) - Critical path
2. Service functions (`app/api/*/*/service.ts`) - Business logic
3. Error handling (`shared/utils/server/errors.ts`) - Edge cases

## Positive Findings

The codebase is generally clean:

- No TODO/FIXME comments found
- Proper error handling infrastructure exists
- Strong TypeScript types throughout
- Consistent component patterns
- Good separation of concerns
- Accessibility considerations present
- Early returns reduce nesting

---

*Concerns audit: 2026-01-14*
*Update as issues are fixed or new ones discovered*
