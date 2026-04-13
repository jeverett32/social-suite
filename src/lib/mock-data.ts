import type { KpiMetric, PostPerformance, PlatformBreakdown } from "@/types/analytics";
import type { Post } from "@/types/post";

export const mockKpis: KpiMetric[] = [
  { label: "Engagement Rate", value: 4.8, formatted: "4.8%", change: 12, trend: "up" },
  { label: "Total Reach", value: 284000, formatted: "284K", change: 8, trend: "up" },
  { label: "Link Clicks", value: 6420, formatted: "6,420", change: -3, trend: "down" },
  { label: "Impressions", value: 1200000, formatted: "1.2M", change: 21, trend: "up" },
];

export const mockTopPosts: PostPerformance[] = [
  {
    postId: "1",
    platformId: "instagram",
    content: "Behind the scenes of our latest campaign shoot 🎬",
    impressions: 42000,
    engagement: 5.2,
    clicks: 1800,
    shares: 240,
    publishedAt: "2026-04-10",
  },
  {
    postId: "2",
    platformId: "tiktok",
    content: "3 social media mistakes you're probably making right now",
    impressions: 98000,
    engagement: 8.1,
    clicks: 3200,
    shares: 1400,
    publishedAt: "2026-04-08",
  },
  {
    postId: "3",
    platformId: "linkedin",
    content: "Why we stopped scheduling posts randomly (and what happened next)",
    impressions: 18000,
    engagement: 4.4,
    clicks: 920,
    shares: 380,
    publishedAt: "2026-04-07",
  },
  {
    postId: "4",
    platformId: "facebook",
    content: "New feature drop: brand voice profiles are here 🎉",
    impressions: 24000,
    engagement: 3.7,
    clicks: 740,
    shares: 190,
    publishedAt: "2026-04-05",
  },
  {
    postId: "5",
    platformId: "x",
    content: "Hot take: most social media advice is written by people who don't run accounts.",
    impressions: 62000,
    engagement: 6.3,
    clicks: 2100,
    shares: 880,
    publishedAt: "2026-04-03",
  },
];

export const mockPlatformBreakdown: PlatformBreakdown[] = [
  { platformId: "instagram", reach: 84000, engagement: 5.2, posts: 12 },
  { platformId: "tiktok", reach: 120000, engagement: 7.8, posts: 8 },
  { platformId: "linkedin", reach: 38000, engagement: 4.1, posts: 14 },
  { platformId: "facebook", reach: 26000, engagement: 2.9, posts: 10 },
  { platformId: "x", reach: 16000, engagement: 3.4, posts: 22 },
];

export const mockScheduledPosts: Post[] = [
  {
    id: "sp1",
    platformId: "instagram",
    content: "Monday motivation — your brand story matters.",
    format: "image",
    scheduledAt: "2026-04-14T09:00:00Z",
    status: "scheduled",
  },
  {
    id: "sp2",
    platformId: "tiktok",
    content: "5 things I wish I knew before launching on TikTok",
    format: "video",
    scheduledAt: "2026-04-14T17:00:00Z",
    status: "scheduled",
  },
  {
    id: "sp3",
    platformId: "linkedin",
    content: "Q1 recap: what worked, what didn't, and what's next",
    format: "text",
    scheduledAt: "2026-04-15T10:30:00Z",
    status: "scheduled",
  },
  {
    id: "sp4",
    platformId: "instagram",
    content: "Product spotlight: the feature our users ask about most",
    format: "carousel",
    scheduledAt: "2026-04-16T12:00:00Z",
    status: "draft",
  },
  {
    id: "sp5",
    platformId: "facebook",
    content: "Community highlight — shoutout to this week's top engagement",
    format: "image",
    scheduledAt: "2026-04-17T14:00:00Z",
    status: "scheduled",
  },
];

export const mockInboxThreads = [
  {
    id: "t1",
    platformId: "instagram" as const,
    sender: "@maya.creates",
    preview: "Hey! Loved the post about brand voice — any tips for smaller accounts?",
    time: "2m ago",
    unread: true,
    messages: [
      { from: "them", text: "Hey! Loved the post about brand voice — any tips for smaller accounts?", time: "2m ago" },
    ],
  },
  {
    id: "t2",
    platformId: "linkedin" as const,
    sender: "Jordan Kim",
    preview: "Would love to connect and chat about the content calendar feature",
    time: "14m ago",
    unread: true,
    messages: [
      { from: "them", text: "Would love to connect and chat about the content calendar feature", time: "14m ago" },
    ],
  },
  {
    id: "t3",
    platformId: "x" as const,
    sender: "@ContentOps",
    preview: "Replying to your thread: totally agree about the scheduling problem",
    time: "1h ago",
    unread: false,
    messages: [
      { from: "them", text: "Replying to your thread: totally agree about the scheduling problem", time: "1h ago" },
    ],
  },
  {
    id: "t4",
    platformId: "instagram" as const,
    sender: "@thebrandstudio",
    preview: "Do you offer agency plans? We manage 12 accounts",
    time: "3h ago",
    unread: false,
    messages: [
      { from: "them", text: "Do you offer agency plans? We manage 12 accounts", time: "3h ago" },
    ],
  },
  {
    id: "t5",
    platformId: "facebook" as const,
    sender: "Priya M.",
    preview: "Just signed up — the onboarding is really clean btw 👏",
    time: "5h ago",
    unread: false,
    messages: [
      { from: "them", text: "Just signed up — the onboarding is really clean btw 👏", time: "5h ago" },
    ],
  },
];

export const mockKeywords = [
  { keyword: "Krowdr", mentions: 84, sentiment: "positive" as const, change: 12 },
  { keyword: "social media burnout", mentions: 2400, sentiment: "negative" as const, change: 34 },
  { keyword: "content calendar", mentions: 8900, sentiment: "neutral" as const, change: -5 },
  { keyword: "AI captions", mentions: 4200, sentiment: "neutral" as const, change: 22 },
  { keyword: "brand voice", mentions: 1800, sentiment: "positive" as const, change: 8 },
  { keyword: "Hootsuite alternative", mentions: 640, sentiment: "neutral" as const, change: 41 },
];
