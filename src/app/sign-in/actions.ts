"use server";

import { redirect } from "next/navigation";
import {
  checkCredentials,
  isAuthRequired,
  setAuthCookie,
} from "@/lib/auth";

export async function signInAction(formData: FormData) {
  const user = ((formData.get("user") as string | null) ?? "").trim();
  const pass = (formData.get("pass") as string | null) ?? "";
  const next = ((formData.get("next") as string | null) ?? "/dashboard").trim();

  if (!user || !pass) {
    return { error: "Email and password are required." };
  }

  if (!isAuthRequired()) {
    // Auth env vars missing — operator hasn't configured DASHBOARD_USER
    // and DASHBOARD_PASSWORD yet. Let through anyway so dev still works.
    redirect(next || "/dashboard");
  }

  if (!checkCredentials(user, pass)) {
    return { error: "Invalid email or password." };
  }

  await setAuthCookie();
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOutAction() {
  const { clearAuthCookie } = await import("@/lib/auth");
  await clearAuthCookie();
  redirect("/sign-in");
}
