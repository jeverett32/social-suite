"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/settings", label: "General" },
  { href: "/settings/team", label: "Team" },
  { href: "/settings/integrations", label: "Integrations" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink leading-tight tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-[#625d58]">Workspace preferences, team access, and connections.</p>
        </div>
      </div>

      <div className="bg-panel border border-border rounded-lg p-1 flex gap-1 flex-wrap">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                active ? "bg-warm text-paper" : "text-[#625d58] hover:text-ink hover:bg-shell"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}
