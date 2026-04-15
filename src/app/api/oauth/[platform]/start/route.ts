import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createPkcePair, createStateToken } from "@/lib/oauth/pkce";
import { getOAuthClientCreds, getOAuthConfig } from "@/lib/oauth/platforms";

const OAUTH_STATE_COOKIE = "krowdr_oauth_state";
const OAUTH_VERIFIER_COOKIE = "krowdr_oauth_verifier";
const OAUTH_PLATFORM_COOKIE = "krowdr_oauth_platform";

export async function GET(req: NextRequest, ctx: { params: Promise<{ platform: string }> }) {
  const { platform } = await ctx.params;
  const cfg = getOAuthConfig(platform);
  if (!cfg || !cfg.authorizeUrl) {
    const redirect = new URL("/settings/integrations", req.nextUrl.origin);
    redirect.searchParams.set("error", "unsupported_platform");
    redirect.searchParams.set("platform", platform);
    return NextResponse.redirect(redirect);
  }

  const { clientId } = getOAuthClientCreds(cfg);
  if (!clientId) {
    const redirect = new URL("/settings/integrations", req.nextUrl.origin);
    redirect.searchParams.set("error", "missing_config");
    redirect.searchParams.set("platform", cfg.platform);
    return NextResponse.redirect(redirect);
  }

  const state = createStateToken();
  const pkce = createPkcePair();
  const callbackUrl = new URL(`/api/oauth/${cfg.platform}/callback`, req.nextUrl.origin);
  const next = req.nextUrl.searchParams.get("next") || "/settings/integrations";
  callbackUrl.searchParams.set("next", next);

  const authUrl = new URL(cfg.authorizeUrl);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", callbackUrl.toString());
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", cfg.scopes.join(" "));

  if (cfg.pkce !== "none") {
    authUrl.searchParams.set("code_challenge", pkce.challenge);
    authUrl.searchParams.set("code_challenge_method", pkce.method);
  }

  if (cfg.extraAuthorizeParams) {
    for (const [k, v] of Object.entries(cfg.extraAuthorizeParams)) {
      authUrl.searchParams.set(k, v);
    }
  }

  const res = NextResponse.redirect(authUrl);
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: req.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 10,
  };
  res.cookies.set(OAUTH_STATE_COOKIE, state, cookieOpts);
  res.cookies.set(OAUTH_VERIFIER_COOKIE, pkce.verifier, cookieOpts);
  res.cookies.set(OAUTH_PLATFORM_COOKIE, cfg.platform, cookieOpts);
  return res;
}
