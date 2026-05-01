import { CheckCircle2, XCircle, Copy } from "lucide-react";
import { DashHeader } from "@/components/dashboard/header";

export const dynamic = "force-dynamic";

function StatusRow({
  label,
  value,
  ok,
  help,
}: {
  label: string;
  value: string;
  ok: boolean;
  help?: string;
}) {
  return (
    <div className="dash-status-item">
      <div className="dash-status-item-head">
        {ok ? (
          <CheckCircle2 size={16} strokeWidth={1.5} className="dash-ok" />
        ) : (
          <XCircle size={16} strokeWidth={1.5} className="dash-not-ok" />
        )}
        <strong>{label}</strong>
        <code>{value}</code>
      </div>
      {help && <p className="dash-status-help">{help}</p>}
    </div>
  );
}

export default async function SettingsPage() {
  const shippoKey = process.env.SHIPPO_API_KEY;
  const hasShippo = !!shippoKey;
  const shippoMode = shippoKey?.startsWith("shippo_test_")
    ? "Test mode"
    : shippoKey?.startsWith("shippo_live_")
      ? "Live mode"
      : "—";
  const hasDb = !!process.env.DATABASE_URL;
  const hasWebhookSecret = !!process.env.SHIPPO_WEBHOOK_SECRET;
  const webhookSecret = process.env.SHIPPO_WEBHOOK_SECRET;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://your-domain.com";
  const webhookUrl = hasWebhookSecret
    ? `${baseUrl}/api/webhooks/shippo?token=${webhookSecret}`
    : `${baseUrl}/api/webhooks/shippo?token=<SHIPPO_WEBHOOK_SECRET>`;

  return (
    <>
      <DashHeader
        title="Settings"
        subtitle="Environment, keys, and webhook configuration"
      />

      <div className="dash-content">
        <div className="dash-card">
          <h2 className="dash-card-title">Integrations status</h2>
          <p className="dash-card-sub">
            Environment variables wire up the live tracking pipeline. Missing
            any of these and the app falls back to demo data.
          </p>

          <div className="dash-status-list">
            <StatusRow
              label="Shippo API"
              value={hasShippo ? shippoMode : "SHIPPO_API_KEY missing"}
              ok={hasShippo}
              help="Get a key at apps.goshippo.com/settings/api. Test keys (shippo_test_…) are free and unlimited."
            />
            <StatusRow
              label="Neon Postgres"
              value={hasDb ? "Connected" : "DATABASE_URL missing"}
              ok={hasDb}
              help="Get a connection string at console.neon.tech. Free tier is 0.5 GB."
            />
            <StatusRow
              label="Webhook secret"
              value={hasWebhookSecret ? "Enabled" : "SHIPPO_WEBHOOK_SECRET missing"}
              ok={hasWebhookSecret}
              help="Long random string. Paste the same value into your Shippo webhook URL as ?token=… — we authenticate incoming webhooks with it."
            />
          </div>
        </div>

        <div className="dash-card">
          <h2 className="dash-card-title">Webhook endpoint</h2>
          <p className="dash-card-sub">
            Paste this URL into Shippo → Webhooks → Add webhook, and subscribe to
            <code> track_updated</code>. Shippo will push events as carriers scan
            packages, so the cache stays fresh without polling.
          </p>
          <div className="dash-copy-row">
            <code>{webhookUrl}</code>
            <button className="btn-ghost btn-sm">
              <Copy size={13} strokeWidth={1.5} /> Copy
            </button>
          </div>
        </div>

        <div className="dash-card">
          <h2 className="dash-card-title">Data & export</h2>
          <p className="dash-card-sub">
            USPS-S stores all shipment events in Neon. You own the data — export
            or delete any time.
          </p>
          <div className="dash-form-actions">
            <button className="btn-ghost btn-sm">Export as CSV</button>
            <button className="btn-ghost btn-sm">Export as JSON</button>
          </div>
        </div>

        <div className="dash-card dash-card-danger">
          <h2 className="dash-card-title">Danger zone</h2>
          <p className="dash-card-sub">
            Permanently remove all shipment and event records. This cannot be undone.
          </p>
          <div className="dash-form-actions">
            <button className="btn-ghost btn-sm dash-btn-danger">Delete all shipments</button>
          </div>
        </div>
      </div>
    </>
  );
}
