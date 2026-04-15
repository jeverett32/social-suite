# Agent Notes (Handoff)

This repo is a Next.js 15 App Router demo for the "Krowdr" social suite UI.

## Claude CLI usage (for @claude requests)

- When asked to use **@claude**, invoke the **Claude CLI in the terminal** (don’t simulate an internal sub-agent).
- Canonical non-interactive pattern: `claude -p "<prompt>"`.
- Piping input on Windows PowerShell:
  - `git diff | claude -p "<review prompt>"`
  - `Get-Content path\\to\\file.txt | claude -p "<prompt>"`

## Gemini CLI usage (for @gemini requests)

- When asked to use **@gemini**, invoke the **Gemini CLI in the terminal** (don’t simulate an internal sub-agent).
- Canonical non-interactive (headless) pattern: `gemini -p "<prompt>"`.
- Piping input on Windows PowerShell (stdin is appended to the prompt):
  - `git diff | gemini -p "<review prompt>"`
  - `Get-Content path\\to\\file.txt | gemini -p "<prompt>"`
- Interactive mode: `gemini` (optionally: `gemini "<initial prompt>"`).

## Codex CLI usage (for @codex requests)

- If a task asks to use **@codex**, run the **Codex CLI** in the terminal (don’t simulate an internal subagent).
- Preferred non-interactive pattern:
  - `codex exec "<instructions>"`
  - Or provide instructions on stdin: `codex exec -` (stdin becomes the prompt)
- Note: in this CLI, `-p/--profile` selects a config profile; it is **not** a “prompt” flag.

## Major Work Workflow (functions.task subagents)

When the user asks for major work, always use ALL of these internal `functions.task` agents:

- `productowner`
- `explore`
- `general`
- `reviewer`

Also bake the external CLIs into the workflow:

- `@claude` (run `claude -p ...`)
- `@codex` (run `codex exec ...`)
- `@gemini` (run `gemini -p ...`)

Major work triggers (if any are true):

- Auth/session/middleware/cookies/redirects.
- Timezone/date grouping logic.
- DB schema, RLS, migrations, or new persistence patterns.
- New route/page under `src/app/**` or dashboard shell/navigation changes.
- 5+ files touched, or ~200+ net LOC.
- New dependency or meaningful build/config changes.

Minimum sequence:

1. `productowner`: requirements, acceptance criteria, non-goals, UX/a11y constraints, rollout/rollback notes.
2. `explore`: impacted files, existing patterns to follow, regression risks.
3. `@gemini` (external CLI): broad analysis, UX copy/flow ideas, edge cases, alternative approaches (not token sensitive).
4. `general`: implementation steps and validation plan.
5. `@codex` (external CLI): heavy coding assistance where token usage is less constrained. Prefer giving it focused tasks per file/feature.
6. `@claude` (external CLI): high-stakes code writing and critical changes (auth/RLS/security). Be token conscious.
7. Implement.
8. `reviewer`: post-implementation review against acceptance criteria (security/perf/maintainability/test gaps).
9. `@claude` and or `@gemini` (external CLIs): final sanity check on the diff when stakes are high or behavior is subtle.

Notes on when to prefer which external CLI:

- Use `@claude` when correctness and safety matter most (auth, RLS, redirects, token handling, security-sensitive refactors). Keep prompts small, pass only the relevant diff/sections.
- Use `@codex` for large mechanical edits, multi-file wiring, and code generation where you want speed and can afford larger context.
- Use `@gemini` for exploration, product/UX critique, copy, test ideas, and “second opinion” reviews where token usage is not a concern.

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
