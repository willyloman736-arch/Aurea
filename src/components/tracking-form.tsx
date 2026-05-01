"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ClipboardCopy } from "lucide-react";
import { cn, formatTrackingId } from "@/lib/utils";

type Tab = "tracking" | "reference" | "order";

const PLACEHOLDERS: Record<Tab, string> = {
  tracking: "Enter tracking number — e.g. USPS-S-2847-JK3921",
  reference: "Enter reference — PO, BOL, invoice",
  order: "Enter order ID — e.g. ORD-882901",
};

const DEMO_IDS = ["USPS-S-2847-JK3921", "USPS-S-9931-LM7740"];

export function TrackingForm() {
  const [tab, setTab] = useState<Tab>("tracking");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = value.trim();
    if (!raw) return;
    setSubmitting(true);
    router.push(`/track/${encodeURIComponent(formatTrackingId(raw))}`);
  }

  function handleDemo(id: string) {
    setValue(id);
    setSubmitting(true);
    router.push(`/track/${encodeURIComponent(id)}`);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--spot-x", `${x}%`);
    card.style.setProperty("--spot-y", `${y}%`);
    card.style.setProperty("--spot-opacity", "1");
  }

  function handleMouseLeave() {
    cardRef.current?.style.setProperty("--spot-opacity", "0");
  }

  return (
    <div
      ref={cardRef}
      className="track-card"
      id="track"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="track-tabs" role="tablist">
        {(Object.keys(PLACEHOLDERS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={cn("track-tab", tab === t && "active")}
            onClick={() => setTab(t)}
          >
            {t === "tracking" ? "Tracking number" : t === "reference" ? "Reference" : "Order ID"}
          </button>
        ))}
      </div>

      <form className="track-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="track-input-wrap">
          <Search className="track-input-icon" strokeWidth={1.5} />
          <input
            type="text"
            className="track-input"
            placeholder={PLACEHOLDERS[tab]}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            autoFocus
          />
          <kbd className="track-kbd">↵</kbd>
        </div>
        <button
          type="submit"
          className="btn-primary btn-track"
          disabled={submitting || !value.trim()}
        >
          {submitting ? "Tracking…" : "Track"}
        </button>
      </form>

      <div className="track-hint">
        <span className="hint-label">Demo</span>
        {DEMO_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className="hint-chip"
            onClick={() => handleDemo(id)}
          >
            <ClipboardCopy size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
            {id}
          </button>
        ))}
      </div>
    </div>
  );
}
