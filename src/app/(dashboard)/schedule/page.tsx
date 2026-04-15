"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { cn } from "@/lib/utils";
import { dateKeyInTimeZone, formatMonthYear, formatDayNumber } from "@/lib/datetime";
import { getWorkspaceTimezoneClient } from "@/lib/demo-session";
import { NEW_POST_SEED_KEY } from "@/lib/seed-keys";
import {
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Edit,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText,
  AlertCircle,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Post, PostStatus } from "@/types/post";
import type { PlatformId } from "@/types/platform";

type ViewMode = "calendar" | "queue";
type FilterStatus = "all" | PostStatus;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateTimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

const statusColors: Record<PostStatus, string> = {
  draft:     "text-[#625d58] border-[#625d58]/30",
  scheduled: "text-warm border-warm/40",
  published: "text-[#536443] border-[#536443]/40",
  failed:    "text-[#9e4d3b] border-[#9e4d3b]/40",
};

const formatIcons: Record<string, typeof ImageIcon> = {
  image: ImageIcon,
  video: Video,
  reel: Video,
  carousel: ImageIcon,
  text: FileText,
  story: ImageIcon,
};

function getPostsForDate(posts: Post[], date: Date, timeZone: string): Post[] {
  const dateKey = dateKeyInTimeZone(date, timeZone);
  return posts.filter((post) => post.scheduledAt && dateKeyInTimeZone(post.scheduledAt, timeZone) === dateKey);
}

function formatScheduledTime(dateStr: string, timeZone: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getRelativeGroup(post: Post, timeZone: string): string {
  if (!post.scheduledAt) return "Later";

  const now = new Date();
  const today = dateKeyInTimeZone(now, timeZone);
  const tomorrow = dateKeyInTimeZone(new Date(now.getTime() + 86400000), timeZone);
  const weekEnd = dateKeyInTimeZone(new Date(now.getTime() + 7 * 86400000), timeZone);
  const postDate = dateKeyInTimeZone(post.scheduledAt, timeZone);

  if (postDate === today) return "Today";
  if (postDate === tomorrow) return "Tomorrow";
  if (postDate < weekEnd) return "This Week";
  return "Later";
}

function CalendarView({
  posts,
  currentMonth,
  onMonthChange,
  onPostClick,
  onDayClick,
  timeZone,
}: {
  posts: Post[];
  currentMonth: Date;
  onMonthChange: (dir: 1 | -1) => void;
  onPostClick: (post: Post) => void;
  onDayClick: (date: Date) => void;
  timeZone: string;
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(Date.UTC(year, month, 1, 12));
  const lastDay = new Date(Date.UTC(year, month + 1, 0, 12));
  const startPadding = (() => {
    // Map Mon..Sun to 0..6
    const wd = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(firstDay);
    const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    return map[wd] ?? 0;
  })();
  const daysInMonth = lastDay.getDate();
  const today = dateKeyInTimeZone(new Date(), timeZone);

  const days: (Date | null)[] = [];

  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(Date.UTC(year, month, i, 12)));
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthName = formatMonthYear(currentMonth, timeZone);

  return (
    <div className="bg-panel border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-ink">{monthName}</h2>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onMonthChange(-1)}
            className="p-1.5 hover:bg-shell rounded transition-colors"
          >
            <ChevronLeft className="size-4 text-[#625d58]" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => onMonthChange(1)}
            className="p-1.5 hover:bg-shell rounded transition-colors"
          >
            <ChevronRight className="size-4 text-[#625d58]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-[11px] uppercase tracking-wider font-medium text-[#625d58] border-b border-border"
          >
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="h-24 border-b border-r border-border bg-shell/50" />;
          }

          const dateStr = dateKeyInTimeZone(day, timeZone);
          const isToday = dateStr === today;
          const dayPosts = getPostsForDate(posts, day, timeZone);

          return (
            <div
              key={dateStr}
              className={cn(
                "h-24 border-b border-r border-border p-1.5 hover:bg-shell/50 transition-colors cursor-pointer group relative",
                isToday && "bg-warm/5"
              )}
              onClick={() => onDayClick(day)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${dateStr}`}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                onDayClick(day);
              }}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isToday ? "size-6 rounded-full bg-warm text-paper flex items-center justify-center" : "text-ink"
                )}
              >
                {formatDayNumber(day, timeZone)}
              </span>

              <div className="mt-1 space-y-0.5">
                {dayPosts.slice(0, 3).map((post) => (
                  <button
                    key={post.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPostClick(post);
                    }}
                    className={cn(
                      "w-full text-[10px] px-1.5 py-0.5 rounded truncate text-left border transition-colors hover:opacity-80",
                      statusColors[post.status]
                    )}
                  >
                    <span className="flex items-center gap-1">
                      <PlatformBadge platformId={post.platformId} size="xs" />
                      <span className="truncate">{post.content.split("\n")[0]}</span>
                    </span>
                  </button>
                ))}
                {dayPosts.length > 3 && (
                  <p className="text-[10px] text-[#625d58] px-1">+{dayPosts.length - 3} more</p>
                )}
              </div>

              <button
                type="button"
                aria-label="Add post"
                className="absolute bottom-1 right-1 size-5 rounded bg-warm/10 hover:bg-warm/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDayClick(day);
                }}
              >
                <Plus className="size-3 text-warm" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QueueView({
  posts,
  filter,
  onPostClick,
  onRequestDelete,
  timeZone,
}: {
  posts: Post[];
  filter: FilterStatus;
  onPostClick: (post: Post) => void;
  onRequestDelete: (post: Post) => void;
  timeZone: string;
}) {
  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const grouped = {
    Today: [] as Post[],
    Tomorrow: [] as Post[],
    "This Week": [] as Post[],
    Later: [] as Post[],
  };

  filteredPosts.forEach((post) => {
    const group = getRelativeGroup(post, timeZone);
    if (grouped[group as keyof typeof grouped]) {
      grouped[group as keyof typeof grouped].push(post);
    }
  });

  const groups = Object.entries(grouped).filter(([_, posts]) => posts.length > 0);

  if (filteredPosts.length === 0) {
    return (
      <div className="bg-panel border border-border rounded-lg p-12 text-center">
        <Calendar className="size-8 text-[#625d58] mx-auto mb-3 opacity-40" />
        <p className="text-sm font-medium text-ink mb-1">No posts found</p>
        <p className="text-xs text-[#625d58]">
          {filter === "all" ? "No scheduled posts yet" : `No ${filter} posts`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(([group, groupPosts]) => (
        <div key={group}>
          <h3 className="text-xs font-medium text-[#625d58] uppercase tracking-wider mb-3 px-1">{group}</h3>
          <div className="space-y-2">
            {groupPosts.map((post) => {
              const FormatIcon = formatIcons[post.format] || FileText;
              return (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className="bg-panel border border-border rounded-lg p-4 hover:border-warm/40 cursor-pointer transition-colors group"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open post: ${post.content.split("\n")[0]}`}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    if (e.currentTarget !== e.target) return;
                    e.preventDefault();
                    onPostClick(post);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-shell flex items-center justify-center flex-shrink-0">
                      <FormatIcon className="size-4 text-[#625d58]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <PlatformBadge platformId={post.platformId} size="sm" />
                        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", statusColors[post.status])}>
                          {post.status}
                        </span>
                        {post.scheduledAt && (
                          <span className="text-[11px] text-[#625d58] flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatScheduledTime(post.scheduledAt, timeZone)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink line-clamp-2">{post.content}</p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        aria-label="Edit post"
                        className="p-1.5 hover:bg-shell rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostClick(post);
                        }}
                      >
                        <Edit className="size-3.5 text-[#625d58]" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete post"
                        className="p-1.5 hover:bg-shell rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestDelete(post);
                        }}
                      >
                        <Trash2 className="size-3.5 text-[#625d58]" />
                      </button>
                      <button type="button" aria-label="More options" className="p-1.5 hover:bg-shell rounded transition-colors">
                        <MoreHorizontal className="size-3.5 text-[#625d58]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function PostModal({
  post,
  seed,
  open,
  onOpenChange,
  onSave,
}: {
  post?: Post | null;
  seed?: Partial<Post> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (post: Partial<Post>) => Promise<{ ok: true } | { ok: false; error: string }>;
}) {
  const [content, setContent] = useState(post?.content || seed?.content || "");
  const [platform, setPlatform] = useState<PlatformId>(post?.platformId || (seed?.platformId as PlatformId) || "instagram");
  const [status, setStatus] = useState<PostStatus>(post?.status || (seed?.status as PostStatus) || "draft");
  const [scheduledDate, setScheduledDate] = useState(
    post?.scheduledAt
      ? toDateTimeLocalValue(new Date(post.scheduledAt))
      : seed?.scheduledAt
        ? toDateTimeLocalValue(new Date(seed.scheduledAt))
        : ""
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setContent(post?.content || seed?.content || "");
    setPlatform((post?.platformId || (seed?.platformId as PlatformId) || "instagram") as PlatformId);
    setStatus((post?.status || (seed?.status as PostStatus) || "draft") as PostStatus);
    setScheduledDate(
      post?.scheduledAt
        ? toDateTimeLocalValue(new Date(post.scheduledAt))
        : seed?.scheduledAt
          ? toDateTimeLocalValue(new Date(seed.scheduledAt))
          : ""
    );
    setSaveError(null);
    setSaving(false);
  }, [open, post?.id, post?.scheduledAt, post?.content, post?.platformId, post?.status, seed?.content, seed?.platformId, seed?.scheduledAt, seed?.status]);

  const platforms: { id: PlatformId; label: string }[] = [
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "x", label: "X" },
    { id: "facebook", label: "Facebook" },
  ];

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const res = await onSave({
      ...seed,
      ...post,
      content,
      platformId: platform,
      status,
      scheduledAt: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
    });
    if (res.ok) {
      onOpenChange(false);
      return;
    }
    setSaveError(res.error);
    setSaving(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto bg-panel border border-border rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <Dialog.Title className="text-sm font-semibold text-ink">
              {post ? "Edit Post" : "Schedule Post"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="text-[#625d58] hover:text-ink">
                ×
              </button>
            </Dialog.Close>
          </div>

          <div className="p-5 space-y-4">
          {saveError && (
            <div className="text-xs text-[#9e4d3b]">{saveError}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-2">
              Platform
            </label>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPlatform(id)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                    platform === id
                      ? "bg-warm text-paper border-warm"
                      : "border-border text-[#625d58] hover:border-warm/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm resize-none"
              placeholder="Write your post content..."
            />
            <p className="text-[10px] text-[#625d58] mt-1 text-right">{content.length} characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">
                Schedule for
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm"
              />
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <ImageIcon className="size-8 text-[#625d58] mx-auto mb-2 opacity-40" />
            <p className="text-xs text-[#625d58]">Drag and drop media here, or click to upload</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="px-4 py-2 text-sm text-[#625d58] hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="px-4 py-2 bg-warm text-paper rounded-md text-sm font-medium hover:bg-warm/90 transition-colors"
          >
            {saving ? "Saving…" : status === "draft" ? "Save as Draft" : "Schedule Post"}
          </button>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  post,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onConfirm: (post: Post) => void | Promise<void>;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-panel border border-border rounded-lg shadow-lg">
          <div className="px-5 py-4 border-b border-border">
            <Dialog.Title className="text-sm font-semibold text-ink">Delete post?</Dialog.Title>
            <p className="mt-2 text-xs text-[#625d58]">
              This can&apos;t be undone.
            </p>
            {post && (
              <p className="mt-2 text-xs text-ink line-clamp-2">{post.content}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 px-5 py-4">
            <Dialog.Close asChild>
              <button type="button" className="px-4 py-2 text-sm text-[#625d58] hover:text-ink transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={() => {
                if (!post) return;
                void onConfirm(post);
                onOpenChange(false);
              }}
              className="px-4 py-2 bg-[#9e4d3b] text-paper rounded-md text-sm font-medium hover:bg-[#9e4d3b]/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Sidebar({
  posts,
  onNewPost,
  timeZone,
}: {
  posts: Post[];
  onNewPost: () => void;
  timeZone: string;
}) {
  const scheduled = posts.filter((p) => p.status === "scheduled");
  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  const upcoming = posts
    .filter((p) => p.scheduledAt && p.status === "scheduled")
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 5);

  return (
    <div className="w-72 flex-shrink-0 space-y-6">
      <button
        onClick={onNewPost}
        className="w-full flex items-center justify-center gap-2 bg-warm text-paper rounded-lg py-3 text-sm font-medium hover:bg-warm/90 transition-colors"
      >
        <Plus className="size-4" />
        New Post
      </button>

      <div className="bg-panel border border-border rounded-lg p-4">
        <h3 className="text-xs font-medium text-[#625d58] uppercase tracking-wider mb-3">Overview</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#625d58]">Scheduled</span>
            <span className="text-sm font-medium text-ink">{scheduled.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#625d58]">Drafts</span>
            <span className="text-sm font-medium text-ink">{drafts.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#625d58]">Published</span>
            <span className="text-sm font-medium text-ink">{published.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-panel border border-border rounded-lg p-4">
        <h3 className="text-xs font-medium text-[#625d58] uppercase tracking-wider mb-3">Upcoming</h3>
        <div className="space-y-3">
          {upcoming.length > 0 ? (
            upcoming.map((post) => (
              <div key={post.id} className="flex items-start gap-2">
                <PlatformBadge platformId={post.platformId} size="xs" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink truncate">{post.content}</p>
                    {post.scheduledAt && (
                      <p className="text-[10px] text-[#625d58]">
                        {new Intl.DateTimeFormat("en-US", {
                          timeZone,
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(post.scheduledAt))}
                      </p>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-xs text-[#625d58]">No upcoming posts</p>
          )}
        </div>
      </div>

      {posts.some((p) => p.status === "failed") && (
        <div className="bg-[#9e4d3b]/10 border border-[#9e4d3b]/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="size-4 text-[#9e4d3b]" />
            <span className="text-xs font-medium text-[#9e4d3b]">Failed Posts</span>
          </div>
          <p className="text-xs text-[#625d58]">
            {posts.filter((p) => p.status === "failed").length} post(s) failed to publish. Click to retry.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense>
      <SchedulePageInner />
    </Suspense>
  );
}

function SchedulePageInner() {
  const timeZone = getWorkspaceTimezoneClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<ViewMode>("calendar");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 12));
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostSeed, setNewPostSeed] = useState<Partial<Post> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
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
        setLoadError(e instanceof Error ? e.message : "Failed to load scheduled posts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const editId = searchParams.get("edit");
  const wantsNew = searchParams.get("new") === "1";

  useEffect(() => {
    if (!wantsNew) return;
    try {
      const raw = localStorage.getItem(NEW_POST_SEED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Post>;
        setNewPostSeed(parsed);
      } else {
        setNewPostSeed(null);
      }
    } catch {
      setNewPostSeed(null);
    } finally {
      try {
        localStorage.removeItem(NEW_POST_SEED_KEY);
      } catch {
        // ignore
      }
      setSelectedPost(null);
      setShowModal(true);
      router.replace("/schedule");
    }
  }, [router, wantsNew]);

  useEffect(() => {
    if (!editId) return;
    const post = posts.find((p) => p.id === editId);
    if (!post) return;
    setNewPostSeed(null);
    setSelectedPost(post);
    setShowModal(true);
    router.replace("/schedule");
  }, [editId, posts, router]);

  const handlePostClick = (post: Post) => {
    setNewPostSeed(null);
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleDayClick = (date: Date) => {
    const d = new Date(date);
    d.setHours(14, 0, 0, 0); // default time in the user's local timezone
    setNewPostSeed({ scheduledAt: d.toISOString(), status: "draft", format: "text" });
    setSelectedPost(null);
    setShowModal(true);
  };

  const handleMonthChange = (dir: 1 | -1) => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  };

  const handleSavePost = async (postData: Partial<Post>) => {
    if (selectedPost) {
      // Optimistic update.
      const prevPost = posts.find((p) => p.id === selectedPost.id) || null;
      setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? ({ ...p, ...postData } as Post) : p)));

      const res = await fetch("/api/scheduled-posts", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...postData, id: selectedPost.id }),
      });

      if (res.ok) {
        const body = (await res.json()) as { post: Post };
        setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? body.post : p)));
        return { ok: true } as const;
      }

      if (prevPost) {
        setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? prevPost : p)));
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: body?.error || `Could not save (HTTP ${res.status})` } as const;
    }

    const res = await fetch("/api/scheduled-posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: body?.error || `Could not create (HTTP ${res.status})` } as const;
    }
    const body = (await res.json()) as { post: Post };
    setPosts((prev) => [...prev, body.post]);
    return { ok: true } as const;
  };

  const handleDeletePost = async (post: Post) => {
    setLoadError(null);
    setPosts((p) => p.filter((x) => x.id !== post.id));

    const res = await fetch(`/api/scheduled-posts?id=${encodeURIComponent(post.id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      // Roll back just this post (don't clobber other concurrent mutations).
      setPosts((prev) => (prev.some((x) => x.id === post.id) ? prev : [post, ...prev]));
      setLoadError(`Could not delete post (HTTP ${res.status})`);
    }
  };

  const filters: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "scheduled", label: "Scheduled" },
    { value: "draft", label: "Drafts" },
    { value: "published", label: "Published" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <div>
      <PageHeader
        title="Schedule"
        description="Plan and schedule your content across all platforms."
        action={
          <button
            onClick={() => {
              setSelectedPost(null);
              setNewPostSeed(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-warm text-paper rounded-md text-xs font-medium hover:bg-warm/90 transition-colors"
          >
            <Plus className="size-3" />
            New Post
          </button>
        }
      />

      {loading && (
        <div className="mb-4 text-xs text-[#625d58]">Loading scheduled posts…</div>
      )}
      {loadError && (
        <div className="mb-4 text-xs text-[#9e4d3b]">Could not load scheduled posts: {loadError}</div>
      )}

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 bg-panel border border-border rounded-lg p-0.5">
              <button
                onClick={() => setView("calendar")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  view === "calendar" ? "bg-warm text-paper" : "text-[#625d58] hover:text-ink"
                )}
              >
                <Calendar className="size-3.5" />
                Calendar
              </button>
              <button
                onClick={() => setView("queue")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  view === "queue" ? "bg-warm text-paper" : "text-[#625d58] hover:text-ink"
                )}
              >
                <List className="size-3.5" />
                Queue
              </button>
            </div>

            {view === "queue" && (
              <div className="flex items-center gap-1">
                {filters.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                      filter === value
                        ? "bg-shell text-ink"
                        : "text-[#625d58] hover:text-ink"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {view === "calendar" ? (
            <CalendarView
              posts={posts}
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              onPostClick={handlePostClick}
              onDayClick={handleDayClick}
              timeZone={timeZone}
            />
          ) : (
            <QueueView
              posts={posts}
              filter={filter}
              onPostClick={handlePostClick}
              onRequestDelete={(post) => {
                setDeleteTarget(post);
                setDeleteOpen(true);
              }}
              timeZone={timeZone}
            />
          )}
        </div>

        <Sidebar
          posts={posts}
          onNewPost={() => {
            setSelectedPost(null);
            setNewPostSeed(null);
            setShowModal(true);
          }}
          timeZone={timeZone}
        />
      </div>

      <PostModal
        post={selectedPost}
        seed={selectedPost ? null : newPostSeed}
        open={showModal}
        onOpenChange={setShowModal}
        onSave={handleSavePost}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        post={deleteTarget}
        onConfirm={handleDeletePost}
      />
    </div>
  );
}
