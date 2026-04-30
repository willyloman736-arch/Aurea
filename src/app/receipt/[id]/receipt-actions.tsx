"use client";

import Link from "next/link";
import { ArrowLeft, Printer, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Props {
  backHref: string;
  trackingCode: string;
}

export function ReceiptActions({ backHref, trackingCode }: Props) {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    window.print();
  }

  async function copyTrackingLink() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/track/${trackingCode}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        window.prompt("Copy this link:", url);
      }
    }
  }

  return (
    <div className="rcpt-actions">
      <div className="rcpt-actions-inner">
        <Link href={backHref} className="btn-ghost btn-sm">
          <ArrowLeft size={13} strokeWidth={1.6} />
          Back to shipment
        </Link>

        <div className="rcpt-actions-right">
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={copyTrackingLink}
          >
            {copied ? (
              <>
                <Check size={13} strokeWidth={2} />
                Tracking link copied
              </>
            ) : (
              <>
                <Copy size={13} strokeWidth={1.6} />
                Copy tracking link
              </>
            )}
          </button>
          <Link
            href={`/track/${trackingCode}`}
            target="_blank"
            className="btn-ghost btn-sm"
          >
            <ExternalLink size={13} strokeWidth={1.6} />
            Public view
          </Link>
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={handlePrint}
            data-magnetic
          >
            <Printer size={13} strokeWidth={1.6} />
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
