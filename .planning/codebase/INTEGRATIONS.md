# External Integrations

**Analysis Date:** 2026-01-14

## APIs & External Services

**Payment Processing:**
- Not detected - No payment integration

**Email/SMS:**
- Not detected - No email service

**External APIs:**
- Not detected - All data is mocked internally

## Data Storage

**Databases:**
- Not configured - Mock data only
- Future: Supabase (dependency injection ready via `shared/utils/server/wrap-route-handler.ts`)
- `CoreDependencies` interface includes `supabase` placeholder

**File Storage:**
- Not detected - No cloud storage

**Caching:**
- Client-side only via TanStack Query staleTime (60s default)
- No Redis or server-side caching

## Authentication & Identity

**Auth Provider:**
- Not configured - Mock user in `wrapRouteHandler`
- Mock profile: `{ id: "mock-profile-id" }` (`shared/utils/server/wrap-route-handler.ts`)
- Mock user: `{ id: "mock-user-id" }`
- Future: Supabase Auth (infrastructure ready)

**OAuth Integrations:**
- Not detected

## Monitoring & Observability

**Error Tracking:**
- Not configured - No Sentry/error service

**Analytics:**
- Not detected - No product analytics

**Logs:**
- Console only (stdout in development)

## CI/CD & Deployment

**Hosting:**
- Vercel - Implied by Next.js (not explicitly configured)

**CI Pipeline:**
- Not configured - No GitHub Actions workflows

## Environment Configuration

**Development:**
- No environment variables required
- All data mocked in `features/*/data/mock.*.data.ts`
- `organisationId: "mock-org-id"` hardcoded

**Staging:**
- Not applicable

**Production:**
- Not deployed - Mock dashboard only

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Internal API Routes (Mock Data)

All API routes return mock data from feature-level data files:

**Analysis:**
- `/api/analysis/overview` - `app/api/analysis/overview/route.ts`
- `/api/analysis/daily` - `app/api/analysis/daily/route.ts`

**Conflicts:**
- `/api/conflicts/overview` - `app/api/conflicts/overview/route.ts`
- `/api/conflicts/daily` - `app/api/conflicts/daily/route.ts`
- `/api/conflicts/activity` - `app/api/conflicts/activity/route.ts`

**Diffs:**
- `/api/diffs/overview` - `app/api/diffs/overview/route.ts`
- `/api/diffs/daily` - `app/api/diffs/daily/route.ts`
- `/api/diffs/weekly` - `app/api/diffs/weekly/route.ts`

**Team:**
- `/api/team/overview` - `app/api/team/overview/route.ts`
- `/api/team/activity` - `app/api/team/activity/route.ts`

**Web Sources:**
- `/api/web-sources/overview` - `app/api/web-sources/overview/route.ts`
- `/api/web-sources/daily` - `app/api/web-sources/daily/route.ts`

## API Client Architecture

**Client-Side:**
- `shared/lib/api-client.ts` - Generic `fetchApi()` wrapper
- `shared/lib/api-endpoints.ts` - Type-safe endpoint mapping
- `shared/lib/use-api-query.ts` - TanStack Query wrapper

**Server-Side:**
- `shared/utils/server/wrap-route-handler.ts` - Dependency injection
- `shared/utils/server/errors.ts` - ServiceError hierarchy (BadRequestError, UnknownServerError)

---

*Integration audit: 2026-01-14*
*Update when adding/removing external services*
