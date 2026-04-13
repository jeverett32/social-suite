import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { mockKpis, mockScheduledPosts } from "@/lib/mock-data";
import { ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { label: "Draft a post", href: "/draft", icon: Zap, color: "text-warm" },
  { label: "View calendar", href: "/schedule", icon: Clock, color: "text-[#3f5870]" },
  { label: "Check inbox", href: "/inbox", icon: CheckCircle2, color: "text-[#536443]" },
];

export default function OverviewPage() {
  return (
    <div>
      <PageHeader
        title="Good morning, John."
        description="Here's what's happening across your accounts today."
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockKpis.map((metric) => (
          <KpiCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-panel border border-border rounded-lg p-5">
          <h2 className="font-serif text-base font-medium text-ink mb-4">Quick actions</h2>
          <div className="space-y-2">
            {quickActions.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-shell transition-colors group"
              >
                <Icon className={`size-4 ${color}`} />
                <span className="text-sm text-ink flex-1">{label}</span>
                <ArrowRight className="size-3.5 text-[#625d58] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming posts */}
        <div className="lg:col-span-2 bg-panel border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-base font-medium text-ink">Upcoming posts</h2>
            <Link href="/schedule" className="text-xs text-warm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mockScheduledPosts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
              >
                <PlatformBadge platformId={post.platformId} size="sm" />
                <p className="flex-1 text-sm text-ink truncate">{post.content}</p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      post.status === "scheduled"
                        ? "bg-[#536443]/10 text-[#536443]"
                        : "bg-[#a28443]/10 text-[#a28443]"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
