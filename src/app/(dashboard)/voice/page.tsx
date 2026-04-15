"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import type { PlatformId } from "@/types/platform";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
} from "lucide-react";

type Tone = "professional" | "conversational" | "authoritative" | "playful" | "inspirational" | "educational";

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  tones: Tone[];
  vocabulary: string[];
  bannedPhrases: string[];
  examplePosts: {
    id: string;
    platformId: PlatformId;
    content: string;
    rating: number;
  }[];
}

const mockVoiceProfile: VoiceProfile = {
  id: "vp1",
  name: "Default Brand Voice",
  description: "Our brand voice reflects innovation, approachability, and thought leadership in the social media marketing space.",
  tones: ["professional", "conversational", "authoritative"],
  vocabulary: ["insights", "strategy", "growth", "data-driven", "innovate", "empower", "transform"],
  bannedPhrases: ["synergy", "leverage", "best-in-class", "game-changer", "disrupt"],
  examplePosts: [
    {
      id: "ep1",
      platformId: "linkedin",
      content: "Why we stopped scheduling posts randomly (and what happened next). Our engagement increased by 340% when we started data-driven posting.",
      rating: 95,
    },
    {
      id: "ep2",
      platformId: "instagram",
      content: "Behind the scenes of our latest campaign shoot 🎬",
      rating: 88,
    },
    {
      id: "ep3",
      platformId: "tiktok",
      content: "3 social media mistakes you're probably making right now",
      rating: 92,
    },
  ],
};

const allTones: { value: Tone; label: string; description: string }[] = [
  { value: "professional", label: "Professional", description: "Polished, formal, business-focused" },
  { value: "conversational", label: "Conversational", description: "Friendly, casual, approachable" },
  { value: "authoritative", label: "Authoritative", description: "Confident, knowledgeable, expert" },
  { value: "playful", label: "Playful", description: "Fun, energetic, witty" },
  { value: "inspirational", label: "Inspirational", description: "Motivating, uplifting, aspirational" },
  { value: "educational", label: "Educational", description: "Informative, instructive, helpful" },
];

function ToneSelector({
  selectedTones,
  onChange,
}: {
  selectedTones: Tone[];
  onChange: (tones: Tone[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allTones.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              if (selectedTones.includes(value)) {
                onChange(selectedTones.filter((t) => t !== value));
              } else {
                onChange([...selectedTones, value]);
              }
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              selectedTones.includes(value)
                ? "bg-warm text-paper border-warm"
                : "border-border text-[#625d58] hover:border-warm/40"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#625d58]">Select up to 3 tones that best describe your brand voice.</p>
    </div>
  );
}

function VocabularyManager({
  vocabulary,
  onChange,
}: {
  vocabulary: string[];
  onChange: (vocab: string[]) => void;
}) {
  const [newWord, setNewWord] = useState("");

  const addWord = () => {
    if (newWord.trim() && !vocabulary.includes(newWord.trim())) {
      onChange([...vocabulary, newWord.trim()]);
      setNewWord("");
    }
  };

  const removeWord = (word: string) => {
    onChange(vocabulary.filter((w) => w !== word));
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addWord()}
          placeholder="Add a word or phrase..."
          className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm"
        />
        <button
          type="button"
          aria-label="Add word"
          onClick={addWord}
          className="px-3 py-2 bg-warm text-paper rounded-md text-sm font-medium hover:bg-warm/90 transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {vocabulary.map((word) => (
          <span
            key={word}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-shell border border-border rounded-full text-xs text-ink"
          >
            {word}
            <button
              type="button"
              aria-label={`Remove ${word}`}
              onClick={() => removeWord(word)}
              className="text-[#625d58] hover:text-[#9e4d3b]"
            >
              <Trash2 className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <p className="text-xs text-[#625d58] mt-2">These words will be prioritized in your generated content.</p>
    </div>
  );
}

function BannedPhrasesManager({
  phrases,
  onChange,
}: {
  phrases: string[];
  onChange: (phrases: string[]) => void;
}) {
  const [newPhrase, setNewPhrase] = useState("");

  const addPhrase = () => {
    if (newPhrase.trim() && !phrases.includes(newPhrase.trim())) {
      onChange([...phrases, newPhrase.trim()]);
      setNewPhrase("");
    }
  };

  const removePhrase = (phrase: string) => {
    onChange(phrases.filter((p) => p !== phrase));
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPhrase()}
          placeholder="Add a phrase to avoid..."
          className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm"
        />
        <button
          type="button"
          aria-label="Add banned phrase"
          onClick={addPhrase}
          className="px-3 py-2 bg-warm text-paper rounded-md text-sm font-medium hover:bg-warm/90 transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {phrases.map((phrase) => (
          <span
            key={phrase}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9e4d3b]/10 border border-[#9e4d3b]/30 rounded-full text-xs text-[#9e4d3b]"
          >
            {phrase}
            <button
              type="button"
              aria-label={`Remove ${phrase}`}
              onClick={() => removePhrase(phrase)}
              className="hover:text-ink"
            >
              <Trash2 className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <p className="text-xs text-[#625d58] mt-2">These phrases will be flagged as &quot;AI slop&quot; and avoided.</p>
    </div>
  );
}

function ExamplePostsSection({
  posts,
  onRemove,
}: {
  posts: VoiceProfile["examplePosts"];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#625d58]">Top-performing posts that define your voice</p>
        <button className="text-xs text-warm hover:underline flex items-center gap-1">
          <Plus className="size-3" />
          Add from Learn
        </button>
      </div>
      <div className="space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="p-3 bg-shell rounded-lg border border-border">
            <div className="flex items-start justify-between gap-2 mb-2">
              <PlatformBadge platformId={post.platformId} size="sm" />
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    post.rating >= 90
                      ? "bg-[#536443]/10 text-[#536443]"
                      : post.rating >= 70
                        ? "bg-[#a28443]/10 text-[#a28443]"
                        : "bg-[#625d58]/10 text-[#625d58]"
                  )}
                >
                  {post.rating}% match
                </span>
                <button
                  type="button"
                  aria-label="Remove example post"
                  onClick={() => onRemove(post.id)}
                  className="text-[#625d58] hover:text-[#9e4d3b]"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-ink line-clamp-2">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoiceExtractionCard() {
  const [extracting, setExtracting] = useState(false);

  const handleExtract = () => {
    setExtracting(true);
    setTimeout(() => setExtracting(false), 2000);
  };

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-lg bg-warm/10 flex items-center justify-center">
          <Sparkles className="size-5 text-warm" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">AI Voice Extraction</h3>
          <p className="text-xs text-[#625d58]">Learn from your top-performing posts</p>
        </div>
      </div>
      <p className="text-xs text-[#625d58] mb-4">
        Analyze your best-performing posts from Learn to automatically extract your brand voice characteristics.
      </p>
      <button
        onClick={handleExtract}
        disabled={extracting}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-warm/10 text-warm rounded-md text-sm font-medium hover:bg-warm/20 transition-colors disabled:opacity-50"
      >
        {extracting ? (
          <>
            <RefreshCw className="size-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Extract from top posts
          </>
        )}
      </button>
    </div>
  );
}

function PreviewPanel({ profile }: { profile: VoiceProfile }) {
  const [previewText, setPreviewText] = useState("");

  const samplePrompt = "Write a post about our new feature launch";

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h3 className="text-sm font-medium text-ink mb-4">Voice Preview</h3>
      <div className="space-y-3">
        <div className="p-3 bg-shell rounded-lg">
          <p className="text-xs text-[#625d58] mb-2">Sample prompt:</p>
          <p className="text-xs text-ink">{samplePrompt}</p>
        </div>
        <div className="p-3 bg-warm/5 border border-warm/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-3 text-warm" />
            <span className="text-[10px] text-warm font-medium">AI-generated (on-brand)</span>
          </div>
          <p className="text-xs text-ink">
            Excited to share our latest innovation! 🎯 We&apos;ve been working on something special to help you achieve
            better results with less effort. Here&apos;s what the data shows about the impact of strategic posting...
          </p>
        </div>
        <div className="p-3 bg-[#9e4d3b]/5 border border-[#9e4d3b]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="size-3 text-[#9e4d3b]" />
            <span className="text-[10px] text-[#9e4d3b] font-medium">AI-generated (off-brand)</span>
          </div>
          <p className="text-xs text-ink">
            Leveraging our best-in-class synergy to disrupt the market! This game-changer will completely transform
            your workflow with innovative solutions. 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VoicePage() {
  const [profile, setProfile] = useState<VoiceProfile>(mockVoiceProfile);
  const [activeTab, setActiveTab] = useState<"tones" | "vocabulary" | "banned" | "examples">("tones");

  const updateProfile = (updates: Partial<VoiceProfile>) => {
    setProfile({ ...profile, ...updates });
  };

  return (
    <div>
      <PageHeader
        title="Voice"
        description="Define and manage your brand voice to ensure consistent, on-brand content."
        action={
          <button className="flex items-center gap-2 px-3 py-1.5 bg-warm text-paper rounded-md text-xs font-medium hover:bg-warm/90 transition-colors">
            <Sparkles className="size-3" />
            Create profile
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-panel border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-ink">{profile.name}</h2>
                <p className="text-xs text-[#625d58] mt-1">{profile.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Edit voice profile"
                  className="p-2 hover:bg-shell rounded transition-colors text-[#625d58]"
                >
                  <Edit className="size-4" />
                </button>
              </div>
            </div>

            <div className="border-b border-border mb-4">
              <div className="flex gap-1">
                {(["tones", "vocabulary", "banned", "examples"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px",
                      activeTab === tab
                        ? "border-warm text-warm"
                        : "border-transparent text-[#625d58] hover:text-ink"
                    )}
                  >
                    {tab === "tones" ? "Tones" : tab === "vocabulary" ? "Vocabulary" : tab === "banned" ? "Banned Phrases" : "Examples"}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4">
              {activeTab === "tones" && (
                <ToneSelector
                  selectedTones={profile.tones}
                  onChange={(tones) => updateProfile({ tones })}
                />
              )}
              {activeTab === "vocabulary" && (
                <VocabularyManager
                  vocabulary={profile.vocabulary}
                  onChange={(vocabulary) => updateProfile({ vocabulary })}
                />
              )}
              {activeTab === "banned" && (
                <BannedPhrasesManager
                  phrases={profile.bannedPhrases}
                  onChange={(bannedPhrases) => updateProfile({ bannedPhrases })}
                />
              )}
              {activeTab === "examples" && (
                <ExamplePostsSection
                  posts={profile.examplePosts}
                  onRemove={(id) =>
                    updateProfile({
                      examplePosts: profile.examplePosts.filter((p) => p.id !== id),
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <VoiceExtractionCard />
          <PreviewPanel profile={profile} />
        </div>
      </div>
    </div>
  );
}
