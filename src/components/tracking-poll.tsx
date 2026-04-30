"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 30_000;

interface Props {
  /**
   * If false, no polling happens. Use to skip terminal states like
   * Delivered or Exception where nothing more is going to change.
   */
  enabled?: boolean;
}

/**
 * Re-runs server-side data fetch for the current page every 30 seconds
 * while the tab is visible. Preserves scroll, React state, and expanded
 * accordions — only the underlying data is refreshed. When new tracking
 * events land in the DB they appear here within ~30s without the user
 * lifting a finger.
 *
 * Pauses while the tab is hidden (saves DB queries) and resumes the
 * moment it becomes visible again, with an immediate refresh so the
 * user doesn't have to wait the full interval after coming back.
 */
export function TrackingPoll({ enabled = true }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    function schedule() {
      timer = setTimeout(() => {
        if (document.visibilityState === "visible") {
          router.refresh();
        }
        schedule();
      }, POLL_INTERVAL_MS);
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        // Coming back to the tab — refresh immediately, then resume schedule
        router.refresh();
        if (timer) clearTimeout(timer);
        schedule();
      }
    }

    schedule();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, router]);

  return null;
}
