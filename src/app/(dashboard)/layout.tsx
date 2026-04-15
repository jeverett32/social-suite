"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AccountSwitcher } from "@/components/shared/account-switcher";
import {
  clearDemoSessionCookie,
  getDemoSessionClient,
  getWorkspaceTimezoneClient,
  WORKSPACE_TIMEZONE_CHANGED_EVENT,
} from "@/lib/demo-session";
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
  X,
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
  const [workspaceTimeZone, setWorkspaceTimeZone] = useState(() => getWorkspaceTimezoneClient());
  const session = getDemoSessionClient();
  const displayName = session?.fullName || "John Everett";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const update = () => setWorkspaceTimeZone(getWorkspaceTimezoneClient());
    update();
    window.addEventListener(WORKSPACE_TIMEZONE_CHANGED_EVENT, update as EventListener);
    return () => window.removeEventListener(WORKSPACE_TIMEZONE_CHANGED_EVENT, update as EventListener);
  }, []);

  useEffect(() => {
    // Close the mobile drawer on navigation.
    setMobileNavOpen(false);
    setWorkspaceTimeZone(getWorkspaceTimezoneClient());
  }, [pathname]);

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-border flex items-center justify-between gap-3">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2">
          <span className="size-7 rounded-md bg-warm flex items-center justify-center">
            <span className="text-paper text-sm font-bold">K</span>
          </span>
          <span className="text-base font-bold text-ink tracking-tight">Krowdr</span>
        </Link>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close navigation"
            className={cn(
              "md:hidden size-8 rounded-md hover:bg-shell text-[#625d58] hover:text-ink transition-colors flex items-center justify-center",
              !onNavigate && "hidden"
            )}
          >
            <X className="size-4" />
          </button>
        </Dialog.Close>
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
              onClick={onNavigate}
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
            onClick={onNavigate}
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
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-full bg-[#3f5870] flex items-center justify-center flex-shrink-0">
            <span className="text-paper text-[11px] font-bold">{initials || "JE"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink truncate">{displayName}</p>
            <p className="text-[11px] text-[#625d58] truncate">{session?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Dialog.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <div className="flex h-screen overflow-hidden bg-shell">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-[248px] flex-shrink-0 flex-col bg-white border-r border-border overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 md:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[248px] bg-white border-r border-border overflow-y-auto md:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <div className="flex h-full flex-col">
              <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </Dialog.Content>
        </Dialog.Portal>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="h-[52px] flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 bg-shell border-b border-border">
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="md:hidden size-9 flex items-center justify-center rounded-md hover:bg-panel text-[#625d58] hover:text-ink transition-colors"
              >
                <Menu className="size-4" />
              </button>
            </Dialog.Trigger>

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
                className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium border border-border bg-panel text-[#625d58] hover:bg-paper hover:text-ink transition-colors max-w-[120px] sm:max-w-[180px] truncate"
                title={workspaceTimeZone}
              >
                TZ: {workspaceTimeZone}
              </Link>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-warm text-paper rounded-md text-xs font-medium hover:bg-warm/90 transition-colors">
                <Plus className="size-3" />
                New Post
              </button>
              <button
                onClick={() => {
                  clearDemoSessionCookie();
                  router.replace("/login");
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-panel text-[#625d58] hover:bg-paper hover:text-ink transition-colors"
              >
                Log out
              </button>
              <button
                aria-label="Notifications"
                className="relative size-8 flex items-center justify-center rounded-md hover:bg-panel text-[#625d58] hover:text-ink transition-colors"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-warm" />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6 bg-shell">{children}</main>
        </div>
      </div>
    </Dialog.Root>
  );
}
