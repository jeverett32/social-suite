# Handoff

This doc is meant to make the repo resumable for another agent/operator.

## Current State

The app is a Next.js 15 App Router UI with Supabase Auth.

Working end-to-end today:
- Supabase email/password login + middleware protection for dashboard routes.
- Scheduled posts CRUD (UI + `GET/POST/PATCH/DELETE /api/scheduled-posts`) with user scoping and basic invariants.
- Draft -> Predict seeding (localStorage) and Draft -> Schedule seeding (localStorage).
- Integrations page is now backed by DB connections (no mock accounts).
- Generic OAuth start/callback routes store encrypted tokens in `platform_connections`.

## Migrations

Apply in order:
- `supabase/migrations/0001_scheduled_posts.sql`
- `supabase/migrations/0002_platform_connections.sql`

## Key Routes

- Scheduled posts API: `src/app/api/scheduled-posts/route.ts`
- OAuth start: `GET /api/oauth/[platform]/start`
- OAuth callback: `GET /api/oauth/[platform]/callback`
- Platform connections API: `GET/DELETE /api/platform-connections`

## OAuth Platform Config

Defined in `src/lib/oauth/platforms.ts`.

Supported targets for this project:
- `linkedin`
- `tiktok` (PKCE required)
- `facebook` + `instagram` (Meta OAuth; currently stores user token only)
- `youtube` (Google OAuth; requests offline access)

Notes:
- Meta/Instagram publishing requires selecting a Page + IG Business account and obtaining page/IG tokens; that is not implemented yet.
- TikTok uses `client_key`/`client_secret` param names in token exchange.
- YouTube needs refresh token; `prompt=consent` is set to ensure one is issued.

## Token Storage

Tokens are encrypted at the application layer:
- `src/lib/token-crypto.ts` uses AES-256-GCM.
- Env var required: `TOKEN_ENCRYPTION_KEY` (base64 of 32 random bytes).

## Required Env Vars

Minimum to run (local/dev):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

For OAuth connections:
- `TOKEN_ENCRYPTION_KEY`
- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
- `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`
- `META_APP_ID`, `META_APP_SECRET`
- `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`

See `.env.example` for full list.

## Known Gaps / Next Engineering Steps

1. Publishing worker
- Add a cron/queue worker that finds due `scheduled_posts` and publishes to each platform.
- Add delivery status fields (or a separate `post_deliveries` table) before implementing multi-platform fan-out.

2. Platform-specific publish implementations
- LinkedIn: author URN, organization posting (optional, requires extra scopes), media upload.
- Meta: exchange short-lived token -> long-lived, list pages, page token, IG business account resolution, container publish flow.
- TikTok: upload + publish flow, refresh token rotation.
- YouTube: resumable upload flow and video processing state.

3. Integrations UX
- After OAuth callback, Meta should prompt for selecting Page/IG account.
- Show per-connection expiry and a "Reconnect" CTA.

4. Access model
- Introduce workspaces/teams + roles and update RLS (currently per-user).

## Repo Hygiene

`.omc/` was previously tracked; it is now removed from git index and is ignored via `.gitignore`.
