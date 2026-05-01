"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
import { signInAction } from "./actions";

export function SignInForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("next", next);
    start(async () => {
      const res = await signInAction(fd);
      if (res?.error) setError(res.error);
      // success → server-side redirect, function never returns
    });
  }

  return (
    <main className="signin-shell USPS-S-dark">
      <Link href="/" className="signin-brand" aria-label="USPS-S — home">
        <Image
          src="/logo.svg"
          alt="USPS-S"
          width={48}
          height={48}
          className="brand-mark brand-mark-img"
          priority
        />
      </Link>

      <div className="signin-card">
        <div className="signin-head">
          <span className="eyebrow-inline">Operator login</span>
          <h1 className="signin-title">
            Sign in to <em>operations</em>
          </h1>
          <p className="signin-sub">
            Use the credentials your account manager sent you.
          </p>
        </div>

        <form onSubmit={onSubmit} className="signin-form">
          <div className="ship-field">
            <label htmlFor="user">Email or username</label>
            <input
              id="user"
              name="user"
              type="text"
              required
              autoFocus
              autoComplete="username"
              className="ship-input"
              disabled={pending}
              placeholder="[email protected]"
            />
          </div>
          <div className="ship-field">
            <label htmlFor="pass">Password</label>
            <input
              id="pass"
              name="pass"
              type="password"
              required
              autoComplete="current-password"
              className="ship-input"
              disabled={pending}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="dash-alert">
              <AlertCircle size={14} strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary signin-submit"
            disabled={pending}
            data-magnetic
          >
            {pending ? "Signing in…" : "Sign in"}
            {!pending && <ArrowRight size={13} strokeWidth={1.6} />}
          </button>
        </form>

        <div className="signin-foot">
          <span>Need access?</span>
          <Link href="/contact">Contact your account manager</Link>
        </div>
      </div>
    </main>
  );
}
