# Agent Notes (Handoff)

This repo is a Next.js 15 App Router demo for the "Krowdr" social suite UI.

## Quick Start

- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Build: `npm run build`

## Current Product Flow

- Marketing: `/`, `/features`, `/login`
- App shell (protected): `/overview`, `/learn`, `/plan`, `/predict`, `/draft`, `/inbox`, `/schedule`, `/listen`, `/voice`, `/settings/*`

## Demo Auth (Cookie + Middleware)

- Login writes a demo session cookie client-side.
- Middleware blocks dashboard routes without the cookie and redirects to `/login?next=...`.

Key files:

- `middleware.ts`: route protection
- `src/lib/demo-constants.ts`: cookie names
- `src/lib/demo-session.ts`: client helpers (safe on server, no `document` access)
- `src/app/login/login-client.tsx`: sets session cookie and navigates to `next` or `/overview`

Cookie names:

- `krowdr_demo_session`
- `krowdr_demo_timezone`

## Workspace Timezone

- Settings persists timezone in `krowdr_demo_timezone`.
- Schedule/Plan group posts by day using the workspace timezone (not UTC date-splitting).

Key files:

- `src/lib/datetime.ts`
- `src/app/(dashboard)/schedule/page.tsx`
- `src/app/(dashboard)/plan/page.tsx`
- `src/app/(dashboard)/settings/page.tsx`

## Marketing Pages (SSR + Client Effects)

Marketing pages are server-rendered; browser-only animation/reveal logic lives in small client components.

- `src/components/marketing/landing-effects.tsx`
- `src/components/marketing/features-effects.tsx`

## UI / Accessibility

- `AccountSwitcher` uses Radix `DropdownMenu`.
- Plan/Schedule modals use Radix `Dialog`.

## App Router Guardrails

- `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/(dashboard)/loading.tsx` added.

## Repo Hygiene

- `.gitignore` updated to ignore `.next/`, env files, editor files, and local tool state.
- `.gitattributes` added to stabilize line endings.
- `eslint.config.mjs` added to avoid interactive ESLint setup.

## Next Good Steps

- Add a visible "Log out" action (clear demo cookie) and maybe show current workspace timezone in the header.
- Make the dashboard sidebar responsive (collapse on mobile).
- Convert remaining icon-only buttons to include `aria-label`s.
- Consider moving large inline marketing CSS strings to CSS files/modules.
