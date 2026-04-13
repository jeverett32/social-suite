# Krowdr Dashboard Frontend Plan

## Requirements Summary

- Build the post-login Krowdr dashboard as a frontend-only experience first.
- Keep the visual language aligned with the current marketing site:
  - editorial typography and restrained motion from `index.html`
  - clean white layout, thin rules, warm/olive accents, and no gradients
  - polished, intentional framing rather than generic KPI-card spam
- Design the dashboard as if it were production-ready, even if the data is mocked.
- Prioritize the primary home dashboard screen and its surrounding navigation shell.
- Make it clear that Krowdr is for social media marketers, content leads, and agency teams.

## Existing Design Cues To Reuse

- Navigation and button tone from `index.html` lines 61, 117, and 138.
- Section rhythm and headline/copy balance from `index.html` lines 313, 345, and 355.
- Structured multi-column summaries from `features.html` lines 126 and 139.
- Functional framed surfaces from `features.html` line 151.

## Dashboard North Star

Krowdr should feel like a calm editorial control room for social teams:

- less “data center”
- more “creative operations desk”
- clear hierarchy
- visible momentum
- enough analytics to steer decisions without drowning the screen

The first logged-in screen should answer five questions immediately:

1. What is going live next?
2. What needs review today?
3. Where is the team blocked?
4. How is the current campaign month performing?
5. What should I work on first?

## Recommended Information Architecture

### App Shell

- **Left rail**
  - Home
  - Campaigns
  - Calendar
  - Drafts
  - Approvals
  - Analytics
  - Assets
  - Team
  - Settings

- **Top bar**
  - workspace switcher
  - date range / campaign filter
  - search
  - notifications
  - quick create button
  - user menu

### Primary Dashboard Page

Use a 12-column responsive layout with three visual zones:

1. **Morning brief header**
2. **Main workflow grid**
3. **Performance and activity band**

## Recommended Home Dashboard Layout

### 1. Morning Brief Header

Purpose: orient the user in under five seconds.

Content:
- greeting + role-aware summary
- current campaign focus
- concise “today” sentence
- quick actions:
  - New post
  - Review queue
  - Open calendar

Visual direction:
- wide horizontal band
- white background with rule dividers
- serif headline, sans UI labels
- no giant hero image inside the app

### 2. Today Board

Purpose: show the most urgent work in one glance.

Recommended modules:
- **Needs approval**
- **Scheduled today**
- **Blocked**
- **Ready to draft**

Visual direction:
- four functional framed tiles in one row on desktop
- stack to two-by-two on tablet
- each tile gets:
  - count
  - short label
  - one line of supporting context
  - micro trend or urgency marker

These are allowed to be framed because they are working tools, not decorative cards.

### 3. Calendar + Pipeline Split

Purpose: give the dashboard a live operational center.

Left side:
- **Weekly publishing timeline**
  - day columns
  - scheduled posts
  - channel markers
  - approval state chips

Right side:
- **Content pipeline**
  - Drafting
  - In review
  - Approved
  - Scheduled

Visual direction:
- this should be the visual anchor of the screen
- think editorial planning board, not kanban software screenshot
- use thin dividers, soft background blocks, and tight typography

### 4. Approval Queue

Purpose: keep feedback and signoff visible.

Content:
- content title
- channel
- assignee
- reviewer
- due time
- status

Polish note:
- use a beautifully spaced table/list hybrid, not a dense spreadsheet
- each row should feel readable and deliberate

### 5. Performance Pulse

Purpose: connect operations to outcomes.

Content:
- top campaign this week
- best-performing post
- one underperforming area
- short recommendation sentence

Visual direction:
- narrative-first analytics
- include one chart and two to three supporting metrics
- avoid a wall of equal-sized stat boxes

### 6. Team Activity / Notes Rail

Purpose: preserve the human side of the workflow.

Content:
- recent comments
- approvals completed
- campaign notes
- teammate updates

Placement:
- right rail on wide screens
- lower section on narrower screens

## Secondary Views To Support The Dashboard

These do not need to be fully built first, but the shell should anticipate them:

- **Campaigns**
  - list + featured campaign view
- **Calendar**
  - full-screen monthly/weekly scheduler
- **Drafts**
  - content studio / writing area
- **Approvals**
  - reviewer-focused queue
- **Analytics**
  - deeper reporting view with comparisons

## Visual System For The App

### Keep

- white / off-white paper base
- black/charcoal type
- warm clay and olive as restrained accents
- serif only for major page headlines and section titles
- Inter for all UI, tables, labels, controls, and metadata
- smooth reveal and hover transitions
- line-based structure

### Avoid

- gradients
- glassmorphism
- glow effects
- giant circular charts as decoration
- over-rounded cards
- generic SaaS dashboard tropes
- too many equal-weight boxes competing for attention

### Surface Rules

- framed panels are allowed only when they are functional tools:
  - calendar board
  - approval list
  - analytics panel
  - composer tray
- use 8px or less border radius
- rely on borders, spacing, and type contrast before shadows

## Interaction Polish

- nav hover states should feel crisp and quiet
- dashboard modules should reveal progressively on load
- filters and view changes should animate subtly, not bounce
- timeline and queue states should feel “alive” through motion and status markers
- quick-create should open a refined command-style panel later

## Frontend-Only Build Plan

### Target Files

- `dashboard.html`
- `dashboard.css`
- `dashboard.js`

### Optional but recommended follow-up refactor

To reduce duplicated styling across marketing and app pages:

- `shared.css`
  - brand tokens
  - nav styles
  - buttons
  - typography scale
  - reveal utilities

## Implementation Steps

1. **Extract shared design tokens**
   - move the stable Krowdr brand primitives out of page-local styles
   - capture colors, rules, buttons, type scale, spacing rhythm, and reveal behavior

2. **Build the authenticated app shell**
   - left rail
   - top bar
   - responsive content container
   - active nav states

3. **Build the dashboard home layout**
   - morning brief header
   - today board
   - calendar + pipeline centerpiece
   - approval queue
   - performance pulse
   - team activity rail

4. **Add believable mock data and UI states**
   - overdue approvals
   - scheduled posts
   - campaign names
   - channel badges
   - teammate avatars/initials
   - trend indicators

5. **Polish interaction and responsiveness**
   - desktop
   - laptop
   - tablet
   - mobile navigation behavior
   - load transitions
   - hover/focus states

6. **Wire auth demo flow into dashboard shell**
   - update `auth.html` demo actions so they can route into `dashboard.html`

## Acceptance Criteria

- A user can open a frontend-only dashboard after login/register entry.
- The dashboard has a persistent app shell with left navigation and top controls.
- The home screen clearly shows:
  - today’s priorities
  - publishing timeline
  - approval queue
  - performance snapshot
  - team activity
- The design is recognizably part of the same Krowdr system as the landing/features/auth pages.
- The dashboard avoids gradients, decorative glow, and generic equal-weight card grids.
- Desktop and mobile layouts both preserve hierarchy and readability.
- Mock data feels believable for a real social marketing team.

## Risks And Mitigations

- **Risk:** The dashboard becomes too data-heavy and loses the editorial calm.
  - **Mitigation:** Keep one dominant center module and two to three supporting zones, not six competing highlights.

- **Risk:** The app shell diverges visually from the marketing site.
  - **Mitigation:** Reuse the same tokens, button language, type pairing, and rule-based spacing.

- **Risk:** Frontend-only mocks feel fake or sterile.
  - **Mitigation:** Use realistic campaign names, channel states, review comments, and publishing examples.

- **Risk:** Mobile becomes an afterthought.
  - **Mitigation:** Design the responsive shell from the start:
    - collapsible rail
    - stacked dashboard modules
    - readable approval rows

## Verification Steps

- Verify the dashboard reads clearly at desktop width and mobile width.
- Verify the first viewport answers the “what should I do first?” question.
- Verify every major module has a clear functional purpose.
- Verify the visual language still feels like Krowdr:
  - white background
  - restrained accents
  - editorial typography
  - no AI-ish gimmicks
- Verify auth entry points can link into the dashboard route cleanly.

## Recommendation

Start with **one flagship dashboard screen** rather than trying to design the whole app at once.

The first implementation should be:

- app shell
- home dashboard
- mocked workflow data

That gives us the visual and interaction benchmark for the rest of the product. Once that feels right, we can spin out deeper views like Calendar, Drafts, Approvals, and Analytics with much less guesswork.
