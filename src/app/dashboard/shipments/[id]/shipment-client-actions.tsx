"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  trackingCode: string;
  trackingUrl: string;
  receiptUrl: string;
  recipientEmail?: string | null;
  recipientName?: string | null;
}

export function ShipmentClientActions({
  trackingCode,
  trackingUrl,
  receiptUrl,
  recipientEmail,
  recipientName,
}: Props) {
  const [copied, setCopied] = useState<"receipt" | "message" | null>(null);

  const clientMessage = useMemo(
    () =>
      [
        `Hello${recipientName ? ` ${recipientName}` : ""},`,
        "",
        "Your USPS-S shipment has been created.",
        "",
        `Tracking number: ${trackingCode}`,
        `Track shipment: ${trackingUrl}`,
        `Receipt: ${receiptUrl}`,
        "",
        "Thank you.",
      ].join("\n"),
    [receiptUrl, recipientName, trackingCode, trackingUrl],
  );

  const mailHref = `mailto:${recipientEmail ?? ""}?subject=${encodeURIComponent(
    `USPS-S shipment ${trackingCode}`,
  )}&body=${encodeURIComponent(clientMessage)}`;

  async function copy(text: string, kind: "receipt" | "message") {
    if (!navigator.clipboard) {
      window.prompt("Copy this:", text);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Copy this:", text);
    }
  }

  return (
    <div className="dash-card">
      <h4 className="dash-card-title-sm">Client receipt</h4>
      <p className="dash-card-sub">
        A USPS-S receipt is ready for this tracking number. Send the client the
        receipt link or the full tracking message.
      </p>

      <div className="dash-client-link">
        <span>Receipt</span>
        <code>{receiptUrl}</code>
      </div>

      <div className="dash-client-actions">
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => copy(receiptUrl, "receipt")}
        >
          {copied === "receipt" ? (
            <Check size={13} strokeWidth={2} />
          ) : (
            <Copy size={13} strokeWidth={1.6} />
          )}
          {copied === "receipt" ? "Receipt copied" : "Copy receipt"}
        </button>
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => copy(clientMessage, "message")}
        >
          {copied === "message" ? (
            <Check size={13} strokeWidth={2} />
          ) : (
            <Copy size={13} strokeWidth={1.6} />
          )}
          {copied === "message" ? "Message copied" : "Copy message"}
        </button>
        <a className="btn-primary btn-sm" href={mailHref}>
          <Mail size={13} strokeWidth={1.6} />
          Email client
        </a>
      </div>
    </div>
  );
}
