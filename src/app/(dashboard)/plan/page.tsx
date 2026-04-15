"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { cn } from "@/lib/utils";
import { addDays, dateKeyInTimeZone, formatShortMonthDay, weekIndexMon0 } from "@/lib/datetime";
import { getWorkspaceTimezoneClient } from "@/lib/demo-session";
import { ChevronLeft, ChevronRight, ExternalLink, RefreshCw, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Post, PostStatus } from "@/types/post";
import type { PlatformId } from "@/types/platform";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMonday(date: Date, timeZone: string): Date {
  const d = new Date(date);
  const idx = weekIndexMon0(d, timeZone);
  const monday = addDays(d, -idx);
  monday.setHours(12, 0, 0, 0);
  return monday;
}

function formatWeekRange(monday: Date, timeZone: string): string {
  const sunday = addDays(monday, 6);
  return `${formatShortMonthDay(monday, timeZone)} – ${formatShortMonthDay(sunday, timeZone)}`;
}

function getPostsForDay(posts: Post[], day: Date, timeZone: string): Post[] {
  const dateKey = dateKeyInTimeZone(day, timeZone);
  return posts.filter((p) => p.scheduledAt && dateKeyInTimeZone(p.scheduledAt, timeZone) === dateKey);
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const statusColors: Record<PostStatus, string> = {
  draft:     "text-[#625d58] border-[#625d58]/30",
  scheduled: "text-warm border-warm/40",
  published: "text-[#536443] border-[#536443]/40",
  failed:    "text-[#9e4d3b] border-[#9e4d3b]/40",
};

interface Recommendation {
  platform: PlatformId;
  topic: string;
  tone: string;
  format: string;
  lift: string;
  day: string;
}

const recommendationSets: Recommendation[][] = [
  [
    { platform: "instagram", topic: "Behind-the-scenes content", tone: "Casual", format: "Reel", lift: "+18%", day: "Mon" },
    { platform: "linkedin", topic: "Industry insight or hot take", tone: "Authoritative", format: "Text post", lift: "+24%", day: "Wed" },
    { platform: "tiktok", topic: "Tutorial or how-to", tone: "Energetic", format: "Video", lift: "+31%", day: "Thu" },
  ],
  [
    { platform: "x", topic: "Opinion thread on current trend", tone: "Conversational", format: "Thread", lift: "+22%", day: "Tue" },
    { platform: "instagram", topic: "Product showcase with testimonial", tone: "Professional", format: "Carousel", lift: "+19%", day: "Thu" },
    { platform: "linkedin", topic: "Team spotlight or hiring update", tone: "Friendly", format: "Image post", lift: "+14%", day: "Fri" },
  ],
  [
    { platform: "tiktok", topic: "Day-in-the-life of your brand", tone: "Playful", format: "Video", lift: "+37%", day: "Mon" },
    { platform: "facebook", topic: "Community question or poll", tone: "Warm", format: "Text post", lift: "+12%", day: "Wed" },
    { platform: "instagram", topic: "User-generated content repost", tone: "Appreciative", format: "Story", lift: "+28%", day: "Sat" },
  ],
];

// ─── Post Modal ───────────────────────────────────────────────────────────────

function PostModal({
  post,
  open,
  onOpenChange,
  timeZone,
}: {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeZone: string;
}) {
  const router = useRouter();
  const scheduledTime = post.scheduledAt
    ? new Date(post.scheduledAt).toLocaleString("en-US", {
        timeZone,
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-panel border border-border rounded-lg shadow-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <PlatformBadge platformId={post.platformId} size="sm" />
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", statusColors[post.status])}>
                {post.status}
              </span>
            </div>
            <Dialog.Close asChild>
              <button aria-label="Close" className="p-1 hover:bg-shell rounded transition-colors text-[#625d58]">
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-5 py-4 space-y-3">
            {scheduledTime && <p className="text-xs text-[#625d58]">{scheduledTime}</p>}
            <p className="text-sm text-ink leading-relaxed">{post.content}</p>
          </div>

          <div className="flex items-center justify-end px-5 py-4 border-t border-border">
            <button
              onClick={() => {
                onOpenChange(false);
                router.push("/schedule");
              }}
              className="flex items-center gap-1.5 text-xs text-warm hover:underline"
            >
              Edit in Schedule
              <ExternalLink className="size-3" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlanPage() {
  const router = useRouter();
  const timeZone = getWorkspaceTimezoneClient();
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date(), timeZone));
  const [recSetIndex, setRecSetIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  const recommendations = recommendationSets[recSetIndex];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingPosts(true);
      setPostsError(null);
      try {
        const res = await fetch("/api/scheduled-posts", { cache: "no-store" });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || `request_failed_${res.status}`);
        }
        const body = (await res.json()) as { posts: Post[] };
        if (cancelled) return;
        setPosts(body.posts || []);
      } catch (e) {
        if (cancelled) return;
        setPostsError(e instanceof Error ? e.message : "Failed to load scheduled posts");
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNavigate = (dir: 1 | -1) => {
    setWeekStart((prev) => addDays(prev, dir * 7));
  };

  const handleRegenerate = () => {
    setRecSetIndex((prev) => (prev + 1) % recommendationSets.length);
  };

  return (
    <div>
      <PageHeader
        title="Plan"
        description="ML-backed content calendar. Each recommendation is ranked by predicted engagement lift."
        action={
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-warm text-paper rounded-md text-xs font-medium hover:bg-warm/90 transition-colors"
          >
            <RefreshCw className="size-3" />
            Regenerate week
          </button>
        }
      />

      {/* Week Calendar */}
      <div className="bg-panel border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">
            Week of {formatWeekRange(weekStart, timeZone)}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => handleNavigate(-1)}
              aria-label="Previous week"
              className="px-2.5 py-1 text-xs border border-border rounded hover:bg-shell transition-colors"
            >
              <ChevronLeft className="size-3.5 text-[#625d58]" />
            </button>
            <button
              onClick={() => handleNavigate(1)}
              aria-label="Next week"
              className="px-2.5 py-1 text-xs border border-border rounded hover:bg-shell transition-colors"
            >
              <ChevronRight className="size-3.5 text-[#625d58]" />
            </button>
          </div>
        </div>

        {loadingPosts && (
          <div className="mb-3 text-xs text-[#625d58]">Loading scheduled posts…</div>
        )}
        {postsError && (
          <div className="mb-3 text-xs text-[#9e4d3b]">Could not load scheduled posts: {postsError}</div>
        )}

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const dayDate = addDays(weekStart, i);
            const dayPosts = getPostsForDay(posts, dayDate, timeZone);
            const isToday = dateKeyInTimeZone(dayDate, timeZone) === dateKeyInTimeZone(new Date(), timeZone);

            return (
              <div key={day} className="min-h-[160px]">
                <div className="text-center mb-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#625d58] font-medium">{day}</p>
                  <p
                    className={cn(
                      "text-sm font-medium mx-auto w-7 h-7 flex items-center justify-center rounded-full",
                      isToday ? "bg-warm text-paper" : "text-ink"
                    )}
                  >
                    {new Intl.DateTimeFormat("en-US", { timeZone, day: "numeric" }).format(dayDate)}
                  </p>
                </div>
                <div className="space-y-1.5">
                  {dayPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={cn(
                        "w-full text-left p-2 rounded border text-[10px] cursor-pointer hover:opacity-80 transition-opacity",
                        statusColors[post.status]
                      )}
                    >
                      <PlatformBadge platformId={post.platformId} size="xs" />
                      <p className="mt-1 line-clamp-2 leading-tight">{post.content}</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-sm font-semibold text-ink mb-4">
          AI recommendations — this week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.topic}
              className="bg-panel border border-border rounded-lg p-4 hover:border-warm/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <PlatformBadge platformId={rec.platform} size="sm" />
                <span className="text-xs font-medium text-[#536443] bg-[#536443]/10 px-2 py-0.5 rounded-full">
                  {rec.lift} lift
                </span>
              </div>
              <p className="text-sm font-medium text-ink mb-1">{rec.topic}</p>
              <p className="text-xs text-[#625d58] mb-3">
                {rec.tone} · {rec.format} · {rec.day}
              </p>
              <button
                onClick={() => router.push("/draft")}
                className="w-full text-xs font-medium text-warm border border-warm/30 rounded py-1.5 hover:bg-warm/5 transition-colors"
              >
                Send to Draft →
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedPost(null);
          }}
          timeZone={timeZone}
        />
      )}
    </div>
  );
}
