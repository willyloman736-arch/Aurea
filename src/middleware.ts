import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "usps_s_dash_auth";

/**
 * Edge-runtime expected-token computation. Mirrors lib/auth.ts but
 * doesn't import it — middleware bundles separately and we want this
 * file to stay dependency-light.
 */
function getExpectedToken(): string | null {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password || password.length === 0) return null;
  // Edge runtime: no Node Buffer. Use btoa with URL-safe variant.
  const b64 = btoa(unescape(encodeURIComponent(password)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `t1.${b64}`;
}

export function middleware(request: NextRequest) {
  // If env vars aren't set, gate is disabled — let everyone through.
  const expected = getExpectedToken();
  if (!expected) return NextResponse.next();

  const auth = request.cookies.get(AUTH_COOKIE);
  if (auth && auth.value === expected) return NextResponse.next();

  // Redirect to /sign-in with the original path preserved as ?next=
  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/receipt/:path*"],
};
