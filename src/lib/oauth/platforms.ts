import "server-only";

import type { PlatformId } from "@/types/platform";

export type OAuthPlatform = Exclude<PlatformId, "pinterest">;

export type OAuthConfig = {
  platform: OAuthPlatform;
  authorizeUrl: string;
  tokenUrl: string;
  clientIdEnv: string;
  clientSecretEnv?: string;
  // Some platforms use different param names.
  clientIdParam?: string;
  clientSecretParam?: string;
  scopes: string[];
  // OAuth request extras.
  extraAuthorizeParams?: Record<string, string>;
  // Whether to require PKCE.
  pkce: "required" | "optional" | "none";
};

export const OAUTH_PLATFORMS: Record<OAuthPlatform, OAuthConfig> = {
  linkedin: {
    platform: "linkedin",
    authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    clientIdEnv: "LINKEDIN_CLIENT_ID",
    clientSecretEnv: "LINKEDIN_CLIENT_SECRET",
    scopes: ["w_member_social"],
    pkce: "optional",
  },
  tiktok: {
    platform: "tiktok",
    authorizeUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    clientIdEnv: "TIKTOK_CLIENT_KEY",
    clientSecretEnv: "TIKTOK_CLIENT_SECRET",
    clientIdParam: "client_key",
    clientSecretParam: "client_secret",
    scopes: ["user.info.basic", "video.publish", "video.upload"],
    pkce: "required",
  },
  instagram: {
    platform: "instagram",
    authorizeUrl: "https://www.facebook.com/v21.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
    clientIdEnv: "META_APP_ID",
    clientSecretEnv: "META_APP_SECRET",
    scopes: [
      "instagram_basic",
      "instagram_content_publish",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
    ],
    pkce: "none",
  },
  facebook: {
    platform: "facebook",
    authorizeUrl: "https://www.facebook.com/v21.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
    clientIdEnv: "META_APP_ID",
    clientSecretEnv: "META_APP_SECRET",
    scopes: ["pages_show_list", "pages_read_engagement", "pages_manage_posts"],
    pkce: "none",
  },
  youtube: {
    platform: "youtube",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "YOUTUBE_CLIENT_ID",
    clientSecretEnv: "YOUTUBE_CLIENT_SECRET",
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
    extraAuthorizeParams: {
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
    },
    pkce: "optional",
  },
  x: {
    // Not requested to ship right now, but keep the type slot.
    platform: "x",
    authorizeUrl: "",
    tokenUrl: "",
    clientIdEnv: "TWITTER_CLIENT_ID",
    clientSecretEnv: "TWITTER_CLIENT_SECRET",
    scopes: [],
    pkce: "optional",
  },
};

export function getOAuthConfig(platform: string): OAuthConfig | null {
  const p = platform as OAuthPlatform;
  return p in OAUTH_PLATFORMS ? OAUTH_PLATFORMS[p] : null;
}

export function getOAuthClientCreds(cfg: OAuthConfig) {
  const clientId = process.env[cfg.clientIdEnv] || "";
  const clientSecret = cfg.clientSecretEnv ? process.env[cfg.clientSecretEnv] || "" : "";
  return { clientId, clientSecret };
}
