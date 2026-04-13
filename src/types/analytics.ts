import type { PlatformId } from "./platform";

export interface KpiMetric {
  label: string;
  value: number;
  formatted: string;
  change: number; // percentage change vs previous period
  trend: "up" | "down" | "flat";
}

export interface PostPerformance {
  postId: string;
  platformId: PlatformId;
  content: string;
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  publishedAt: string;
}

export interface PlatformBreakdown {
  platformId: PlatformId;
  reach: number;
  engagement: number;
  posts: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}
