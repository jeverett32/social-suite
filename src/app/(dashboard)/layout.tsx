"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AccountSwitcher } from "@/components/shared/account-switcher";
import { getWorkspaceTimezoneClient } from "@/lib/demo-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  TrendingUp,
  PenTool,
  MessageSquare,
  Clock,
  Ear,
  Mic,
  Settings,
  Search,
  Bell,
  Plus,
  Menu,
  LogOut,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BarChart3 },
  { href: "/plan", label: "Plan", icon: Calendar },
  { href: "/predict", label: "Predict", icon: TrendingUp },
  { href: "/draft", label: "Draft", icon: PenTool },
  { href: "/inbox", label: "Inbox", icon: MessageSquare, badge: 2 },
  { href: "/schedule", label: "Schedule", icon: Clock },
  { href: "/listen", label: "Listen", icon: Ear },
  { href: "/voice", label: "Voice", icon: Mic },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [timeZone, setTimeZone] = useState(() => getWorkspaceTimezoneClient());

  const [userEmail, setUserEmail] = useState<string | null>(null);

  const displayName = userEmail ? titleCase(userEmail.split("@")[0] || "") : "Account";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    // Refresh in case user changed it in Settings.
    setTimeZone(getWorkspaceTimezoneClient());
  }, [pathname]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  function titleCase(value: string) {
    return value
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
  }

  function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    void supabase.auth.signOut();
    setMobileNavOpen(false);
    router.push("/login");
  }

  const sidebar = (
    <aside className="w-[248px] flex-shrink-0 flex flex-col bg-white border-r border-border overflow-y-auto">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <Link href="/" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2">
          <span className="size-7 rounded-md bg-warm flex items-center justify-center">
            <span className="text-paper text-sm font-bold">K</span>
          </span>
          <span className="text-base font-bold text-ink tracking-tight">Krowdr</span>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 py-3 border-b border-border">
        <AccountSwitcher />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileNavOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors group",
                active
                  ? "bg-warm/10 text-warm font-medium"
                  : "text-[#625d58] hover:bg-shell hover:text-ink"
              )}
            >
              <Icon
                className={cn(
                  "size-4 flex-shrink-0",
                  active ? "text-warm" : "text-[#625d58] group-hover:text-ink"
                )}
              />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="size-5 rounded-full bg-warm text-paper text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-2 mt-2 border-t border-border">
          <Link
            href="/settings"
            onClick={() => setMobileNavOpen(false)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors group",
              pathname.startsWith("/settings")
                ? "bg-warm/10 text-warm font-medium"
                : "text-[#625d58] hover:bg-shell hover:text-ink"
            )}
          >
            <Settings
              className={cn(
                "size-4 flex-shrink-0",
                pathname.startsWith("/settings")
                  ? "text-warm"
                  : "text-[#625d58] group-hover:text-ink"
              )}
            />
            Settings
          </Link>
        </div>
      </nav>

      {/* Profile */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-7 rounded-full bg-[#3f5870] flex items-center justify-center flex-shrink-0">
              <span className="text-paper text-[11px] font-bold">{initials || "JE"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink truncate">{displayName}</p>
              <p className="text-[11px] text-[#625d58] truncate">{userEmail || ""}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-xs font-medium text-[#625d58] hover:bg-panel hover:text-ink transition-colors flex-shrink-0"
          >
            <LogOut className="size-3.5" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-shell">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Sidebar (mobile) */}
      <Dialog.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-ink/50 z-50 md:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 md:hidden">
            {sidebar}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[52px] flex-shrink-0 flex items-center gap-4 px-6 bg-shell border-b border-border">
          <button
            type="button"
            className="md:hidden -ml-2 size-9 flex items-center justify-center rounded-md hover:bg-panel text-[#625d58] hover:text-ink transition-colors"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-4" />
          </button>

          <div className="flex-1 flex items-center gap-2 max-w-sm">
            <Search className="size-3.5 text-[#625d58] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-[#625d58] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/settings"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-panel text-[11px] font-medium text-[#625d58] hover:text-ink hover:bg-shell transition-colors max-w-44 truncate"
              title={`Workspace timezone: ${timeZone}`}
            >
              {timeZone}
            </Link>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-warm text-paper rounded-md text-xs font-medium hover:bg-warm/90 transition-colors">
              <Plus className="size-3" />
              New Post
            </button>
            <button
              aria-label="Notifications"
              className="relative size-8 flex items-center justify-center rounded-md hover:bg-panel text-[#625d58] hover:text-ink transition-colors"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-warm" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-medium text-[#625d58] hover:bg-panel hover:text-ink transition-colors"
            >
              <LogOut className="size-3.5" />
              Log out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-shell">
          {children}
        </main>
      </div>
    </div>
  );
}
