import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { mockScheduledPosts } from "@/lib/mock-data";
import type { PlatformId } from "@/types/platform";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dates = [14, 15, 16, 17, 18, 19, 20];

const recommendations = [
  {
    platform: "instagram" as PlatformId,
    topic: "Behind-the-scenes content",
    tone: "Casual",
    format: "Reel",
    lift: "+18%",
    day: "Mon",
  },
  {
    platform: "linkedin" as PlatformId,
    topic: "Industry insight or hot take",
    tone: "Authoritative",
    format: "Text post",
    lift: "+24%",
    day: "Wed",
  },
  {
    platform: "tiktok" as PlatformId,
    topic: "Tutorial or how-to",
    tone: "Energetic",
    format: "Video",
    lift: "+31%",
    day: "Thu",
  },
];

export default function PlanPage() {
  return (
    <div>
      <PageHeader
        title="Plan"
        description="ML-backed content calendar. Each recommendation is ranked by predicted engagement lift."
        action={
          <button className="px-3 py-1.5 bg-warm text-paper rounded-md text-xs font-medium hover:bg-warm/90 transition-colors">
            Regenerate week
          </button>
        }
      />

      {/* Week Calendar */}
      <div className="bg-panel border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base font-medium text-ink">Week of Apr 14 – 20</h2>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 text-xs border border-border rounded hover:bg-shell transition-colors">‹</button>
            <button className="px-2.5 py-1 text-xs border border-border rounded hover:bg-shell transition-colors">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const dayPosts = mockScheduledPosts.filter((_, idx) => idx % 7 === i);
            return (
              <div key={day} className="min-h-[160px]">
                <div className="text-center mb-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#625d58] font-medium">{day}</p>
                  <p className="text-sm font-medium text-ink">{dates[i]}</p>
                </div>
                <div className="space-y-1.5">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-2 rounded bg-warm/8 border border-warm/20 cursor-pointer hover:border-warm/40 transition-colors"
                    >
                      <PlatformBadge platformId={post.platformId} size="sm" />
                      <p className="text-[11px] text-ink mt-1 line-clamp-2">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="font-serif text-base font-medium text-ink mb-4">
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
              <button className="w-full text-xs font-medium text-warm border border-warm/30 rounded py-1.5 hover:bg-warm/5 transition-colors">
                Send to Draft →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
