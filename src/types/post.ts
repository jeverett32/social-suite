import type { PlatformId } from "./platform";

export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type PostFormat = "image" | "video" | "reel" | "carousel" | "text" | "story";

export interface Post {
  id: string;
  platformId: PlatformId;
  content: string;
  mediaUrl?: string;
  format: PostFormat;
  scheduledAt?: string;
  publishedAt?: string;
  status: PostStatus;
  tags?: string[];
}
