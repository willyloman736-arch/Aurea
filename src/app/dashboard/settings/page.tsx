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
  const hasEasyPost = !!process.env.EASYPOST_API_KEY;
  const easyPostMode = process.env.EASYPOST_API_KEY?.startsWith("EZTK")
    ? "Test mode"
    : process.env.EASYPOST_API_KEY?.startsWith("EZAK")
      ? "Production mode"
      : "—";
  const hasDb = !!process.env.DATABASE_URL;
  const hasWebhookSecret = !!process.env.EASYPOST_WEBHOOK_SECRET;

  const webhookUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/webhooks/easypost`
      : "https://your-domain.com/api/webhooks/easypost";

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
              label="EasyPost API"
              value={hasEasyPost ? easyPostMode : "EASYPOST_API_KEY missing"}
              ok={hasEasyPost}
              help="Get a key at easypost.com → API Keys. Test keys (EZTK…) are free and unlimited."
            />
            <StatusRow
              label="Neon Postgres"
              value={hasDb ? "Connected" : "DATABASE_URL missing"}
              ok={hasDb}
              help="Get a connection string at console.neon.tech. Free tier is 0.5 GB."
            />
            <StatusRow
              label="Webhook signing"
              value={hasWebhookSecret ? "Enabled" : "EASYPOST_WEBHOOK_SECRET missing"}
              ok={hasWebhookSecret}
              help="Optional but recommended. Any random string — paste the same value into EasyPost webhook config."
            />
          </div>
        </div>

        <div className="dash-card">
          <h2 className="dash-card-title">Webhook endpoint</h2>
          <p className="dash-card-sub">
            Paste this URL into EasyPost → Webhooks → Add webhook, and select
            <code> tracker.updated</code>. EasyPost will push events as carriers
            scan packages, so the cache stays fresh without polling.
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
            Aurea stores all shipment events in Neon. You own the data — export
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
