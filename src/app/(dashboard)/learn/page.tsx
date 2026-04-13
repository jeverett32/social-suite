import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { mockKpis, mockTopPosts, mockPlatformBreakdown } from "@/lib/mock-data";

export default function LearnPage() {
  return (
    <div>
      <PageHeader
        title="Learn"
        description="Understand what's working across your platforms and why."
        action={
          <select className="text-xs border border-border rounded-md px-3 py-1.5 bg-panel text-ink focus:outline-none">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockKpis.map((m) => (
          <KpiCard key={m.label} metric={m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Engagement chart placeholder */}
        <div className="lg:col-span-2 bg-panel border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold text-ink mb-1">Engagement over time</h2>
          <p className="text-xs text-[#625d58] mb-4">Daily engagement rate across all platforms</p>
          <div className="h-48 rounded-md bg-gradient-to-br from-warm/5 via-shell to-[#3f5870]/5 border border-border flex items-end gap-1 px-4 pb-4">
            {[35, 52, 41, 67, 48, 72, 59, 84, 63, 78, 55, 91, 70, 88].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-warm/30 hover:bg-warm/60 transition-colors cursor-pointer"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="bg-panel border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">By platform</h2>
          <div className="space-y-3">
            {mockPlatformBreakdown.map((p) => (
              <div key={p.platformId}>
                <div className="flex items-center justify-between mb-1">
                  <PlatformBadge platformId={p.platformId} size="sm" />
                  <span className="text-xs font-medium text-ink">{p.engagement}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warm/60 rounded-full"
                    style={{ width: `${(p.engagement / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top posts table */}
      <div className="bg-panel border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-ink mb-4">Top performing posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] uppercase tracking-wider text-[#625d58] font-medium pb-3 pr-4">Platform</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-[#625d58] font-medium pb-3 pr-4">Content</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-[#625d58] font-medium pb-3 pr-4">Impressions</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-[#625d58] font-medium pb-3 pr-4">Engagement</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-[#625d58] font-medium pb-3">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {mockTopPosts.map((post, i) => (
                <tr key={post.postId} className={i < mockTopPosts.length - 1 ? "border-b border-border" : ""}>
                  <td className="py-3 pr-4">
                    <PlatformBadge platformId={post.platformId} size="sm" />
                  </td>
                  <td className="py-3 pr-4 max-w-xs">
                    <p className="truncate text-ink">{post.content}</p>
                  </td>
                  <td className="py-3 pr-4 text-right text-[#625d58]">
                    {(post.impressions / 1000).toFixed(0)}K
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="text-[#536443] font-medium">{post.engagement}%</span>
                  </td>
                  <td className="py-3 text-right text-[#625d58]">
                    {post.clicks.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
