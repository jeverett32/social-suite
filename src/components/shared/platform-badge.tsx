import { cn } from "@/lib/utils";
import { getPlatform } from "@/lib/utils/platforms";
import type { PlatformId } from "@/types/platform";

interface PlatformBadgeProps {
  platformId: PlatformId;
  size?: "sm" | "md";
  className?: string;
}

export function PlatformBadge({
  platformId,
  size = "md",
  className,
}: PlatformBadgeProps) {
  const platform = getPlatform(platformId);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className
      )}
      style={{ backgroundColor: platform.bgColor, color: platform.color }}
    >
      <span
        className="size-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: platform.color }}
      />
      {platform.name}
    </span>
  );
}
