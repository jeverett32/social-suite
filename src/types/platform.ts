export type PlatformId =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "x"
  | "youtube"
  | "pinterest";

export interface Platform {
  id: PlatformId;
  name: string;
  color: string;
  bgColor: string;
  charLimit?: number;
}
