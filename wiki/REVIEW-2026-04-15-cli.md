# CLI Review Log (2026-04-15)

This log captures external CLI reviews run against the current working tree diff.

## Commands

```powershell
git diff -- src middleware.ts supabase/migrations/0001_scheduled_posts.sql | claude -p "You are doing a code review. The git diff is provided on stdin. Review for correctness, security, data integrity, Next.js App Router constraints, and maintainability. Return findings ordered by severity (blocker/major/minor/nit) with file paths and line ranges, and concrete fixes. Also call out any verification gaps."

git diff -- src middleware.ts supabase/migrations/0001_scheduled_posts.sql | gemini -p "You are doing a code review. The git diff is provided on stdin. Review for UX flow, edge cases, state management, accessibility, and API consistency. Return findings ordered by severity (blocker/major/minor/nit) with file paths and line ranges, user-visible impact, and suggested fixes. Also list quick wins."
```

## Output: `claude`

```text
---

## Code Review

### MAJOR

**1. `predict/page.tsx` & `schedule/page.tsx` — `useSearchParams()` missing Suspense boundary**

In Next.js App Router, any client component calling `useSearchParams()` must be wrapped in `<Suspense>`. Without it, the entire route is de-opted out of static rendering and Next.js emits a build warning (or error in strict mode).

Fix: extract the component body into an inner component and wrap it:

```tsx
// predict/page.tsx
export default function PredictPage() {
  return (
    <Suspense>
      <PredictPageInner />
    </Suspense>
  );
}
function PredictPageInner() {
  const searchParams = useSearchParams();
  // ... rest of component
}
```

Apply the same pattern to `schedule/page.tsx`. (`plan/page.tsx` is unaffected — it uses `useRouter` only.)

---

**2. `overview/page.tsx` — Supabase query relies solely on RLS, no explicit `user_id` filter**

`src/app/(dashboard)/overview/page.tsx:61–65` queries `scheduled_posts` without a `.eq("user_id", userData.user.id)` clause. If RLS is misconfigured or temporarily disabled (e.g., during migrations), all users' posts would be returned. Defense in depth: add an explicit filter.

```ts
.eq("user_id", userData.user.id)
.order("scheduled_at", ...)
```

---

**3. `draft/page.tsx` → `predict/page.tsx` — Long captions in URL query string**

`draft/page.tsx:163–169`: caption is passed as `?caption=<content>`. Social media captions can easily exceed 2 000 characters, hitting browser/server URL limits and silently truncating. Either use the same `sessionStorage` pattern used for the Schedule seed, or limit the URL-passed value to a short preview.

---

### MINOR

**4. `plan/page.tsx:235` — Placeholder text in production code**

```tsx
<div className="text-[10px] text-[#625d58] px-1">Loading???</div>
```

The `???` suffix is a dev placeholder. Should be `Loading…` or a spinner component.

---

**5. `schedule/page.tsx` — `handleDayClick` uses `setUTCHours(14)` regardless of workspace timezone**

`schedule/page.tsx` (new `handleDayClick`):
```ts
d.setUTCHours(14, 0, 0, 0); // UTC 14:00 default
```
For a user in UTC+8, this renders as 22:00 local time. Should derive the default from the workspace timezone, e.g. by setting local noon using the existing `dateKeyInTimeZone` utilities.

---

**6. `NEW_POST_SEED_KEY` duplicated across two files**

`"krowdr_new_post_seed"` is hard-coded in both `draft/page.tsx:10` and `schedule/page.tsx:32`. A future typo will silently break the Draft → Schedule flow with no error. Extract to `src/lib/session-keys.ts` and import from both.

---

**7. `overview/page.tsx` — `platformId` cast without validation**

`rowToPost` validates `format` and `status` with type guards but casts `platform_id` directly:
```ts
platformId: row.platform_id as Post["platformId"],
```
An unexpected DB value would silently produce an invalid `platformId`. Add a guard matching the pattern used for `format`/`status`.

---

### NITS

**8. `overview/page.tsx:117` — Redundant ternary**

```tsx
{(upcomingPosts.length ? upcomingPosts : []).map(...)}
```
`[].map(...)` is a no-op. This is just `upcomingPosts.map(...)`.

---

**9. `predict/page.tsx` — Redundant `typeof` check**

```ts
if (typeof c === "string" && c.trim()) {
```
`searchParams.get()` always returns `string | null`, so `typeof c === "string"` is always true when non-null. `if (c?.trim())` is sufficient.

---

**10. `plan/page.tsx` — Navigation buttons missing `type="button"`**

The prev/next week `<button>` elements have `onClick` but no `type="button"`. Low risk here (no enclosing form), but inconsistent with the rest of the codebase and should match.

---

### Verification Gaps

- No test coverage for the Draft → Predict and Draft → Schedule seed flows (sessionStorage state is hard to assert in unit tests; at minimum a Playwright/Cypress e2e test clicking through the flow would catch regressions).
- No test or explicit check confirming RLS is active on `scheduled_posts` — the overview and plan pages both silently depend on it.
- The `handleDeletePost` rollback path sets `loadError` rather than a dedicated `deleteError` state, meaning a stale load error can be overwritten with a delete error (or vice-versa) with no way to distinguish them in the UI.
```

## Output: `gemini`

```text
I have reviewed the provided git diff for the `social-suite` project. The changes focus on connecting the dashboard pages (Draft, Predict, Schedule, Plan) with real API/Supabase integration and improving the navigation flow between them.

### **Blocker / Major Findings**

#### **1. Inconsistent Cross-Page State (Major)**
*   **File:** `src/app/(dashboard)/draft/page.tsx` (Lines 176-193) and `src/app/(dashboard)/schedule/page.tsx`
*   **User Impact:** If a user right-clicks "Add to Schedule" and selects "Open in New Tab," the post data is lost because `sessionStorage` is not shared across tabs. Conversely, "Send to Predict" uses Query Parameters, which *do* work in new tabs.
*   **Suggested Fix:** Standardize on Query Parameters for simple transfers. If the content is too long for a URL, continue using `sessionStorage` but add a fallback or a "Draft not found" state in the Schedule modal.
*   **API Consistency:** The constant `NEW_POST_SEED_KEY` is duplicated in both files. It should be moved to a shared constant file (e.g., `src/lib/constants.ts`).

#### **2. UX/UI Inconsistency: Native Confirmation (Major)**
*   **File:** `src/app/(dashboard)/schedule/page.tsx` (Line 317)
*   **User Impact:** `window.confirm` is used for post deletion. This breaks the "premium" aesthetic of the application, which otherwise uses Radix UI and custom styled components.
*   **Suggested Fix:** Replace `window.confirm` with a Radix `AlertDialog` to match the design system used for the Navigation and Post Modals.

#### **3. Optimistic UI State Hazard (Major)**
*   **File:** `src/app/(dashboard)/schedule/page.tsx` (Lines 721-724)
*   **User Impact:** `handleDeletePost` performs an optimistic update by filtering the local `posts` state before the API call finishes. If the API call fails, it restores the `prev` state. However, if the user deletes multiple items rapidly, the `prev` state restoration may overwrite other successful deletions.
*   **Suggested Fix:** Use the functional update form of `setPosts` for restoration or, better yet, use a library like TanStack Query which handles optimistic updates and rollbacks safely.

---

### **Minor Findings**

#### **1. Hardcoded Theme Colors (Minor)**
*   **Files:** Multiple (e.g., `src/app/(dashboard)/draft/page.tsx` L168, L180)
*   **Finding:** Hex codes like `#625d58` are used directly in `className`.
*   **Suggested Fix:** These should be mapped to Tailwind theme variables (e.g., `text-muted-foreground` or a custom `text-ink/60`) to ensure consistency if the brand colors change.

#### **2. Error Silencing in Overview (Minor)**
*   **File:** `src/app/(dashboard)/overview/page.tsx` (Line 66)
*   **Finding:** The entire Supabase fetch is wrapped in an empty `catch` block.
*   **User Impact:** While this allows the page to render in "demo mode," it silently hides critical authentication or database errors from developers.
*   **Suggested Fix:** Log the error to the console (or an error tracking service) even if you fallback to an empty array.

#### **3. Accessibility: Missing Button Types (Minor)**
*   **Files:** `src/app/(dashboard)/draft/page.tsx`, `src/app/(dashboard)/schedule/page.tsx`
*   **Finding:** Several new buttons (e.g., L162 in DraftPage) explicitly define `type="button"`, but others in the `QueueView` do not.
*   **Suggested Fix:** Ensure all buttons have `type="button"` to prevent accidental form submissions if they are ever wrapped in a `<form>` element.

---

### **Nits**

*   **`src/app/(dashboard)/predict/page.tsx`**: The `useEffect` for search params is clean, but you could use the `defaultValue` or `defaultValues` pattern if you move to a form library like `react-hook-form`.
*   **`src/app/(dashboard)/plan/page.tsx`**: Good use of `cancelled` flag in `useEffect` for cleanup.
*   **Marketing Pages**: Moving the massive CSS strings out of the page components is a significant improvement for readability.

---

### **Quick Wins**
1.  **Extract Constants:** Move `NEW_POST_SEED_KEY` and the `post-to-row` converters to `src/lib/` to reduce duplication.
2.  **Add Aria-Labels:** You added `aria-label` to the navigation buttons in `PlanPage`; ensure the "More options" and "Edit/Delete" buttons in the Schedule Queue have unique labels (e.g., `Delete post "${post.content.substring(0,20)}..."`).
3.  **Loading States:** The "Loading???" placeholder in the calendar cells (PlanPage) should be replaced with a skeleton pulse to match the "premium" feel.
```
