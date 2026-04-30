"use client";

import { useState } from "react";
import { Download, Share2, Check } from "lucide-react";

interface Props {
  trackingCode: string;
  status: string;
}

export function TrackingActions({ trackingCode, status }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = `Aurea tracking · ${trackingCode}`;
    const text = `Track this Aurea shipment (${status}): ${trackingCode}`;

    // Web Share API (mobile + Safari) — opens native share sheet
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({ url, title, text });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }

    // Fallback — copy URL to clipboard
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // Best-effort prompt
        window.prompt("Copy this link:", url);
      }
    }
  }

  function handlePrint() {
    if (typeof window === "undefined") return;
    window.print();
  }

  return (
    <div className="result-actions">
      <button type="button" className="btn-ghost" onClick={handleShare}>
        {copied ? (
          <>
            <Check size={14} strokeWidth={2} />
            <span>Link copied</span>
          </>
        ) : (
          <>
            <Share2 size={14} strokeWidth={1.6} />
            <span>Share</span>
          </>
        )}
      </button>
      <button type="button" className="btn-ghost" onClick={handlePrint}>
        <Download size={14} strokeWidth={1.6} />
        <span>Download PDF</span>
      </button>
    </div>
  );
}
