"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const mockAccounts = [
  { id: "1", name: "Krowdr Brand", handle: "@krowdr" },
  { id: "2", name: "Demo Agency", handle: "@demoagency" },
  { id: "3", name: "Test Org", handle: "@testorg" },
];

interface AccountSwitcherProps {
  className?: string;
}

export function AccountSwitcher({ className }: AccountSwitcherProps) {
  const [selected, setSelected] = useState(mockAccounts[0]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-shell text-sm font-medium text-ink transition-colors",
            className
          )}
          aria-label="Switch workspace"
        >
          <span className="size-6 rounded-md bg-warm/20 text-warm flex items-center justify-center text-[11px] font-bold">
            {selected.name[0]}
          </span>
          <span className="max-w-[120px] truncate">{selected.name}</span>
          <ChevronDown className="size-3.5 text-[#625d58]" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={6}
        align="start"
        className="w-56 bg-paper border border-border rounded-lg shadow-lg py-1 z-50"
      >
        {mockAccounts.map((account) => (
          <DropdownMenu.Item
            key={account.id}
            onSelect={() => setSelected(account)}
            className="outline-none cursor-pointer data-[highlighted]:bg-shell px-3 py-2"
          >
            <div className="flex items-center gap-2 text-sm text-ink">
              <span className="size-5 rounded bg-warm/20 text-warm flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {account.name[0]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{account.name}</p>
                <p className="text-[11px] text-[#625d58] truncate">{account.handle}</p>
              </div>
              {selected.id === account.id && (
                <Check className="size-3.5 text-warm flex-shrink-0" />
              )}
            </div>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
