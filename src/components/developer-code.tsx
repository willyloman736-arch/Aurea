"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";

const SNIPPETS = {
  curl: `# Track a shipment
curl https://api.usps-s.com/v1/trackers/USPS-S-2847-JK3921 \\
  -H "Authorization: Bearer $USPS_S_KEY"

# Response (200 OK)
{
  "tracking_code": "USPS-S-2847-JK3921",
  "carrier": "fedex",
  "status": "in_transit",
  "eta": "2026-04-23T13:45:00Z",
  "origin": { "city": "Singapore", "country": "SG" },
  "destination": { "city": "Amsterdam", "country": "NL" },
  "events": [ ... ]
}`,
  node: `// Node.js SDK
import UspsS from "@usps-s/sdk";

const usps = new UspsS(process.env.USPS_S_KEY);

const shipment = await usps.trackers.get("USPS-S-2847-JK3921");

console.log(shipment.status);  // "in_transit"
console.log(shipment.eta);     // 2026-04-23T13:45:00Z

// Subscribe to real-time updates
usps.events.on("tracker.updated", (event) => {
  console.log(\`\${event.id} is now \${event.status}\`);
});`,
  python: `# Python SDK
import os
from usps_s import UspsS

usps = UspsS(os.environ["USPS_S_KEY"])

shipment = usps.trackers.get("USPS-S-2847-JK3921")

print(shipment.status)   # "in_transit"
print(shipment.eta)      # 2026-04-23T13:45:00Z

# Subscribe to real-time updates
@usps.events.on("tracker.updated")
def handle_update(event):
    print(f"{event.id} is now {event.status}")`,
};

const LANGS = [
  { key: "curl" as const, label: "cURL" },
  { key: "node" as const, label: "Node.js" },
  { key: "python" as const, label: "Python" },
];

const FEATURES = [
  "Three lines to track any package",
  "HMAC-signed webhooks + replay tool",
  "Idempotency keys on every write",
  "Full OpenAPI 3.1 spec + Postman collection",
];

export function DeveloperCode() {
  const [lang, setLang] = useState<keyof typeof SNIPPETS>("curl");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(SNIPPETS[lang]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  return (
    <section className="dev-code" id="developers">
      <div className="container-USPS-S">
        <div className="dev-grid">
          <ScrollReveal className="dev-copy">
            <span className="eyebrow-inline">For developers</span>
            <h2 className="section-title">
              Ship integration<br />
              <em>in a weekend.</em>
            </h2>
            <p className="section-sub">
              REST or SDK, your choice. Type-safe clients for TypeScript,
              Python, Go, and Ruby. Every response includes a request-id for
              debugging. Rate limits are generous. Errors are always JSON.
            </p>
            <ul className="dev-features">
              {FEATURES.map((f) => (
                <li key={f}>
                  <span className="dev-tick">
                    <Check size={11} strokeWidth={2.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="#" className="link-arrow">
              Read the API docs <span>→</span>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="dev-terminal">
            <div className="dev-terminal-head">
              <div className="dev-tabs">
                {LANGS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    className={cn("dev-tab", lang === l.key && "active")}
                    onClick={() => setLang(l.key)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="dev-copy-btn"
                onClick={copy}
                title="Copy code"
                aria-label="Copy code"
              >
                {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.5} />}
              </button>
            </div>
            <pre className="dev-code-block">
              <code>{SNIPPETS[lang]}</code>
            </pre>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
