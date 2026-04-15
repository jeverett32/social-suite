"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { Copy, Check, Sparkles } from "lucide-react";
import type { PlatformId } from "@/types/platform";
import { NEW_POST_SEED_KEY, PREDICT_SEED_KEY } from "@/lib/seed-keys";

const platforms: { id: PlatformId; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X" },
  { id: "facebook", label: "Facebook" },
];

const tones = ["Conversational", "Authoritative", "Playful", "Inspirational", "Educational"];
const ctas = ["Learn more", "Shop now", "Follow for more", "Comment below", "Share this"];

const mockVariants = [
  {
    id: "a",
    label: "Variant A",
    slopScore: 92,
    content:
      "Most social teams are flying blind. They post, wait, and hope — with no idea why one piece of content outperforms another. We built Krowdr to change that. Learn what your data already knows. 📊",
  },
  {
    id: "b",
    label: "Variant B",
    slopScore: 78,
    content:
      "Your best performing post this month? It wasn't luck. There's a pattern in your data — and we surface it automatically. Try Krowdr free and see exactly what's working for your audience.",
  },
  {
    id: "c",
    label: "Variant C",
    slopScore: 85,
    content:
      "Tired of guessing what to post next? Krowdr analyzes your historical performance, cross-references trends, and tells you exactly what to create, when, and for which platform. No more aimless scrolling for inspo.",
  },
];

export default function DraftPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("instagram");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <PageHeader
        title="Draft"
        description="Generate on-brand caption variants with AI, then validate with Predict before publishing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-2 bg-panel border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold text-ink mb-5">Content brief</h2>

          {/* Platform selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-2">Platform</label>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedPlatform(id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedPlatform === id
                      ? "bg-warm text-paper border-warm"
                      : "border-border text-[#625d58] hover:border-warm/40 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">Topic</label>
              <input
                type="text"
                placeholder="e.g. new product launch, Q1 results..."
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">Tone</label>
              <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm">
                {tones.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">CTA</label>
              <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm">
                {ctas.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">Campaign name (optional)</label>
              <input
                type="text"
                placeholder="Spring launch 2026"
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm"
              />
            </div>
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-warm text-paper rounded-md py-2.5 text-sm font-medium hover:bg-warm/90 transition-colors"
          >
            <Sparkles className="size-3.5" />
            Generate variants
          </button>
        </div>

        {/* Variants */}
        <div className="lg:col-span-3 space-y-4">
          {generated ? (
            mockVariants.map((v) => (
              <div key={v.id} className="bg-panel border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#625d58] uppercase tracking-wider">{v.label}</span>
                    <PlatformBadge platformId={selectedPlatform} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        v.slopScore >= 85
                          ? "bg-[#536443]/10 text-[#536443]"
                          : "bg-[#a28443]/10 text-[#a28443]"
                      }`}
                    >
                      Authenticity {v.slopScore}/100
                    </span>
                    <button
                      type="button"
                      aria-label={`Copy ${v.label}`}
                      onClick={() => handleCopy(v.id, v.content)}
                      className="p-1.5 rounded hover:bg-shell transition-colors text-[#625d58] hover:text-ink"
                    >
                      {copied === v.id ? <Check className="size-3.5 text-[#536443]" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-ink leading-relaxed">{v.content}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.setItem(
                          PREDICT_SEED_KEY,
                          JSON.stringify({
                            platformId: selectedPlatform,
                            caption: v.content,
                          })
                        );
                      } catch {
                        // ignore
                      }
                      router.push("/predict?seed=1");
                    }}
                    className="text-xs px-3 py-1.5 border border-border rounded hover:bg-shell transition-colors text-[#625d58]"
                  >
                    Send to Predict →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.setItem(
                          NEW_POST_SEED_KEY,
                          JSON.stringify({
                            platformId: selectedPlatform,
                            content: v.content,
                            status: "draft",
                            format: "text",
                          })
                        );
                      } catch {
                        // ignore
                      }
                      router.push("/schedule?new=1");
                    }}
                    className="text-xs px-3 py-1.5 border border-border rounded hover:bg-shell transition-colors text-[#625d58]"
                  >
                    Add to Schedule
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-panel border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Sparkles className="size-8 text-[#625d58] mb-3 opacity-40" />
              <p className="text-sm font-medium text-ink mb-1">No variants yet</p>
              <p className="text-xs text-[#625d58]">
                Fill in the content brief and generate 3 on-brand caption variants.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
