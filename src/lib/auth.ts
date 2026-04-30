// Lightweight shared-credential auth for the operator dashboard.
//
// Two env vars control access:
//   DASHBOARD_USER     — username or email the client logs in with
//   DASHBOARD_PASSWORD — password for the dashboard
//
// If either is missing, the dashboard is OPEN (useful in dev). Set both
// in Vercel project env vars to activate the gate.
//
// The cookie value is a base64 of the password — meaning if you rotate
// the password in env vars, every existing session is automatically
// invalidated. No session store needed.

import { cookies } from "next/headers";

export const AUTH_COOKIE = "aurea_dash_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getExpectedToken(): string | null {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password || password.length === 0) return null;
  // Encode so we don't store the password verbatim. Not cryptographic,
  // just keeps the cookie from looking like the literal password.
  if (typeof Buffer !== "undefined") {
    return `t1.${Buffer.from(password, "utf8").toString("base64url")}`;
  }
  // Edge runtime fallback (no Buffer)
  return `t1.${btoa(password).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")}`;
}

export function isAuthRequired(): boolean {
  return Boolean(process.env.DASHBOARD_USER && process.env.DASHBOARD_PASSWORD);
}

export function checkCredentials(user: string, pass: string): boolean {
  const expectedUser = process.env.DASHBOARD_USER;
  const expectedPass = process.env.DASHBOARD_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  // Case-insensitive on the user (lots of clients type it differently).
  return (
    user.trim().toLowerCase() === expectedUser.trim().toLowerCase() &&
    pass === expectedPass
  );
}

export async function setAuthCookie(): Promise<void> {
  const token = getExpectedToken();
  if (!token) return;
  const c = await cookies();
  c.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const c = await cookies();
  c.delete(AUTH_COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  if (!isAuthRequired()) return true; // gate disabled
  const c = await cookies();
  const cookie = c.get(AUTH_COOKIE);
  return !!cookie && cookie.value === getExpectedToken();
}
