"use client";

import { useEffect, useState } from "react";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { cn } from "@/lib/utils";
import {
  Key,
  CheckCircle,
  XCircle,
  RefreshCw,
  Unlink,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import type { PlatformId } from "@/types/platform";

interface ConnectedAccount {
  id: string;
  platformId: PlatformId;
  username: string;
  connectedAt: string;
  status: "connected" | "error" | "expired";
  lastSync?: string;
}

const availablePlatforms: { id: PlatformId; name: string; description: string }[] = [
  { id: "instagram", name: "Instagram", description: "Posts, stories, reels, and DMs" },
  { id: "facebook", name: "Facebook", description: "Pages, posts, and messages" },
  { id: "linkedin", name: "LinkedIn", description: "Company pages and posts" },
  { id: "tiktok", name: "TikTok", description: "Video posts and analytics" },
  { id: "youtube", name: "YouTube", description: "Channel analytics and uploads" },
];

const statusConfig = {
  connected: { icon: CheckCircle, color: "text-[#536443]", bg: "bg-[#536443]/10", label: "Connected" },
  error: { icon: XCircle, color: "text-[#9e4d3b]", bg: "bg-[#9e4d3b]/10", label: "Error" },
  expired: { icon: AlertCircle, color: "text-[#a28443]", bg: "bg-[#a28443]/10", label: "Expired" },
};

function ConnectedAccountsList({
  accounts,
  onDisconnect,
}: {
  accounts: ConnectedAccount[];
  onDisconnect: (id: string) => void | Promise<void>;
}) {
  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Connected accounts</h2>
      {accounts.length === 0 ? (
        <p className="text-sm text-[#625d58]">No accounts connected yet.</p>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => {
            const status = statusConfig[account.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-shell rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platformId={account.platformId} />
                  <div>
                    <p className="text-sm font-medium text-ink">{account.username}</p>
                    <p className="text-[10px] text-[#625d58]">
                      Connected {new Date(account.connectedAt + "T12:00:00Z").toLocaleDateString()}
                      {account.lastSync && ` · Last sync ${account.lastSync}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full", status.bg, status.color)}>
                    <StatusIcon className="size-3" />
                    {status.label}
                  </span>
                  {account.status === "connected" && (
                    <button
                      type="button"
                      aria-label={`Sync ${account.username}`}
                      className="p-2 hover:bg-panel rounded transition-colors text-[#625d58]"
                    >
                      <RefreshCw className="size-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Disconnect ${account.username}`}
                    className="p-2 hover:bg-panel rounded transition-colors text-[#625d58] hover:text-[#9e4d3b]"
                    onClick={() => void onDisconnect(account.id)}
                  >
                    <Unlink className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AvailablePlatforms({ connected }: { connected: PlatformId[] }) {
  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Connect a new account</h2>
      <div className="space-y-2">
        {availablePlatforms.map((platform) => {
          const isConnected = connected.includes(platform.id);
          return (
            <div
              key={platform.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-colors",
                isConnected ? "bg-shell/50 border-border opacity-60" : "bg-shell border-border hover:border-warm/40"
              )}
            >
              <div className="flex items-center gap-3">
                <PlatformBadge platformId={platform.id} />
                <div>
                  <p className="text-sm font-medium text-ink">{platform.name}</p>
                  <p className="text-[10px] text-[#625d58]">{platform.description}</p>
                </div>
              </div>
              <button
                disabled={isConnected}
                type="button"
                onClick={() => {
                  if (isConnected) return;
                  window.location.assign(`/api/oauth/${platform.id}/start?next=${encodeURIComponent("/settings/integrations")}`);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  isConnected
                    ? "bg-shell text-[#625d58] cursor-not-allowed"
                    : "bg-warm text-paper hover:bg-warm/90"
                )}
              >
                {isConnected ? "Connected" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApiKeysSection() {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-ink">API Keys</h2>
        <button className="text-xs text-warm hover:underline">Generate new key</button>
      </div>
      <p className="text-xs text-[#625d58] mb-4">
        Use API keys to integrate Krowdr with your own applications.
      </p>
      <div className="p-4 bg-shell rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Production Key</p>
            <p className="text-xs text-[#625d58] font-mono mt-1">
              {showKey ? "demo_live_key_abc123xyz789" : "demo_live_key_••••••••••"}
            </p>
            <p className="text-[10px] text-[#625d58] mt-1">Created Jan 15, 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? "Hide API key" : "Show API key"}
              className="p-2 hover:bg-panel rounded transition-colors text-[#625d58]"
            >
              {showKey ? <Key className="size-4" /> : <ExternalLink className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/platform-connections", { cache: "no-store" });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || `request_failed_${res.status}`);
        }
        const body = (await res.json()) as { connections: ConnectedAccount[] };
        if (cancelled) return;
        setAccounts(body.connections || []);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load connections");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const connectedPlatforms = accounts.filter((a) => a.status === "connected").map((a) => a.platformId);

  async function handleDisconnect(id: string) {
    setError(null);
    const prev = accounts;
    setAccounts((p) => p.filter((a) => a.id !== id));
    const res = await fetch(`/api/platform-connections?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      setAccounts(prev);
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error || `disconnect_failed_${res.status}`);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {loading && <div className="text-xs text-[#625d58]">Loading integrations…</div>}
      {error && <div className="text-xs text-[#9e4d3b]">{error}</div>}
      <ConnectedAccountsList accounts={accounts} onDisconnect={handleDisconnect} />
      <AvailablePlatforms connected={connectedPlatforms} />
      <ApiKeysSection />
    </div>
  );
}
