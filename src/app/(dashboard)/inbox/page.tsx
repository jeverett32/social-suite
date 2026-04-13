"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { mockInboxThreads } from "@/lib/mock-data";
import { Send } from "lucide-react";

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState(mockInboxThreads[0].id);
  const selected = mockInboxThreads.find((t) => t.id === selectedId)!;

  return (
    <div>
      <PageHeader
        title="Inbox"
        description="DMs, comments, and mentions from all platforms in one place."
      />

      <div className="flex gap-0 border border-border rounded-lg overflow-hidden bg-panel" style={{ height: "calc(100vh - 220px)" }}>
        {/* Thread list */}
        <div className="w-80 flex-shrink-0 border-r border-border overflow-y-auto">
          {mockInboxThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSelectedId(thread.id)}
              className={`w-full text-left px-4 py-4 border-b border-border hover:bg-shell transition-colors ${
                selectedId === thread.id ? "bg-warm/5 border-l-2 border-l-warm" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {thread.unread && (
                    <span className="size-2 rounded-full bg-warm flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium text-ink truncate">{thread.sender}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <PlatformBadge platformId={thread.platformId} size="sm" />
                </div>
              </div>
              <p className="text-xs text-[#625d58] truncate pl-4">{thread.preview}</p>
              <p className="text-[11px] text-[#625d58] mt-1 pl-4">{thread.time}</p>
            </button>
          ))}
        </div>

        {/* Thread detail */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <p className="font-medium text-sm text-ink">{selected.sender}</p>
            <PlatformBadge platformId={selected.platformId} size="sm" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {selected.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm px-4 py-2.5 rounded-xl text-sm ${
                    msg.from === "me"
                      ? "bg-warm text-paper"
                      : "bg-shell text-ink border border-border"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[11px] mt-1 ${msg.from === "me" ? "text-paper/70" : "text-[#625d58]"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Reply..."
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-paper text-ink placeholder:text-[#625d58] focus:outline-none focus:ring-1 focus:ring-warm"
              />
              <button className="flex items-center gap-1.5 px-4 py-2 bg-warm text-paper rounded-lg text-sm font-medium hover:bg-warm/90 transition-colors">
                <Send className="size-3.5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
