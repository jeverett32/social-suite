# Krowdr — Production Plan

## Current Implementation Status (2026-04-13)

This repo currently contains a polished UI demo (marketing + dashboard shell) with mock data and demo auth.

- Marketing pages are server-rendered; browser-only reveal/scroll effects are isolated to client components.
- Demo auth is cookie-based and protected via middleware with `next` redirects.
- Schedule/Plan group posts by day using a workspace timezone cookie (not UTC date splitting).
- Settings has a simple sub-nav layout (`/settings`, `/settings/team`, `/settings/integrations`).
- App Router guardrails are in place (`not-found`, `error`, dashboard `loading`).
- Lint/typecheck/build all pass.

Key implementation files:

- `middleware.ts`: route protection
- `src/lib/demo-constants.ts`, `src/lib/demo-session.ts`: demo cookies + helpers
- `src/lib/datetime.ts`: timezone-safe date keys/formatting
- `src/app/login/login-client.tsx`: sets demo session cookie and navigates to `next`
- `src/app/(dashboard)/schedule/page.tsx`, `src/app/(dashboard)/plan/page.tsx`: timezone-safe grouping
- `src/components/marketing/landing-effects.tsx`, `src/components/marketing/features-effects.tsx`: marketing effects

Immediate product follow-ups (still demo-scope):

- Add a visible logout action (clear `krowdr_demo_session`).
- Mobile sidebar (collapse / drawer) and keyboard navigation polish.
- Continue a11y pass: remaining icon-only buttons, focus states, and table semantics.
- Consider extracting large inline marketing CSS strings into CSS modules.

## 1. Vision & Goals

Krowdr is a production-grade social media marketing platform that elevates the Learn -> Plan -> Predict -> Draft workflow pioneered in the Intex-II project into a complete, multi-platform tool for professional social media teams. Where Intex-II proved the concept — that analytics should inform planning, planning should be validated by prediction, and prediction should feed directly into content creation — Krowdr delivers on that promise with real platform API integrations, a unified inbox, per-account ML models, weekly retraining pipelines, post scheduling, and the deep analytics and first-party data tracking that the MOSCOW analysis identifies as must-haves. The goal is a single tool that replaces the fragmented stack of Hootsuite + Sprout Social + Canva + spreadsheets that most social teams cobble together, while solving industry gaps like burnout prevention, AI slop filtering, and hyper-local community engagement that no incumbent addresses.

**Product stance:** Krowdr is not meant to be a generic AI wrapper. The core planning and prediction loops should be driven by collected account data, engineered features, and retrained ML pipelines. Generative AI should be used narrowly for content creation, brand-voice-aware drafting, light summarization, and optional chat/copilot experiences.

---

## 2. Comparison: Intex-II Tools vs. Industry Standard

| Tool | Intex-II Version | Industry Gap | Production Upgrade |
|------|-----------------|--------------|-------------------|
| **Learn** | Static dashboard pulling from a local PostgreSQL database of historical posts. KPI cards (engagement rate, clicks, reach, impressions), top posts table, content gap/opportunity tags. No live API connection — data is pre-loaded. | Most tools show vanity metrics per platform but lack cross-channel attribution, first-party conversion tracking, and content gap analysis. No tool connects "what performed" to "what to do next" in the same view. | Real-time analytics pull from Meta Graph API, TikTok, LinkedIn, X, and YouTube. Cross-channel attribution dashboard showing which platform drove conversions. First-party data integration (UTM tracking, pixel events stored in Postgres). Content gap analysis should be driven first by historical performance clustering, trend joins, and feature-level diagnostics; LLM analysis is optional and secondary. |
| **Plan** | Server-side heuristic recommendations displayed in a Mon-Sun calendar grid per platform. Tags posts as "Untapped" or "Double Down" based on simple scoring. Predicted click lift shown per slot. Links to Draft for content creation. | Calendar tools (Later, Buffer) are scheduling-only — they don't recommend *what* to post. Sprout Social has "optimal send times" but no topic/tone recommendations. No tool combines trend data + account history + predictive modeling into a content calendar. | ML-backed content calendar that ingests each account's Learn data, cross-references trend signals and platform history, and generates a week of recommendations with predicted engagement lift. Each recommendation includes topic, tone, platform-specific format (Reel vs. carousel vs. text post), confidence, and a one-click "Send to Draft" action. LLMs may explain the recommendation, but they do not originate the planning logic. |
| **Predict** | Form-based pre-publish simulator. User enters post metadata (platform, type, topic, time, hashtag count, etc.) and 4 Gradient Boosting (sklearn) models return predicted engagement rate, clicks, reach, and impressions. Models are static `.pkl` files trained once on a single organization's data. | No mainstream tool offers pre-publish prediction. Sprout has "optimal send time" but not content-level prediction. The concept is genuinely novel but Intex-II's implementation (static models, one org's data) doesn't generalize. | Per-account ML models retrained on the user's own connected account data via a Python FastAPI microservice. Training pipeline runs as a BullMQ job on a schedule (weekly) or on-demand. Models start with a base model (transfer learning from aggregated anonymized data across accounts) and fine-tune on the account's history. Predictions include confidence intervals and actionable tips ("Add 2-3 hashtags to increase reach by ~15%"). Fallback to heuristic scoring for new accounts with insufficient data. |
| **Draft** | Calls an AI endpoint (OpenAI) with platform, topic, tone, CTA, and campaign name. Returns multiple caption variants. No brand voice management, no quality filtering, no A/B testing support. | Most AI writing tools (Jasper, Copy.ai) are generic — they don't know your brand voice, don't filter for AI "slop" (generic phrases, emoji spam, hollow CTAs), and don't connect to your analytics to learn what actually works. | Generative caption workflow with: (1) Brand Voice Manager that extracts tone, vocabulary, and patterns from your top-performing posts, (2) multi-variant output with A/B test labels, (3) AI Slop Filter that scores each variant for authenticity and flags generic phrasing, (4) platform-specific formatting (character limits, hashtag strategy, CTA placement), and (5) direct integration with Predict to show estimated performance before publishing. This is the primary place where LLMs should be used. |

---

## 3. Proposed Tech Stack

### Frontend
**Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Recharts + Tremor**

Next.js App Router provides SSR for SEO on public-facing pages, nested layouts for the dashboard shell, and server components for data-heavy pages like Learn. shadcn/ui gives a professional, accessible component library without the bloat of Material UI. Recharts handles custom analytics visualizations; Tremor provides pre-built dashboard components (KPI cards, area charts, bar lists) that accelerate the Learn tab. TypeScript is non-negotiable for a project this size.

### Backend
**Next.js API Routes + BullMQ Workers**

For a solo/small-team build, Next.js API routes handle webhook receivers, CRUD operations, and AI proxy calls. Heavy background work (post publishing, analytics sync, ML retraining) runs in separate BullMQ worker processes. This avoids the complexity of a separate backend service while keeping the architecture clean. If the team grows, API routes can be extracted to a standalone Fastify server without changing the client code.

### Database
**PostgreSQL (managed Supabase for v1, with optional homelab-hosted app tier) + Redis + object storage**

- **PostgreSQL** via managed Supabase for v1: relational data (posts, accounts, orgs, analytics, scheduled jobs). Supabase adds Realtime subscriptions (for inbox) and Row Level Security (for multi-tenancy) out of the box, while still allowing the app and workers to run on a homelab server.
- **Redis**: BullMQ job queues, rate limit counters for social API calls, session caching, real-time pub/sub for inbox updates. Upstash is a clean hosted option; self-hosted Redis on the homelab is also viable.
- **Storage**: Supabase Storage or an S3-compatible bucket for media uploads (images, videos) and serialized model artifacts.

### Auth
**Clerk**

Multi-tenant organizations with roles (admin, editor, viewer, client). OAuth provider connections for social accounts. Clerk's Next.js middleware handles route protection with zero boilerplate. The `org_id` claim in the JWT drives Row Level Security policies in Supabase.

### AI
**Gemini API or Anthropic Claude API, used selectively**

- **Primary AI use cases**
  - caption generation in Draft
  - brand voice extraction / enforcement
  - AI slop filtering and phrase cleanup
  - optional copilot/chat over internal app state
- **Not the primary engine for**
  - content calendar generation
  - recommendation ranking
  - predictive scoring
  - weekly planning logic

Model choice should stay swappable behind one provider interface. Gemini is a strong default for v1 if cost and convenience matter; Claude remains a strong option when writing quality becomes the main differentiator.

### ML / Predict
**Python FastAPI Microservice (carry forward the Intex-II architecture)**

The Intex-II architecture (FastAPI + scikit-learn + serialized model artifacts) is fundamentally sound and should become a first-class production subsystem, not a side feature.

Production upgrade:
- Replace static `.pkl` files with per-account retraining pipelines that run on the user's own post data.
- Pull account/post/analytics data from platform APIs into a normalized warehouse schema.
- Engineer features from posting time, platform, format, hashtags, topic clusters, CTA style, asset type, historical cadence, and recent campaign context.
- Train separate predictive models for engagement, reach, clicks, and impressions.
- Train weekly planning/ranking models that score candidate post opportunities by likely lift or expected performance.
- Run weekly retraining and weekly plan generation jobs automatically.
- Store trained models and model metadata in object storage keyed by `org_id`.
- BullMQ triggers retraining jobs and plan-refresh jobs via HTTP calls to the FastAPI service.
- Base models trained on pooled historical data provide reasonable cold-start predictions; account-specific fine-tuning improves with local history.
- Gradient Boosting remains the right default algorithm because tabular post metadata is its sweet spot. No need for deep learning overkill.

### Social APIs
| Platform | API | Key Capabilities |
|----------|-----|-----------------|
| Meta (FB + IG) | Graph API v21+ | Publishing, analytics, inbox (Messenger/IG DMs), webhooks |
| TikTok | TikTok for Business API | Publishing, analytics, webhook notifications |
| LinkedIn | Marketing API v2 | Publishing, analytics, organization pages |
| X (Twitter) | API v2 | Publishing, analytics, streaming (filtered) |
| YouTube | Data API v3 | Analytics, comment management (no direct publishing — use upload API) |
| Pinterest | API v5 | Pin creation, analytics |

### Scheduling & Queue
**BullMQ (Redis-backed)**

Post scheduling requires precision timing (publish at 2:47 PM EST on Thursday), retry logic (API rate limits, transient failures), and priority queues (scheduled posts > analytics sync > ML retraining). BullMQ is the Node.js standard for this. Cron jobs are inadequate — they lack retry, priority, and per-job scheduling.

### Video Processing
**Cloudinary**

Image and video transformations (resize for platform specs, format conversion, thumbnail generation) plus CDN delivery. Cheaper and simpler than Mux for the MVP. Mux is the upgrade path if video analytics or live streaming become features.

### Deployment
**Recommended v1: homelab app/workers + managed Supabase**

- Run the web app, BullMQ workers, and Python FastAPI ML service on the homelab server.
- Use managed Supabase for Postgres, storage, and optional realtime during v1 so infrastructure overhead stays low.
- Use Docker Compose on the homelab for the web app, workers, Redis, and ML service.
- Revisit Vercel or another cloud frontend host later if public beta, preview deployments, or broader external access become priorities.

### Monitoring
- **Sentry**: Error tracking and performance monitoring for both frontend and API routes.
- **PostHog**: Product analytics (feature usage, funnel analysis, retention) — critical for understanding which features drive value.
- **Upstash**: Managed Redis in production with built-in monitoring dashboard.

---

## 4. Proposed File Tree

```
social-suite/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # lint, type-check, test, build
│       └── deploy.yml                      # Vercel + Railway deploy
├── wiki/                                   # project documentation
│   ├── MOSCOW.md
│   ├── FEASIBILITY.md
│   └── PLAN.md                             # this file
├── public/
│   ├── icons/                              # platform icons, favicon
│   └── og-image.png
├── src/
│   ├── app/                                # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx
│   │   │   └── sign-up/
│   │   │       └── [[...sign-up]]/
│   │   │           └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                  # dashboard shell: sidebar, top nav, org switcher
│   │   │   ├── page.tsx                    # home / overview dashboard
│   │   │   ├── learn/
│   │   │   │   └── page.tsx                # analytics dashboard
│   │   │   ├── plan/
│   │   │   │   └── page.tsx                # ML-backed content calendar
│   │   │   ├── predict/
│   │   │   │   └── page.tsx                # pre-publish performance simulator
│   │   │   ├── draft/
│   │   │   │   └── page.tsx                # AI caption / content generator
│   │   │   ├── inbox/
│   │   │   │   └── page.tsx                # unified inbox (DMs, comments, mentions)
│   │   │   ├── schedule/
│   │   │   │   └── page.tsx                # post scheduler / publishing calendar
│   │   │   ├── listen/
│   │   │   │   └── page.tsx                # social listening & sentiment analysis
│   │   │   ├── voice/
│   │   │   │   └── page.tsx                # brand voice manager
│   │   │   └── settings/
│   │   │       ├── page.tsx                # general settings
│   │   │       ├── integrations/
│   │   │       │   └── page.tsx            # connect social accounts (OAuth)
│   │   │       └── team/
│   │   │           └── page.tsx            # team / role management
│   │   └── api/
│   │       ├── webhooks/
│   │       │   ├── meta/route.ts           # Meta webhook receiver
│   │       │   ├── tiktok/route.ts         # TikTok webhook receiver
│   │       │   └── linkedin/route.ts       # LinkedIn webhook receiver
│   │       ├── posts/route.ts              # CRUD for posts
│   │       ├── analytics/route.ts          # analytics data endpoints
│   │       ├── predict/route.ts            # proxy to ML microservice
│   │       ├── draft/route.ts              # Claude caption generation
│   │       ├── inbox/route.ts              # inbox message endpoints
│   │       └── listen/route.ts             # social listening endpoints
│   ├── components/
│   │   ├── ui/                             # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   ├── charts/                         # Recharts / Tremor wrappers
│   │   │   ├── EngagementChart.tsx
│   │   │   ├── ReachChart.tsx
│   │   │   └── PlatformComparisonChart.tsx
│   │   ├── learn/
│   │   │   ├── KpiCards.tsx                # engagement rate, reach, clicks, impressions
│   │   │   ├── TopPostsTable.tsx           # sortable table of top-performing posts
│   │   │   ├── ContentGapsGrid.tsx         # AI-identified content opportunities
│   │   │   └── PlatformBreakdown.tsx       # per-platform performance comparison
│   │   ├── plan/
│   │   │   ├── ContentCalendar.tsx         # Mon-Sun grid with drag-and-drop
│   │   │   ├── RecommendationCard.tsx      # AI suggestion with predicted lift
│   │   │   └── PlatformFilter.tsx          # filter calendar by platform
│   │   ├── predict/
│   │   │   ├── PredictForm.tsx             # post metadata input form
│   │   │   ├── PredictionResults.tsx       # predicted metrics with confidence intervals
│   │   │   └── MetricTierBadge.tsx         # Low / Medium / High tier indicator
│   │   ├── draft/
│   │   │   ├── DraftForm.tsx               # platform, topic, tone, CTA inputs
│   │   │   ├── CaptionVariants.tsx         # multi-variant output display
│   │   │   ├── SlopScoreCard.tsx           # AI authenticity score + flagged phrases
│   │   │   └── VoiceGuidePanel.tsx         # brand voice reference sidebar
│   │   ├── inbox/
│   │   │   ├── MessageThread.tsx           # conversation thread view
│   │   │   └── InboxSidebar.tsx            # contact list / conversation list
│   │   └── shared/
│   │       ├── PlatformBadge.tsx           # colored platform icon + label
│   │       ├── PostPreview.tsx             # mock post preview (IG, TikTok, etc.)
│   │       └── AccountSwitcher.tsx         # org / account selector
│   ├── lib/
│   │   ├── api/
│   │   │   ├── meta.ts                     # Meta Graph API client
│   │   │   ├── tiktok.ts                   # TikTok for Business API client
│   │   │   ├── linkedin.ts                 # LinkedIn Marketing API client
│   │   │   ├── x.ts                        # X API v2 client
│   │   │   └── youtube.ts                  # YouTube Data API client
│   │   ├── ai/
│   │   │   ├── claude.ts                   # Anthropic SDK client (singleton)
│   │   │   ├── draft.ts                    # caption generation prompts + tool schemas
│   │   │   ├── slop-filter.ts              # AI "slop" detector (Haiku-powered)
│   │   │   └── voice.ts                    # brand voice extraction + enforcement
│   │   ├── ml/
│   │   │   ├── predict.ts                  # HTTP client for FastAPI ML service
│   │   │   └── features.ts                 # feature engineering helpers (shared types)
│   │   ├── db/
│   │   │   ├── index.ts                    # Supabase client initialization
│   │   │   ├── posts.ts                    # post CRUD queries
│   │   │   ├── analytics.ts               # analytics data queries
│   │   │   └── accounts.ts                # social account connection queries
│   │   ├── queue/
│   │   │   ├── scheduler.ts               # BullMQ queue definitions
│   │   │   └── workers/
│   │   │       ├── post-publisher.ts       # publishes scheduled posts to platform APIs
│   │   │       └── analytics-sync.ts       # periodic analytics pull from platform APIs
│   │   └── utils/
│   │       ├── platforms.ts               # platform constants, colors, limits
│   │       └── formatting.ts              # date formatting, number abbreviation
│   ├── hooks/
│   │   ├── useAnalytics.ts                # SWR/React Query hook for analytics data
│   │   ├── usePostForm.ts                 # form state for post creation
│   │   └── useRealtimeInbox.ts            # Supabase Realtime subscription for inbox
│   ├── types/
│   │   ├── platform.ts                    # Platform enum, PlatformAccount interface
│   │   ├── post.ts                        # Post, ScheduledPost, PublishedPost
│   │   ├── analytics.ts                   # AnalyticsSnapshot, KPI, TimeSeries
│   │   └── predict.ts                     # PredictionRequest, PredictionResult
│   └── middleware.ts                       # Clerk auth middleware (route protection)
├── ml_service/                             # Python FastAPI ML microservice
│   ├── main.py                             # FastAPI app, /predict and /retrain endpoints
│   ├── models/
│   │   └── .gitkeep                        # trained .pkl files (gitignored in prod)
│   ├── training/
│   │   └── train.py                        # retraining pipeline: pull data, engineer features, train, save
│   ├── requirements.txt                    # fastapi, uvicorn, scikit-learn, pandas, httpx
│   └── Dockerfile
├── supabase/
│   ├── migrations/                         # SQL migration files
│   │   ├── 001_create_orgs.sql
│   │   ├── 002_create_accounts.sql
│   │   ├── 003_create_posts.sql
│   │   ├── 004_create_analytics.sql
│   │   └── 005_create_inbox.sql
│   └── seed.sql                            # dev seed data
├── .env.example                            # template for required env vars
├── .env.local                              # local dev secrets (gitignored)
├── docker-compose.yml                      # local dev: postgres + redis + ml_service
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. Feature Roadmap (Phased)

### Phase 1 — Foundation (Weeks 1–4)

- **Auth and multi-tenancy**: Clerk integration with organizations. Roles: admin, editor, viewer, client. Middleware protecting all `(dashboard)` routes.
- **Connect social accounts**: OAuth flows for Meta (Facebook + Instagram), TikTok, LinkedIn, and X. Store tokens encrypted in Supabase with automatic refresh.
- **Basic post publishing**: Compose and publish a post to a single platform. No scheduling yet — immediate publish only. Platform-specific validation (character limits, media requirements).
- **Learn tab v1**: Pull real analytics from connected accounts via platform APIs. KPI cards (engagement rate, reach, clicks, impressions) and top posts table. Data synced on-demand and cached in PostgreSQL.
- **Database schema**: Core tables — `orgs`, `org_members`, `social_accounts`, `posts`, `post_analytics`. Row Level Security policies tied to `org_id`.
- **Local dev environment**: Docker Compose with PostgreSQL, Redis, and the ML service stub.

### Phase 2 — The Core Workflow (Weeks 5–8)

- **Plan tab**: ML-backed content calendar. Analyzes the org's Learn data (top topics, best posting times, content gaps), applies retrained recommendation and ranking models, and generates a week of recommendations. Each slot includes topic, tone, platform, format, confidence, and predicted engagement lift. Drag-and-drop rearrangement. LLMs may be used only to explain or package the recommendation.
- **Predict tab**: Deploy the FastAPI ML microservice. Train initial models on the connected account's historical post data. Prediction form accepts post metadata and returns predicted engagement rate, clicks, reach, and impressions with confidence intervals and actionable tips.
- **Draft tab**: Claude-powered caption generation. Inputs: platform, topic, tone, CTA, campaign name. Outputs: 3–5 caption variants with platform-specific formatting. Integration with Predict to show estimated performance per variant.
- **AI Slop Filter**: Haiku-powered scoring pass on every generated caption. Flags generic phrases ("In today's fast-paced world..."), excessive emojis, hollow CTAs, and corporate buzzwords. Slop score displayed on each variant.
- **Post scheduling**: BullMQ-based scheduler. Schedule posts for future publishing with precision timing. Retry logic for API failures. Queue dashboard for monitoring.

### Phase 3 — Engagement & Inbox (Weeks 9–12)

- **Unified Inbox**: Aggregate DMs, comments, and mentions from Meta (Messenger + Instagram DMs), LinkedIn, and X into a single threaded inbox. Reply from within Social Suite.
- **Real-time updates**: Supabase Realtime subscriptions for new inbox messages. Webhook receivers for Meta, TikTok, and LinkedIn push new messages into the database, triggering real-time UI updates.
- **Social Listening beta**: Reddit API integration for keyword monitoring. Set up keyword alerts for brand mentions, competitor names, and industry topics. Basic sentiment analysis via Claude Haiku.
- **Learn tab v2**: Cross-platform comparison charts. Content performance by topic, format, and posting time. Automated weekly performance summary email.

### Phase 4 — Advanced Features (Weeks 13–18)

- **Voice Manager**: Extract brand voice profile from the org's top-performing posts using Claude. Stores tone descriptors, vocabulary preferences, banned phrases, and example posts. Voice profile injected into all Draft and Plan prompts.
- **Content Recycling**: Identify evergreen top-performing posts and automatically suggest or schedule re-posts with refreshed captions. Configurable cooldown period.
- **Collaborative Approval Workflows**: Multi-step review process. Editors create drafts, admins approve, clients can request changes. Status tracking (draft → in review → approved → scheduled → published).
- **Burnout Prevention**: Track posting frequency, response time expectations, and after-hours activity. Surface nudges when patterns indicate unsustainable workload. Weekly wellness summary for team leads.
- **Advanced analytics**: First-party conversion tracking via UTM parameters and pixel integration. Attribute website conversions back to specific social posts. ROI reporting per platform, campaign, and content type.
- **Predict v2**: Retrain models weekly via scheduled BullMQ job. A/B test predictions against actual results to measure and improve model accuracy. Accuracy dashboard for transparency.

---

## 6. Key Architectural Decisions

### Why Next.js over separate frontend/backend

A separate React SPA + Express/Fastify backend doubles the deployment surface, requires CORS configuration, and splits the codebase for a team of one. Next.js App Router colocates pages and API routes, server components fetch data without client-side waterfalls, and Vercel deployment is zero-config. API routes handle webhook receivers, CRUD, and AI proxy calls. Heavy background work (post scheduling, analytics sync, ML retraining) runs in separate BullMQ worker processes on Railway — these are the only pieces that need a long-lived server.

### Why Supabase

Supabase provides managed PostgreSQL, Realtime subscriptions (critical for the inbox), Row Level Security (critical for multi-tenancy), Auth (backup option if Clerk doesn't work out), and Storage (media uploads) in a single service. The alternative — self-managed Postgres + custom WebSocket server + separate S3 bucket + separate auth — is 4x the infrastructure for a solo developer. Supabase's JS client integrates directly with Next.js server components and client components.

### Why ML-first instead of AI-first

The strongest differentiator from generic AI tools is not "it can generate captions." The differentiator is that Krowdr collects account history, learns from actual performance, retrains on new data, and uses predictive pipelines to recommend what should happen next. That is the core Intex-II insight and it should remain the product center.

LLMs still matter, but mainly where language generation or summarization is genuinely needed:
- writing captions
- enforcing brand voice
- explaining model-backed recommendations in plain language
- optional operator chat

### Why keep the Python ML microservice

The Intex-II pattern — FastAPI serving scikit-learn Gradient Boosting models — is the right architecture for this problem. Post metadata is tabular data (platform, post type, hashtag count, word count, posting hour, day of week), and GBM is the best algorithm for tabular prediction. Deep learning would be overkill and slower. The production upgrade is not replacing the architecture but upgrading the pipeline: per-account model training, automated retraining, model versioning, and confidence intervals. A Python microservice also keeps ML dependencies (numpy, pandas, scikit-learn) out of the Node.js app. The service runs in a Docker container on Railway with a simple HTTP interface — the Next.js API route at `/api/predict` proxies requests to it.

### Why BullMQ over cron

Social post scheduling requires: (1) precision timing — a post scheduled for 2:47 PM must publish at 2:47 PM, not "sometime in the next minute when cron runs," (2) retry logic — if the Meta API returns a rate limit error, the job should retry with exponential backoff, not silently fail, (3) priority queues — a scheduled post takes priority over a background analytics sync, (4) job visibility — the team needs to see what's queued, what's processing, and what failed. BullMQ handles all four. Cron handles none. BullMQ is backed by Redis, which is already in the stack for caching and real-time pub/sub.

### Why managed Supabase plus homelab app for v1

Running the app tier on the homelab keeps costs low and gives full control over long-lived workers and ML services. Keeping managed Supabase for Postgres/storage/realtime avoids turning a product build into a full infrastructure project too early. This is the best balance between speed, cost, and operational sanity for v1.

### Why Clerk over Supabase Auth

Clerk provides a complete multi-tenant solution out of the box: organizations, roles, invitations, and a pre-built UI for sign-in/sign-up. Supabase Auth handles authentication but not authorization (roles, orgs). Building multi-tenancy on top of Supabase Auth means custom tables, custom middleware, and custom UI for org management. Clerk's `auth()` helper in Next.js middleware returns `orgId` and `orgRole` directly, which drives Row Level Security policies in Supabase. The trade-off is vendor dependency and cost ($25/mo for the Pro plan), but the development time saved is worth it for a solo developer.
