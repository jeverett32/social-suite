# Production ASAP Path

This repo currently ships a working UI with Supabase Auth and a real `scheduled_posts` CRUD slice.
To make it production-ready for social media teams quickly, focus on the smallest end-to-end value loop:

1. Connect a social account (OAuth)
2. Schedule a post
3. A worker publishes it at the right time
4. Users can see status + retry failures

## Operator Setup (Do This First)

### Supabase
1. Create 2 Supabase projects: `dev` and `prod`.
2. Apply migrations in `supabase/migrations/`.
3. Ensure **RLS is enabled** on all tables (already included for `scheduled_posts`).
4. Configure Auth:
   - Email provider (SMTP) for production
   - Redirect URL: `https://<domain>/auth/callback`
5. Create a Storage bucket for media (recommended): `media`.

### Environment Variables
Set in Vercel (or your host):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# server-only (future)
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=https://<domain>
```

### Social Platform Apps (Start These Today)
These approval processes can take days/weeks.

1. Meta (Instagram/Facebook)
2. LinkedIn
3. X

Create the apps, request the needed permissions, and set redirect URIs to:
`https://<domain>/auth/callback?platform=<platform>`

## Engineering Critical Path

### Phase 1: Secure, Stable Scheduling (Now)
- Harden API invariants and user scoping
- Fix timezone correctness in the scheduler UI
- Keyboard accessibility for the calendar/queue

### Phase 2: First Real Publish (Next)
- Add `platform_connections` table
- Build OAuth connect UI under `/settings/integrations`
- Add publish worker endpoint and job runner (cron + queue)
- Add retries, failure reasons, and a manual retry button

### Phase 3: Team-Ready
- Workspaces + invites + roles
- Audit log
- Analytics ingestion and basic reporting

## What To Defer
- ML predictions (use heuristics until real data exists)
- Social listening
- Advanced approvals/workflows
