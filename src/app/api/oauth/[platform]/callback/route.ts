import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { encryptToken } from "@/lib/token-crypto";
import { getOAuthClientCreds, getOAuthConfig } from "@/lib/oauth/platforms";

const OAUTH_STATE_COOKIE = "krowdr_oauth_state";
const OAUTH_VERIFIER_COOKIE = "krowdr_oauth_verifier";
const OAUTH_PLATFORM_COOKIE = "krowdr_oauth_platform";

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  scope?: string;
  token_type?: string;
  open_id?: string;
};

async function exchangeToken({
  tokenUrl,
  body,
}: {
  tokenUrl: string;
  body: Record<string, string>;
}): Promise<TokenResponse> {
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`token_exchange_failed_${res.status}:${text.slice(0, 200)}`);
  }

  return (await res.json()) as TokenResponse;
}

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ platform: string }> }) {
  const { platform } = await ctx.params;
  const cfg = getOAuthConfig(platform);
  if (!cfg) {
    const redirect = new URL("/settings/integrations", req.nextUrl.origin);
    redirect.searchParams.set("error", "unsupported_platform");
    redirect.searchParams.set("platform", platform);
    return NextResponse.redirect(redirect);
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const next = url.searchParams.get("next") || "/settings/integrations";

  if (!code || !state) {
    const redirect = new URL(next, req.nextUrl.origin);
    redirect.searchParams.set("error", "missing_code");
    redirect.searchParams.set("platform", cfg.platform);
    return NextResponse.redirect(redirect);
  }

  const cookieState = req.cookies.get(OAUTH_STATE_COOKIE)?.value || "";
  const cookieVerifier = req.cookies.get(OAUTH_VERIFIER_COOKIE)?.value || "";
  const cookiePlatform = req.cookies.get(OAUTH_PLATFORM_COOKIE)?.value || "";

  if (!cookieState || cookieState !== state || cookiePlatform !== cfg.platform) {
    const redirect = new URL(next, req.nextUrl.origin);
    redirect.searchParams.set("error", "invalid_state");
    redirect.searchParams.set("platform", cfg.platform);
    return NextResponse.redirect(redirect);
  }

  const { clientId, clientSecret } = getOAuthClientCreds(cfg);
  if (!clientId || (cfg.clientSecretEnv && !clientSecret)) {
    const redirect = new URL(next, req.nextUrl.origin);
    redirect.searchParams.set("error", "missing_config");
    redirect.searchParams.set("platform", cfg.platform);
    return NextResponse.redirect(redirect);
  }

  const callbackUrl = new URL(`/api/oauth/${cfg.platform}/callback`, req.nextUrl.origin);
  callbackUrl.searchParams.set("next", next);

  try {
    const tokenParams: Record<string, string> = {
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl.toString(),
      [cfg.clientIdParam || "client_id"]: clientId,
    };
    if (cfg.clientSecretEnv) {
      tokenParams[cfg.clientSecretParam || "client_secret"] = clientSecret;
    }
    if (cfg.pkce !== "none") {
      tokenParams.code_verifier = cookieVerifier;
    }

    // Meta uses GET for token exchange.
    let token: TokenResponse;
    if (cfg.platform === "facebook" || cfg.platform === "instagram") {
      const tokenUrl = new URL(cfg.tokenUrl);
      for (const [k, v] of Object.entries(tokenParams)) tokenUrl.searchParams.set(k, v);

      const res = await fetch(tokenUrl.toString());
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`token_exchange_failed_${res.status}:${text.slice(0, 200)}`);
      }
      token = (await res.json()) as TokenResponse;
    } else {
      token = await exchangeToken({ tokenUrl: cfg.tokenUrl, body: tokenParams });
    }

    if (!token.access_token) {
      throw new Error("missing_access_token");
    }

    const accessEnc = encryptToken(token.access_token);
    const refreshEnc = token.refresh_token ? encryptToken(token.refresh_token) : null;

    const now = Date.now();
    const expiresAt = typeof token.expires_in === "number" ? new Date(now + token.expires_in * 1000).toISOString() : null;
    const refreshExpiresAt = typeof token.refresh_expires_in === "number" ? new Date(now + token.refresh_expires_in * 1000).toISOString() : null;
    const scopes = token.scope ? token.scope.split(/\s+/).filter(Boolean) : cfg.scopes;

    // Best-effort account metadata fetch (used for display only).
    let accountId = "me";
    let accountName = "";
    let extra: Record<string, unknown> = {};

    if (cfg.platform === "linkedin") {
      const meRes = await fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const me = await safeJson<{ id?: string; localizedFirstName?: string; localizedLastName?: string }>(meRes);
      if (me?.id) accountId = me.id;
      const name = [me?.localizedFirstName, me?.localizedLastName].filter(Boolean).join(" ");
      if (name) accountName = name;
    }

    if (cfg.platform === "tiktok") {
      if (token.open_id) accountId = token.open_id;
      const infoRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const info = await safeJson<{ data?: { user?: { open_id?: string; display_name?: string; avatar_url?: string } } }>(infoRes);
      const u = info?.data?.user;
      if (u?.open_id) accountId = u.open_id;
      if (u?.display_name) accountName = u.display_name;
      if (u?.avatar_url) extra.avatar_url = u.avatar_url;
    }

    if (cfg.platform === "youtube") {
      const chans = new URL("https://www.googleapis.com/youtube/v3/channels");
      chans.searchParams.set("part", "snippet");
      chans.searchParams.set("mine", "true");
      const chanRes = await fetch(chans.toString(), {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const body = await safeJson<{ items?: { id?: string; snippet?: { title?: string } }[] }>(chanRes);
      const first = body?.items?.[0];
      if (first?.id) accountId = first.id;
      if (first?.snippet?.title) accountName = first.snippet.title;
    }

    if (cfg.platform === "facebook" || cfg.platform === "instagram") {
      // Store the user token; page/IG selection is a separate step.
      const meRes = await fetch(`https://graph.facebook.com/me?fields=id,name&access_token=${encodeURIComponent(token.access_token)}`);
      const me = await safeJson<{ id?: string; name?: string }>(meRes);
      if (me?.id) accountId = me.id;
      if (me?.name) accountName = me.name;
      extra.kind = "user_token";
    }

    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      const redirect = new URL(next, req.nextUrl.origin);
      redirect.searchParams.set("error", "unauthorized");
      redirect.searchParams.set("platform", cfg.platform);
      return NextResponse.redirect(redirect);
    }

    const { error } = await supabase.from("platform_connections").upsert(
      {
        user_id: userData.user.id,
        platform: cfg.platform,
        account_id: accountId,
        account_name: accountName,
        scopes,
        access_token_ciphertext: accessEnc.ciphertext,
        access_token_iv: accessEnc.iv,
        access_token_tag: accessEnc.tag,
        refresh_token_ciphertext: refreshEnc?.ciphertext ?? null,
        refresh_token_iv: refreshEnc?.iv ?? null,
        refresh_token_tag: refreshEnc?.tag ?? null,
        expires_at: expiresAt,
        refresh_expires_at: refreshExpiresAt,
        data: extra,
      },
      { onConflict: "user_id,platform,account_id" }
    );

    if (error) {
      console.error("oauth:connection_upsert_failed", cfg.platform, error);
      const redirect = new URL(next, req.nextUrl.origin);
      redirect.searchParams.set("error", "save_failed");
      redirect.searchParams.set("platform", cfg.platform);
      return NextResponse.redirect(redirect);
    }

    const redirect = new URL(next, req.nextUrl.origin);
    redirect.searchParams.set("connected", cfg.platform);

    const res = NextResponse.redirect(redirect);
    // Clear transient cookies.
    res.cookies.set(OAUTH_STATE_COOKIE, "", { path: "/", maxAge: 0 });
    res.cookies.set(OAUTH_VERIFIER_COOKIE, "", { path: "/", maxAge: 0 });
    res.cookies.set(OAUTH_PLATFORM_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  } catch (e) {
    console.error("oauth:callback_failed", cfg.platform, e);
    const redirect = new URL(next, req.nextUrl.origin);
    redirect.searchParams.set("error", "oauth_failed");
    redirect.searchParams.set("platform", cfg.platform);
    return NextResponse.redirect(redirect);
  }
}
