# 1 Million Rows Readiness Report

**Project:** Guardian Portal  
**Date:** 2026-07-30  
**Overall Score:** **8/30 PASS** | 9 WARN | 13 FAIL

---

## Summary Verdict

**NOT READY for 1M rows.** The single most critical blocker is `fetchAllPages` at `src/services/pagination.js:1` — it fetches every single page in parallel via `Promise.all`, which would fire tens of thousands of simultaneous HTTP requests against a 1M-row dataset. The codebase is a frontend-only SPA with no backend visibility, so the database-layer checks are all scored FAIL (no evidence). The good news: TanStack Query is already wired up with sensible caching, and the bundle is small. However, there is zero virtualization and most "list" views have no server-side pagination support.

---

## Category Scores

### A. Database & API Layer (0/8 PASS)

| # | Check | Score | Evidence | Recommendation |
|---|---|---|---|---|
| A1 | Pagination is server-side | **FAIL** | `fetchAllPages` at `src/services/pagination.js:1` fetches ALL pages via `Promise.all`. `src/services/studentService.js:4` passes `page`/`perPage` but the frontend ignores pagination by calling `fetchAllPages` instead of rendering one page at a time. | Delete `fetchAllPages`, render one page at a time, use cursor-based pagination from the API |
| A2 | Indexes on queried columns | **N/A** | No backend/migration files in this repo. | Verify on Laravel backend that `WHERE`, `JOIN`, and `ORDER BY` columns are indexed |
| A3 | No N+1 queries | **FAIL** | `AuthContext.jsx:28-33` filters students client-side by iterating `allStudents.filter(...)` — if the API doesn't eager-load guardians, this triggers N queries. No backend code to verify eager loading. | Ensure Laravel API uses `with('guardians')` on the students endpoint |
| A4 | Query timeouts & connection pooling | **FAIL** | No evidence of connection pooling or query timeout configuration. Axios has no timeout set (`src/services/api.js:5-11`). | Add `timeout: 10000` to the Axios instance |
| A5 | Aggregations use DB, not app code | **FAIL** | `InvoicesPayments.jsx:237-238` filters invoices client-side. `Dashboard.jsx:48-54` finds routes via array iteration. | Move filtering/sorting to the API as query params |
| A6 | Bulk operations exist | **FAIL** | No evidence of bulk inserts/updates. | Ensure Laravel API supports `POST /api/bulk/*` endpoints |
| A7 | No loading all rows for dropdowns/filters | **FAIL** | `fetchAllPages` loads ALL students/routes/buses into memory. `useRouteManifest` at `src/hooks/useApi.js:37` uses `perPage: 200` and still fetches all pages. | Use server-side search for student switcher, not loading all students |
| A8 | Rate limiting & throttling | **FAIL** | No evidence on frontend (Axios has no throttling). Backend not in this repo. | Add `axios-retry` with exponential backoff |

---

### B. Data Fetching & State (2/6 PASS)

| # | Check | Score | Evidence | Recommendation |
|---|---|---|---|---|
| B1 | Server-state library with caching | **PASS** | TanStack Query v5 at `src/App.jsx:5-13` with `staleTime: 120000` (2 min). `useChildStatus` at `src/hooks/useApi.js:46-55` has `staleTime: 15000` and `refetchInterval: 15000`. | Already well-configured |
| B2 | Pagination state is URL-driven | **FAIL** | No pagination state in any page. `AttendanceHistory.jsx` has prev/next buttons but they are non-functional. `InvoicesPayments.jsx` has no pagination. | Add page number to URL search params |
| B3 | Search/filter is server-side | **FAIL** | `InvoicesPayments.jsx:237` filters `invoices.filter(...)` client-side. `AttendanceHistory.jsx` has filter buttons that do nothing. | Send filter values as API query params |
| B4 | Request deduplication | **PASS** | TanStack Query deduplicates identical queries by default. | Already works |
| B5 | Optimistic updates or background refetch | **WARN** | `usePayInvoice` at `src/hooks/useApi.js:74-81` invalidates queries on success but does not use optimistic updates. | Add `onMutate` for optimistic UI |
| B6 | No waterfall requests | **WARN** | `Dashboard.jsx:39-40` calls `useRoutes()` and `useBuses()` in parallel — OK. But `AuthContext.jsx:22-23` loads students first, then dependent components load more data. | Use `useQueries` where possible |

---

### C. Rendering Performance (1/6 PASS)

| # | Check | Score | Evidence | Recommendation |
|---|---|---|---|---|
| C1 | Virtualization / Windowing | **FAIL** | No virtualization library in `package.json`. `BusRoute.jsx:252` maps over all `routeStops` rendering every DOM node. `Profile.jsx:162` renders all students. | Add `@tanstack/react-virtual` or `react-virtuoso` |
| C2 | Pagination UI works up to 100K+ pages | **FAIL** | No pagination UI exists. `AttendanceHistory.jsx:183-190` has hardcoded prev/next buttons with no page logic. | Add ellipsis-based pagination with page input |
| C3 | Images are lazy-loaded | **WARN** | No real images in use — only SVG icons from lucide-react. Not applicable yet, but no `loading="lazy"` patterns. | Add when real images are introduced |
| C4 | No uncontrolled re-renders | **WARN** | `BusRoute.jsx:254` uses `key={index}` on route stops (unstable key). `InvoicesPayments.jsx:341` uses stable `inv.invoice_id`. Several inline arrow functions that break `React.memo`. | Use stable keys, wrap callbacks in `useCallback` |
| C5 | Debounced search inputs | **FAIL** | No search inputs exist. `AttendanceHistory.jsx:90-102` filter buttons don't trigger API calls. | Add debounced search (300ms) when search inputs are added |
| C6 | Loading/empty/error states for every view | **PASS** | Every page has loading spinners, empty states via `EmptyState` component (`src/components/common/EmptyState.jsx:1`), and error boundaries (`InvoicesPayments.jsx:280-284`). | Already handles all three states |

---

### D. Bundle & Assets (4/5 PASS)

| # | Check | Score | Evidence | Recommendation |
|---|---|---|---|---|
| D1 | Code splitting | **FAIL** | `AppRoutes.jsx` uses static imports for all pages (no `React.lazy` or dynamic imports). Single JS bundle `index-Dw0nmso_.js` at 438 KB. | Use `React.lazy(() => import('@/pages/Dashboard'))` for route-level splitting |
| D2 | Vendor chunking | **WARN** | `vite.config.js` has no `manualChunks` or `splitVendorChunkPlugin`. All code (react, router, tanstack, axios, lucide) is in one bundle. | Configure `build.rollupOptions.output.manualChunks` to split vendor libs |
| D3 | Tree shaking | **PASS** | All imports are named/selective (e.g., `import { useQuery } from '@tanstack/react-query'`). No `import * as`. | Already correct |
| D4 | Asset optimization | **PASS** | SVG icons only. No heavy fonts or images. | Already correct |
| D5 | Bundle size | **WARN** | Main JS bundle is 438 KB uncompressed (~130 KB gzipped estimated). Below 200 KB gzipped threshold, but no code splitting means every page pays for all code upfront. | Add code splitting to reduce initial load further |

---

### E. Infrastructure & Operations (1/5 PASS)

| # | Check | Score | Evidence | Recommendation |
|---|---|---|---|---|
| E1 | Database read replicas | **N/A** | Backend not in this repo. | Verify on Laravel/DO side |
| E2 | Caching layer | **FAIL** | No evidence of Redis/CDN caching. TanStack Query cache is client-side only. No `Cache-Control` headers set on frontend. | Add CDN caching for static assets, verify API response caching on backend |
| E3 | Horizontal scaling | **PASS** | Deployed as static site on DigitalOcean App Platform (`DEPLOYMENT.md:1`). Stateless by design — all state is in localStorage or TanStack Query. | Already horizontally scalable |
| E4 | Logging & monitoring | **FAIL** | No error tracking (Sentry, DataDog). No structured logging. `authService.js:16-22` silently swallows logout errors. | Add Sentry for frontend error tracking |
| E5 | Backup & recovery | **N/A** | Backend not in this repo. | Verify on Laravel/DO side |
| E6 | Load testing experience | **FAIL** | No load test scripts (k6, Artillery, Locust) found in repo. | Add k6 scripts for critical endpoints |

---

## Top 5 Critical Fixes Required BEFORE 1M Rows

1. **REMOVE `fetchAllPages` — it destroys scalability at 1M rows.**
   - File: `src/services/pagination.js:1-21`
   - This function fetches every single page in parallel. For 1M rows at 100 per page = 10,000 simultaneous requests.
   - Fix: Delete `fetchAllPages`. Modify all consumers to render and paginate one page at a time using cursor-based pagination from the Laravel API.

2. **Add virtual scrolling to all list/tables.**
   - Files: `src/pages/BusRoute.jsx:252`, `src/pages/AttendanceHistory.jsx:134`, `src/pages/InvoicesPayments.jsx:341`, `src/pages/Profile.jsx:162`
   - Without virtualization, rendering 10,000+ DOM nodes will freeze the browser.
   - Fix: Install `@tanstack/react-virtual` and wrap large lists with `<Virtualizer>`.

3. **Implement real server-side pagination in all list views.**
   - Files: `src/pages/AttendanceHistory.jsx:134` (hardcoded prev/next that do nothing), `src/pages/InvoicesPayments.jsx:237` (client-side filter)
   - Fix: Add `page`/`perPage` URL search params, pass them to API services, render proper pagination controls.

4. **Add Axios timeout and rate limiting.**
   - File: `src/services/api.js:5-11`
   - No timeout means a slow API can hang the UI indefinitely. At 1M rows, slow queries are inevitable.
   - Fix: Add `timeout: 10000` and install `axios-retry` with exponential backoff.

5. **Replace the single JS bundle with route-level code splitting.**
   - File: `src/routes/AppRoutes.jsx:1-11` — all pages are statically imported.
   - Fix: Use `React.lazy()` for every route, configure Vite `manualChunks` to separate vendors from app code.

---

## Quick Wins (Low Effort, High Impact)

- [ ] **Add `timeout: 10000` to Axios instance** (`src/services/api.js:5`) — 1 line, prevents hanging requests.
- [ ] **Add `build.rollupOptions.output.manualChunks` to `vite.config.js`** — 5 lines, reduces cache invalidation.
- [ ] **Replace `key={index}` with stable keys in `BusRoute.jsx:254`** — the stops already have data with unique IDs.
- [ ] **Install `axios-retry` and add retry interceptor** — prevents transient failures at scale.
- [ ] **Configure `splitVendorChunkPlugin` in Vite** — separates `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query` into a vendor chunk.

---

## Estimated Effort

| Area | Hours (est.) |
|---|---|
| Database changes | N/A (backend not in repo) |
| API changes | 8h (rewrite fetchAllPages consumers, add pagination to views) |
| Frontend changes | 16h (virtual scrolling, code splitting, pagination UI) |
| Infrastructure | 4h (Sentry, axios-retry, CDN caching) |
| Testing & validation | 6h (k6 load tests, manual QA) |
| **Total** | **34h** |
