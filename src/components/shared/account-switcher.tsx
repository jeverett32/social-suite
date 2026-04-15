"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSwitcherProps {
  className?: string;
}

export function AccountSwitcher({ className }: AccountSwitcherProps) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-shell text-sm font-medium text-ink transition-colors",
        className
      )}
      aria-label="Workspace"
    >
      <span className="size-6 rounded-md bg-warm/20 text-warm flex items-center justify-center text-[11px] font-bold">
        P
      </span>
      <span className="max-w-[120px] truncate">Personal workspace</span>
      <ChevronDown className="size-3.5 text-[#625d58] opacity-60" />
    </button>
  );
}
