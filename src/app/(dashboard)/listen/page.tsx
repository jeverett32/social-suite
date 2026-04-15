"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { mockKeywords } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Bell,
  BellOff,
  BarChart3,
  MessageCircle,
  Heart,
  Share2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Filter,
} from "lucide-react";

type Sentiment = "positive" | "negative" | "neutral";

interface KeywordData {
  keyword: string;
  mentions: number;
  sentiment: Sentiment;
  change: number;
}

interface Mention {
  id: string;
  platform: string;
  author: string;
  content: string;
  sentiment: Sentiment;
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

const mockMentions: Mention[] = [
  {
    id: "m1",
    platform: "twitter",
    author: "@social_guru",
    content: "Just discovered Krowdr and it's a game changer for our team's workflow! The analytics are incredible 🎯",
    sentiment: "positive",
    timestamp: "2h ago",
    engagement: { likes: 24, shares: 8, comments: 5 },
  },
  {
    id: "m2",
    platform: "reddit",
    author: "u/marketing_maven",
    content: "Anyone tried Krowdr? Thinking about switching from Hootsuite but concerned about the learning curve.",
    sentiment: "neutral",
    timestamp: "4h ago",
    engagement: { likes: 12, shares: 2, comments: 18 },
  },
  {
    id: "m3",
    platform: "twitter",
    author: "@competitor_fan",
    content: "Their competitor just launched a new feature that's basically what Krowdr does but free. Tough times ahead.",
    sentiment: "negative",
    timestamp: "6h ago",
    engagement: { likes: 45, shares: 12, comments: 32 },
  },
  {
    id: "m4",
    platform: "instagram",
    author: "@startup_creator",
    content: "Shoutout to the Krowdr team for the amazing customer support. They helped me debug an issue in under 10 mins!",
    sentiment: "positive",
    timestamp: "8h ago",
    engagement: { likes: 89, shares: 15, comments: 7 },
  },
  {
    id: "m5",
    platform: "linkedin",
    author: "Sarah Chen",
    content: "Using Krowdr for our Q2 social strategy. The predictions are surprisingly accurate!",
    sentiment: "positive",
    timestamp: "12h ago",
    engagement: { likes: 156, shares: 34, comments: 22 },
  },
  {
    id: "m6",
    platform: "twitter",
    author: "anon_user",
    content: "Krowdr's pricing for agencies is ridiculous. $100/month for 10 accounts? Nah.",
    sentiment: "negative",
    timestamp: "1d ago",
    engagement: { likes: 78, shares: 14, comments: 56 },
  },
];

const sentimentColors: Record<Sentiment, string> = {
  positive: "text-[#536443] bg-[#536443]/10",
  negative: "text-[#9e4d3b] bg-[#9e4d3b]/10",
  neutral: "text-[#625d58] bg-shell",
};

const sentimentIcons: Record<Sentiment, typeof Heart> = {
  positive: Heart,
  negative: AlertTriangle,
  neutral: MessageCircle,
};

function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const Icon = sentimentIcons[sentiment];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", sentimentColors[sentiment])}>
      <Icon className="size-3" />
      {sentiment}
    </span>
  );
}

function TrendingBadge({ change }: { change: number }) {
  const isUp = change > 0;
  const isDown = change < 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-medium", isUp ? "text-[#536443]" : isDown ? "text-[#9e4d3b]" : "text-[#625d58]")}>
      {isUp ? <TrendingUp className="size-3" /> : isDown ? <TrendingDown className="size-3" /> : <Minus className="size-3" />}
      {Math.abs(change)}%
    </span>
  );
}

function KeywordsSection({
  keywords,
  onToggleAlert,
}: {
  keywords: KeywordData[];
  onToggleAlert: (keyword: string) => void;
}) {
  const [tracked, setTracked] = useState<Set<string>>(new Set(["Krowdr", "social media burnout"]));

  const handleToggle = (keyword: string) => {
    setTracked((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) {
        next.delete(keyword);
      } else {
        next.add(keyword);
      }
      return next;
    });
    onToggleAlert(keyword);
  };

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-ink">Tracked Keywords</h2>
        <button className="text-xs text-warm hover:underline">Add keyword</button>
      </div>
      <div className="space-y-3">
        {keywords.map((kw) => (
          <div key={kw.keyword} className="flex items-center justify-between p-3 bg-shell rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-ink">{kw.keyword}</span>
                <SentimentBadge sentiment={kw.sentiment} />
                <TrendingBadge change={kw.change} />
              </div>
              <p className="text-xs text-[#625d58]">{kw.mentions.toLocaleString()} mentions</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(kw.keyword)}
              aria-label={tracked.has(kw.keyword) ? `Disable alerts for ${kw.keyword}` : `Enable alerts for ${kw.keyword}`}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tracked.has(kw.keyword) ? "bg-warm/10 text-warm" : "bg-shell text-[#625d58] hover:bg-border"
              )}
            >
              {tracked.has(kw.keyword) ? <Bell className="size-4" /> : <BellOff className="size-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentOverview({ keywords }: { keywords: KeywordData[] }) {
  const positive = keywords.filter((k) => k.sentiment === "positive").reduce((sum, k) => sum + k.mentions, 0);
  const negative = keywords.filter((k) => k.sentiment === "negative").reduce((sum, k) => sum + k.mentions, 0);
  const neutral = keywords.filter((k) => k.sentiment === "neutral").reduce((sum, k) => sum + k.mentions, 0);
  const total = positive + negative + neutral;

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Sentiment Overview</h2>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="h-3 bg-shell rounded-full overflow-hidden flex">
            <div className="bg-[#536443]" style={{ width: `${(positive / total) * 100}%` }} />
            <div className="bg-[#625d58]" style={{ width: `${(neutral / total) * 100}%` }} />
            <div className="bg-[#9e4d3b]" style={{ width: `${(negative / total) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-medium text-[#536443]">{Math.round((positive / total) * 100)}%</p>
          <p className="text-xs text-[#625d58]">Positive</p>
        </div>
        <div>
          <p className="text-xl font-medium text-[#625d58]">{Math.round((neutral / total) * 100)}%</p>
          <p className="text-xs text-[#625d58]">Neutral</p>
        </div>
        <div>
          <p className="text-xl font-medium text-[#9e4d3b]">{Math.round((negative / total) * 100)}%</p>
          <p className="text-xs text-[#625d58]">Negative</p>
        </div>
      </div>
    </div>
  );
}

function MentionsList({ mentions }: { mentions: Mention[] }) {
  const [filter, setFilter] = useState<Sentiment | "all">("all");

  const filteredMentions = filter === "all" ? mentions : mentions.filter((m) => m.sentiment === filter);

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-ink">Recent Mentions</h2>
        <div className="flex items-center gap-1">
          {(["all", "positive", "negative", "neutral"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize",
                filter === f ? "bg-shell text-ink" : "text-[#625d58] hover:text-ink"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filteredMentions.map((mention) => (
          <div key={mention.id} className="p-4 bg-shell rounded-lg hover:bg-shell/70 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ink">{mention.author}</span>
                <span className="text-[10px] text-[#625d58]">{mention.platform}</span>
              </div>
              <span className="text-[10px] text-[#625d58]">{mention.timestamp}</span>
            </div>
            <p className="text-sm text-ink mb-3">{mention.content}</p>
            <div className="flex items-center justify-between">
              <SentimentBadge sentiment={mention.sentiment} />
              <div className="flex items-center gap-3 text-[10px] text-[#625d58]">
                <span className="flex items-center gap-0.5">
                  <Heart className="size-3" /> {mention.engagement.likes}
                </span>
                <span className="flex items-center gap-0.5">
                  <Share2 className="size-3" /> {mention.engagement.shares}
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageCircle className="size-3" /> {mention.engagement.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsSection() {
  const alerts = [
    { id: 1, type: "spike", keyword: "Krowdr", message: "Mentions increased by 45% in the last hour", time: "10m ago" },
    { id: 2, type: "negative", keyword: "social media burnout", message: "Negative sentiment spike detected", time: "2h ago" },
  ];

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-ink">Active Alerts</h2>
        <button className="text-xs text-[#625d58] hover:text-ink flex items-center gap-1">
          <Settings className="size-3" />
          Configure
        </button>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 bg-shell rounded-lg border border-border"
          >
            <div className={cn("mt-0.5", alert.type === "spike" ? "text-[#a28443]" : "text-[#9e4d3b]")}>
              {alert.type === "spike" ? <TrendingUp className="size-4" /> : <AlertTriangle className="size-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{alert.keyword}</p>
              <p className="text-xs text-[#625d58]">{alert.message}</p>
              <p className="text-[10px] text-[#625d58] mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VolumeChart() {
  const data = [45, 62, 38, 75, 52, 88, 65, 72, 58, 84, 70, 95];
  const max = Math.max(...data);

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-ink">Mention Volume</h2>
        <select className="text-xs border border-border rounded px-2 py-1 bg-paper text-ink">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <div className="flex items-end gap-1 h-32">
        {data.map((val, i) => (
          <div
            key={i}
            className="flex-1 bg-warm/30 hover:bg-warm/60 rounded-sm transition-colors cursor-pointer"
            style={{ height: `${(val / max) * 100}%` }}
            title={`${val} mentions`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-[#625d58]">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

export default function ListenPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <PageHeader
        title="Listen"
        description="Monitor brand mentions, track trends, and analyze sentiment across platforms."
        action={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-medium text-[#625d58] hover:bg-shell transition-colors">
              <RefreshCw className="size-3" />
              Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-medium text-[#625d58] hover:bg-shell transition-colors">
              <Filter className="size-3" />
              Filter
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#625d58]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentions, keywords..."
            className="w-full pl-9 pr-4 py-2 bg-panel border border-border rounded-lg text-sm text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VolumeChart />
          <MentionsList mentions={mockMentions} />
        </div>

        <div className="space-y-6">
          <SentimentOverview keywords={mockKeywords} />
          <AlertsSection />
          <KeywordsSection keywords={mockKeywords} onToggleAlert={() => {}} />
        </div>
      </div>
    </div>
  );
}
