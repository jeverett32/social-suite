"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { TrendingUp, Users, MousePointerClick, Eye } from "lucide-react";
import type { PlatformId } from "@/types/platform";
import { PREDICT_SEED_KEY } from "@/lib/seed-keys";

const platformOptions: { id: PlatformId; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
];
const postTypes = ["Image", "Video / Reel", "Carousel", "Text post", "Story"];
const timeSlots = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "12:00 PM",
  "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "9:00 PM",
];

const mockResults = [
  { label: "Predicted reach", value: "48,200", icon: Users, color: "text-[#3f5870]" },
  { label: "Engagement rate", value: "5.4%", icon: TrendingUp, color: "text-[#536443]" },
  { label: "Link clicks", value: "1,140", icon: MousePointerClick, color: "text-warm" },
  { label: "Impressions", value: "92,000", icon: Eye, color: "text-[#a28443]" },
];

export default function PredictPage() {
  return (
    <Suspense>
      <PredictPageInner />
    </Suspense>
  );
}

function PredictPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const seed = searchParams.get("seed");
    if (seed !== "1") return;

    try {
      const raw = localStorage.getItem(PREDICT_SEED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { platformId?: PlatformId; caption?: string };
        if (parsed.platformId && platformOptions.some((x) => x.id === parsed.platformId)) {
          setPlatform(parsed.platformId);
        }
        if (parsed.caption && parsed.caption.trim()) {
          setCaption(parsed.caption);
        }
      }
    } catch {
      // ignore
    } finally {
      try {
        localStorage.removeItem(PREDICT_SEED_KEY);
      } catch {
        // ignore
      }
      router.replace("/predict");
    }
  }, [router, searchParams]);

  return (
    <div>
      <PageHeader
        title="Predict"
        description="Simulate how a post will perform before publishing. Powered by your account's historical data."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="bg-panel border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-ink mb-5">Post details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#625d58] mb-1.5 uppercase tracking-wider">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformId)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm"
              >
                {platformOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] mb-1.5 uppercase tracking-wider">Post type</label>
              <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm">
                {postTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] mb-1.5 uppercase tracking-wider">Scheduled time</label>
              <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm">
                {timeSlots.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] mb-1.5 uppercase tracking-wider">Caption preview</label>
              <textarea
                rows={4}
                placeholder="Paste or write your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] mb-1.5 uppercase tracking-wider">Hashtag count</label>
              <input
                type="number"
                defaultValue={5}
                min={0}
                max={30}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm"
              />
            </div>
            <button
              onClick={() => setSubmitted(true)}
              className="w-full bg-warm text-paper rounded-md py-2.5 text-sm font-medium hover:bg-warm/90 transition-colors"
            >
              Run prediction
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {submitted ? (
            <div className="space-y-4">
              <div className="bg-panel border border-border rounded-lg p-6">
                <h2 className="text-sm font-semibold text-ink mb-5">
                  Predicted performance
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {mockResults.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-shell rounded-lg p-4">
                      <div className={`mb-2 ${color}`}>
                        <Icon className="size-4" />
                      </div>
                      <p className="text-2xl font-medium text-ink">{value}</p>
                      <p className="text-xs text-[#625d58] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-panel border border-border rounded-lg p-5">
                <h3 className="text-sm font-medium text-ink mb-3">Actionable tips</h3>
                <ul className="space-y-2 text-sm text-[#625d58]">
                  <li className="flex gap-2"><span className="text-[#536443]">↑</span> Adding 2–3 more hashtags could increase reach by ~15%</li>
                  <li className="flex gap-2"><span className="text-[#536443]">↑</span> Posting at 7 PM instead of 5 PM historically gets +8% engagement</li>
                  <li className="flex gap-2"><span className="text-[#a28443]">→</span> Carousels on Instagram average 2.1× more saves than single images</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-panel border border-border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
              <TrendingUp className="size-8 text-[#625d58] mb-3 opacity-40" />
              <p className="text-sm font-medium text-ink mb-1">No prediction yet</p>
              <p className="text-xs text-[#625d58]">
                Fill in the post details and click &quot;Run prediction&quot; to see estimated performance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
