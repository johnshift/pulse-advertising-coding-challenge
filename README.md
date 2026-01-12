# Pulse Advertising - Coding Challenge

A Social Media Analytics Dashboard built with Next.js, Supabase, and TanStack Query.

## Live Demo

🔗 [View Live Demo](https://pulse-advertising-coding-challenge.vercel.app)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Global State**: Zustand
- **Server State**: TanStack Query
- **Table**: TanStack Table
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Validation**: Zod
- **Testing**: Vitest, React Testing Library
- **E2E**: Cypress
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+
- pnpm

### 1. Clone and Install

```bash
git clone https://github.com/johnshift/pulse-advertising-coding-challenge
cd pulse-advertising-coding-challenge
pnpm install
```

### 2. Database Setup

If using local Supabase:

```bash
npx supabase start
npx supabase db reset  # Runs migrations + seed
```

If using Supabase hosted:

```bash
npx supabase link --project-ref <project-id>
npx supabase db push
```

### 3. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

> **Note**: Only `NEXT_PUBLIC_*` variables are exposed to the browser. The service role key is never used in this project to avoid client-side exposure.

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login

Seeded accounts are available for testing:

- `demo1@example.com`
- `demo2@example.com`

Default password: `password123`

## Architecture Decisions & Trade-offs

<details>
<summary><strong>1. Where should engagement metrics be aggregated?</strong></summary>

### Decision: API Route Aggregation

I chose to aggregate engagement metrics in the **Next.js API Route** (`/api/analytics/summary`). The server fetches raw data from Supabase, computes the aggregations (total engagement, average rate, top post, trend), and returns a pre-computed summary to the client.

### Why This Approach

**Separation of concerns**: The client remains a "dumb" renderer. Business logic for what constitutes "engagement" or how trends are calculated lives in one place, making it easier to modify without touching UI components.

**Security**: Aggregation happens server-side where the user session is validated. The client never receives raw post data it doesn't need for display, reducing exposure surface.

**Payload efficiency**: Instead of sending all posts to the client and computing there, the API returns a small JSON object (~200 bytes) regardless of how many posts exist.

### Trade-offs

| Consideration            | API Route (chosen)                                         | Database                                            | Client-side                                 |
| ------------------------ | ---------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| **Performance at scale** | Fetches all rows to compute (inefficient at 10,000+ posts) | Best: aggregation is optimized at the data layer    | Worst: transfers all data over the network  |
| **Caching granularity**  | TanStack Query caches the whole summary                    | Can use materialized views for pre-computed results | Can reuse already-fetched post data         |
| **Complexity**           | Moderate: dedicated route with validation                  | Higher: requires DB expertise and migrations        | Lower: but scatters logic across components |

### What I'd Change at Scale

For a production dashboard with thousands of posts per user, I would move heavy aggregations to the database layer. Postgres is optimized for `SUM()`, `AVG()`, and window functions: it can aggregate 100,000 rows faster than fetching them to a Node.js runtime.

The API route would then become a thin proxy: validate auth, call the database function, return the result. This preserves the clean client/server separation while leveraging database performance.

For this challenge, the dataset is small (~20 posts, 60 days of metrics), so the overhead of JS aggregation is negligible and the trade-off favors maintainability.

</details>

<details>
<summary><strong>2. What data should live in Zustand vs. TanStack Query vs. URL state?</strong></summary>

### Decision: Three-Tier State Separation

| State                                    | Location       | Rationale                                               |
| ---------------------------------------- | -------------- | ------------------------------------------------------- |
| Posts, daily metrics, summary            | TanStack Query | Server-owned data with caching and background refetch   |
| Platform filter, sorting, pagination     | Zustand        | Shared across toolbar, columns, and pagination controls |
| Selected post, modal open state          | Zustand        | Accessed by table rows and dialog component             |
| Chart type, time range, metric selection | React useState | Component-scoped; no cross-component dependencies       |

### Why This Approach

**TanStack Query for server state**: Provides automatic caching and request deduplication. Query keys encode the full filter state, so revisiting a previous filter combination serves from cache instantly.

**Zustand for shared UI state**: Multiple components (toolbar, column headers, pagination) need synchronized access to the same filter state. Zustand enables atomic updates like resetting pagination when filters change.

**React useState for chart controls**: These only affect the chart component. Resetting to defaults on remount is acceptable UX, and not every piece of state needs to be global.

### Persistence, Shareability & Cache Invalidation

| Consideration          | Current Approach                                                       |
| ---------------------- | ---------------------------------------------------------------------- |
| **Persistence**        | All state is in-memory; refreshing the page resets to defaults         |
| **Shareability**       | Not implemented: assumed dashboard page is not shareable               |
| **Cache invalidation** | Not needed: dashboard is read-only with no mutations to trigger stales |

For a single-user analytics dashboard, these trade-offs are acceptable. If mutations (create/update/delete) were added, cache invalidation would be handled by TanStack Query's built-in invalidation after successful mutations.

### What I'd Change for Shareability

If users needed to share dashboard links with specific filters, I would use `nuqs` for URL state management:

1. URL params become the source of truth for filter state
2. Filter changes update URL automatically
3. Browser back/forward restores previous filter states

</details>

<details>
<summary><strong>3. How do you handle the case where a user has no data?</strong></summary>

### Decision: Graceful Degradation at Every Layer

Empty states are handled **defensively**: API routes return valid responses with zeros/empty arrays (not errors), and each UI component renders a contextual placeholder. A new user sees a functional dashboard, not crashes or misleading metrics.

### Why This Approach

**Empty is not an error**: A user with zero posts receives `200 OK` with `{ totalEngagement: 0, topPost: null }`. The client renders this like any other state. No special error handling, no 404s for "no data found."

**Context-aware messaging**: The posts table distinguishes between "you have no posts" (onboarding) and "no posts match this filter" (actionable). The latter shows a "Clear filter" button; the former provides guidance.

**Visual stability**: Empty states preserve the same dimensions as populated states. No layout shifts when data loads or filters change.

### Trade-offs

| Consideration        | Current Approach                              | Alternative                                         |
| -------------------- | --------------------------------------------- | --------------------------------------------------- |
| **Zeros vs. nulls**  | Return `0` for all numeric fields             | Could use `null` to distinguish "no data" from zero |
| **Card granularity** | Single placeholder replaces all summary cards | Could show individual cards with zero values        |
| **Onboarding UX**    | Generic "no posts yet" messaging              | Could add CTAs like "Connect Instagram"             |

### Edge Cases

| Scenario                              | Behavior                                                   |
| ------------------------------------- | ---------------------------------------------------------- |
| **No posts exist**                    | Table shows "You don't have any posts yet"                 |
| **Posts exist, filter returns empty** | Table shows "No posts found for [platform]" + clear button |
| **No daily metrics for range**        | Chart shows "No metrics available for this period"         |
| **Engagement rate with no posts**     | Returns `0%`, not `NaN` or "N/A"                           |
| **Trend with no history**             | Returns `0%` neutral (no misleading positive/negative)     |
| **Top post when empty**               | Returns `null`; card renders "No posts yet" variant        |

</details>

<details>
<summary><strong>4. How should the "trend" percentage be calculated?</strong></summary>

### Decision: Rolling 30-Day Window Comparison

I chose to compare the **last 30 days vs. the prior 30 days** using the `daily_metrics` table. The API fetches 60 days of time-series data, splits it into two 30-day periods, and computes the percentage change between their engagement totals.

### Why This Approach

**Purpose-built data source**: The `daily_metrics` table stores pre-aggregated daily engagement totals. This is cleaner than summing individual post metrics, which would conflate "when the post was created" with "when engagement occurred." Time-series data is the right abstraction for trend analysis.

**30 days balances signal vs. recency**: A 7-day window is too volatile; a single viral post skews the comparison. A 30-day window smooths out daily noise while still reflecting recent performance. It also aligns with how creators typically think about monthly performance.

**Rolling window, not calendar months**: Comparing "this month vs. last month" introduces variability (28 vs. 31 days) and creates a cliff effect at month boundaries. A rolling 30-day window provides consistent, always-current comparisons regardless of when the user checks.

**Simple mental model**: The UI displays "vs last 30 days": users immediately understand the comparison without needing to know what "previous period" means. No ambiguity about whether it's calendar-based or relative.

### Trade-offs

| Window Size          | Pros                                | Cons                                                 |
| -------------------- | ----------------------------------- | ---------------------------------------------------- |
| **7 days**           | Highly responsive to recent changes | Too volatile; one good/bad day skews the metric      |
| **30 days (chosen)** | Balances stability with relevance   | Requires 60 days of data for full comparison         |
| **Calendar month**   | Familiar "this month" framing       | Inconsistent window sizes; cliff at month boundaries |

### Data Availability Considerations

| Scenario                | Behavior                                                 |
| ----------------------- | -------------------------------------------------------- |
| **60+ days of data**    | Full comparison: `(current - previous) / previous × 100` |
| **30-59 days of data**  | Partial comparison using available prior data            |
| **< 30 days of data**   | Returns `0%` neutral (avoids misleading "100% growth")   |
| **Previous period = 0** | If current > 0, shows `+100%`; otherwise `0%`            |

New users see a neutral `0%` trend rather than a false positive. This aligns with the empty state philosophy: no data is not an error, and the UI should not mislead.

### UX Clarity

The trend indicator pairs a percentage with a directional arrow (green up, red down) and explicit context text:

```
+12.5% vs last 30 days  (green, arrow up)
-8.2% vs last 30 days   (red, arrow down)
```

This removes ambiguity: the comparison window is stated, the direction is color-coded, and the magnitude is quantified.

</details>

## Edge Runtime

The `/api/metrics/daily` route runs on the **Edge runtime** (`export const runtime = 'edge'`).

### Why Edge for Daily Metrics

This route uses Edge runtime to demonstrate understanding of Edge constraints, as required by the challenge. This route was chosen because:

1. **No Node.js API dependencies**: The route only uses Web-standard APIs and the Supabase client, which is Edge-compatible
2. **Simple execution profile**: A straightforward SELECT with date filtering completes well within Edge execution limits
3. **Compatible auth pattern**: Session state is read from cookies via `supabase.auth.getUser()`, which works in Edge environments

In a real product, Edge wouldn't provide meaningful benefits for this use case. A dashboard that users visit once or twice a day isn't latency-sensitive enough to justify Edge constraints. The 50-100ms difference is imperceptible.

### Where Edge Runtime Shines

Edge runtime is ideal for **globally distributed, latency-sensitive workloads** like:

- **Real-time notifications**: Delivering push notifications or webhooks to users worldwide with <50ms latency
- **A/B test routing**: Making split-test decisions at the edge before rendering, avoiding round-trips to origin servers
- **Geolocation-based content**: Serving region-specific content (currency, language, compliance) based on request headers
- **Rate limiting & bot detection**: Blocking malicious traffic before it reaches your database or application logic
- **Image optimization proxies**: Resizing/transforming images on-demand at edge locations closest to users

For this dashboard, the user experience doesn't benefit from Edge's geographic distribution: analytics queries are infrequent and not latency-critical.

### Edge Runtime Limitations

| Limitation                 | Impact on This Route                                                         |
| -------------------------- | ---------------------------------------------------------------------------- |
| **No Node.js APIs**        | Cannot use `fs`, `path`, `crypto` (Node), etc. Uses Web Crypto API if needed |
| **Limited execution time** | 30s max on Vercel Hobby; sufficient for simple DB queries                    |
| **Smaller bundle size**    | Cannot import heavy Node libraries; Supabase client is Edge-compatible       |
| **No native modules**      | Cannot use packages with native bindings (e.g., `bcrypt`)                    |
| **Cold starts**            | Faster than Node.js serverless, but still present                            |

### Why Not Edge for Summary Route

The `/api/analytics/summary` route uses the standard Node.js runtime because it performs heavier aggregation logic (iterating all posts, computing trends). While it could run on Edge, the added complexity doesn't warrant the constraints.

## Security Practices

### Authentication & Authorization

- **Session validation**: All API routes call `supabase.auth.getUser()` before returning data. Unauthenticated requests receive `401 Unauthorized`.
- **RLS enforcement**: Even if API auth is bypassed, Row Level Security at the database layer prevents cross-user data access.
- **Middleware protection**: Next.js middleware redirects unauthenticated users away from protected routes (`/dashboard`).

### Secret Management

- **No service role key**: `SUPABASE_SERVICE_ROLE_KEY` is intentionally not used. All queries run with the user's session token, respecting RLS policies.
- **Public keys only**: Only `NEXT_PUBLIC_*` variables are used, which are safe to expose (they're designed for browser use with RLS).
- **`.env.local` for secrets**: Environment variables are never committed; `.env.example` documents required variables without values.

### Input Validation

- **Zod schemas**: All API route inputs are validated with Zod before processing. Invalid requests return `400 Bad Request` with structured error details.
- **Request params validation**: URL parameters (e.g., `postId` in `/api/posts/[postId]`) are validated with Zod to ensure they match expected formats before database queries.
- **Response validation**: Database responses are also validated against Zod schemas to catch data corruption or schema drift.
- **Type-safe throughout**: TypeScript strict mode ensures no implicit `any` types leak through.

### CORS Considerations

CORS headers are not explicitly configured because:

1. API routes are same-origin (served from the same Next.js app)
2. No cross-origin requests are expected
3. Supabase client handles its own CORS for direct database access

If third-party integrations were added, CORS middleware would be implemented per-route.

## Type Safety

### Supabase Type Generation

TypeScript types can be generated from the Supabase schema:

```bash
# From remote project
npx supabase gen types typescript --project-id <project-id> > src/lib/database.types.ts

# From local Supabase
npx supabase gen types typescript --local > src/lib/database.types.ts
```

### Zod Runtime Validation

While Supabase types provide compile-time safety, **Zod schemas enforce runtime validation** at API boundaries:

```typescript
// API response is validated before returning to client
const validationResult = postsResponseSchema.safeParse(data);
if (!validationResult.success) {
  return NextResponse.json({ error: 'Data validation failed' }, { status: 500 });
}
```

This dual approach ensures:

- **Compile-time**: TypeScript catches type mismatches during development
- **Runtime**: Zod catches malformed data from the database or external sources
- **Schema drift detection**: If the database schema changes without updating types, Zod validation fails loudly rather than passing corrupt data to the UI

## Assumptions

The following assumptions were made during development:

| Assumption                                 | Rationale                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Single user per account**                | Dashboard shows data for the authenticated user only; no team/workspace sharing                         |
| **No realtime requirements**               | Data refreshes on page load; no live updates via Supabase Realtime subscriptions                        |
| **Carousel thumbnails as CSV**             | For `carousel` media type, `thumbnail_url` stores comma-separated image URLs (e.g., `url1,url2,url3`)   |
| **Engagement = likes + comments + shares** | `saves` is tracked but not included in the "engagement" total per common social media definitions       |
| **Permalinks are placeholders**            | Seed data uses static example URLs; real integrations would store actual platform permalinks            |
| **Email/password auth only**               | No OAuth providers (Google, Instagram, TikTok) configured; would require additional Supabase setup      |
| **UTC timezone for dates**                 | All dates stored and compared in UTC; no user timezone conversion                                       |
| **No pagination for summary**              | `/api/analytics/summary` fetches all posts; acceptable for expected data volumes (<1000 posts per user) |

## Verifying RLS Isolation

To manually verify that Row Level Security is working:

1. **Start the app** and log in as `demo1@example.com` (password: `password123`)
2. **Note the posts**: observe the thumbnails, captions, and engagement numbers
3. **Log out** (click avatar → Sign out)
4. **Log in as `demo2@example.com`** (password: `password123`)
5. **Compare the data**: you should see completely different posts and metrics

**Expected behavior**: Each user sees only their own data. There is no way for User A to access User B's posts through the UI or API.

### Testing via API

```bash
# Get a session token for demo1
# Then try to fetch data: should only return demo1's posts

# The RLS policy enforces:
# auth.uid() = user_id
# Even direct Supabase queries respect this constraint
```

## RLS Policies

Row Level Security ensures complete data isolation between users. Each table has policies for SELECT, INSERT, UPDATE, and DELETE operations that verify `auth.uid() = user_id`.

**Key guarantees:**

- User A cannot see User B's posts or metrics
- Users can only insert data with their own `user_id`
- All API routes validate authentication before querying

The policies are defined in `supabase/migrations/20260110025711_add_rls_policies.sql`.

## Testing

Unit tests use **Vitest** with **React Testing Library**. E2E tests use **Cypress**.

### Commands

```bash
# Unit tests
pnpm test              # Watch mode
pnpm test run          # Single run

# E2E tests
pnpm e2e               # Headless
pnpm e2e:open          # Interactive UI
```

### Test Coverage

Testing focuses on **hot paths** and **requirements-critical functionality**:

#### Unit Tests (Vitest)

| Area                         | What's Tested                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **API Routes**               | Auth checks (401 for unauthenticated), input validation (400 for invalid params), success responses, database errors (500), schema validation failures |
| **`/api/analytics/summary`** | Total engagement calculation, average engagement rate, top post selection, trend calculation (positive/negative/zero previous period)                  |
| **`/api/metrics/daily`**     | Time range filtering (week/month/quarter/year/all), date boundary calculations, Edge runtime compatibility                                             |
| **TanStack Query Hooks**     | Query key generation, loading states, error handling, data transformation                                                                              |
| **Supabase Proxy**           | Session refresh, auth redirects, cookie handling                                                                                                       |

#### E2E Tests (Cypress)

| Flow                    | What's Tested                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------- |
| **Authentication**      | Login with valid/invalid credentials, sign-up flow, protected route redirects         |
| **Dashboard**           | Summary cards render with data, chart displays metrics, posts table loads and filters |
| **Posts Table**         | Platform filtering, sorting, pagination, row click opens modal                        |
| **Daily Metrics Chart** | Time range selection, chart type toggle, empty state handling                         |

#### Testing Philosophy

- **Bias toward requirements**: Tests cover what the challenge specifies (auth, RLS, aggregation, filtering)
- **API routes are the priority**: Server-side logic has comprehensive coverage; UI components rely on E2E
- **No snapshot tests**: Avoided due to brittleness; behavior-based assertions preferred
- **Mocked Supabase**: Unit tests mock the Supabase client to test logic in isolation

## CI/CD Pipeline

Trunk-based development with feature branches. PRs trigger CI checks; merging to `main` deploys to production.

```
feature branch → PR → lint/build/test → preview deploy → e2e tests → merge → production deploy
```

<details>
<summary><strong>Pipeline Details</strong></summary>

### On Pull Request

1. **Lint, Build & Unit Tests**: Runs `pnpm lint`, `pnpm build`, `pnpm test run`
2. **Supabase Migration**: Pushes migrations to the **dev** Supabase project (with seed data)
3. **Preview Deploy**: Deploys to Vercel preview URL, comments the link on the PR
4. **E2E Tests**: Runs Cypress against the preview deployment

### On Merge to Main

1. **Lint, Build & Unit Tests**: Same checks as PR
2. **Supabase Migration**: Pushes migrations to the **production** Supabase project (no seed)
3. **Production Deploy**: Deploys to Vercel production

### Environment Separation

| Environment | Supabase Project | Vercel Deploy | Seed Data |
| ----------- | ---------------- | ------------- | --------- |
| Preview     | Dev              | Preview URL   | Yes       |
| Production  | Prod             | Production    | No        |

</details>

## Bonus Features Implemented

The following optional/bonus items from the challenge were implemented:

- **Framer Motion animations**: Modal entrance/exit transitions, card hover effects
- **Unit tests**: Vitest tests for API routes and utility functions
- **E2E tests**: Cypress tests for auth flows and dashboard functionality
- **GitHub Actions CI/CD**: Automated lint, build, test, and deploy pipeline
- **Preview deployments**: PR-triggered preview URLs on Vercel

## What I'd Improve With More Time

- **Shareable URLs**: Use `nuqs` to sync filters to URL for shareable dashboard links
- **Database-level aggregations**: Move summary calculations to Postgres functions for better performance at scale
- **Social Logins**: Add OAuth providers (Google, Instagram, TikTok) via Supabase Auth
- **Rate limiting**: Add rate limiting to API routes to prevent abuse
- **Monitoring & Observability**: Integrate Sentry for error tracking, PostHog for analytics, and structured logging
- **Realtime Updates**: Use Supabase Realtime to push live engagement updates without polling
- **Storybook Integration**: Component visual testing and documentation

## Time Spent

~10 hours

- Supabase setup, seeding & RLS policies: ~2 hours
- API routes & data fetching: ~2 hours
- UI components & state management: ~3 hours
- Testing & CI/CD Pipeline: ~3 hours
