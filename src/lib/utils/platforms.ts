import type { Platform, PlatformId } from "@/types/platform";

export const PLATFORMS: Record<PlatformId, Platform> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    bgColor: "#fce4ec",
    charLimit: 2200,
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    color: "#010101",
    bgColor: "#f0f0f0",
    charLimit: 2200,
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    bgColor: "#e3f2fd",
    charLimit: 63206,
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    bgColor: "#e8f0fb",
    charLimit: 3000,
  },
  x: {
    id: "x",
    name: "X",
    color: "#000000",
    bgColor: "#f0f0f0",
    charLimit: 280,
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    bgColor: "#ffebee",
    charLimit: 5000,
  },
  pinterest: {
    id: "pinterest",
    name: "Pinterest",
    color: "#E60023",
    bgColor: "#fce4e4",
    charLimit: 500,
  },
};

export function getPlatform(id: PlatformId): Platform {
  return PLATFORMS[id];
}
