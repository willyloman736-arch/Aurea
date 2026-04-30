import Image from "next/image";
import { ScrollReveal } from "./scroll-reveal";

export function DashboardPreview() {
  return (
    <section className="dash-preview-section" id="platform">
      <div className="container-aurea">
        <ScrollReveal className="section-head">
          <span className="eyebrow-inline">The operator console</span>
          <h2 className="section-title">
            Your operations,<br /><em>one glass panel.</em>
          </h2>
          <p className="section-sub">
            Every shipment in motion, every exception flagged, every event streamed
            live — on a single screen your team already knows how to use.
          </p>
        </ScrollReveal>

        <ScrollReveal className="dash-preview">
          {/* Browser chrome */}
          <div className="dp-chrome">
            <div className="dp-dots">
              <span /><span /><span />
            </div>
            <div className="dp-url">
              <span className="dp-url-lock">⌐</span>
              app.aurealogistics.com/dashboard
            </div>
            <div className="dp-chrome-spacer" />
          </div>

          {/* Dashboard body */}
          <div className="dp-body">
            {/* Sidebar */}
            <aside className="dp-side">
              <div className="dp-side-brand">
                <Image
                  src="/logo.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="dp-side-brand-mark"
                />
              </div>
              <div className="dp-side-nav">
                <div className="dp-side-item active">Overview</div>
                <div className="dp-side-item">Shipments</div>
                <div className="dp-side-item">Webhooks</div>
                <div className="dp-side-item">Settings</div>
              </div>
            </aside>

            {/* Main panel */}
            <main className="dp-main">
              <div className="dp-header">
                <div>
                  <div className="dp-h-title">Overview</div>
                  <div className="dp-h-sub">Operations at a glance</div>
                </div>
                <div className="dp-live">
                  <span className="dp-live-dot" />
                  Live · 12 events/min
                </div>
              </div>

              {/* Stat cards */}
              <div className="dp-stats">
                <div className="dp-stat">
                  <div className="dp-stat-label">Active</div>
                  <div className="dp-stat-num">8,429</div>
                  <div className="dp-stat-trend up">↑ 12%</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-label">Delivered today</div>
                  <div className="dp-stat-num">1,284</div>
                  <div className="dp-stat-trend up">↑ 8%</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-label">Exceptions</div>
                  <div className="dp-stat-num">14</div>
                  <div className="dp-stat-trend down">↓ 3%</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-label">API p99</div>
                  <div className="dp-stat-num">173<em>ms</em></div>
                  <div className="dp-stat-trend">stable</div>
                </div>
              </div>

              {/* Activity rows */}
              <div className="dp-table">
                <div className="dp-table-head">
                  <span>Tracking</span>
                  <span>Route</span>
                  <span>Status</span>
                  <span className="right">Updated</span>
                </div>
                <div className="dp-row">
                  <span className="mono">AUR-2847-JK3921</span>
                  <span>Singapore → Amsterdam</span>
                  <span><em className="dp-pill transit">In transit</em></span>
                  <span className="right">2m ago</span>
                </div>
                <div className="dp-row">
                  <span className="mono">AUR-9931-LM7740</span>
                  <span>Rotterdam → Berlin</span>
                  <span><em className="dp-pill delivery">Out for delivery</em></span>
                  <span className="right">4m ago</span>
                </div>
                <div className="dp-row">
                  <span className="mono">AUR-4421-KP8823</span>
                  <span>Tokyo → LA</span>
                  <span><em className="dp-pill transit">In transit</em></span>
                  <span className="right">6m ago</span>
                </div>
                <div className="dp-row">
                  <span className="mono">AUR-7765-QR2214</span>
                  <span>Dubai → London</span>
                  <span><em className="dp-pill delivered">Delivered</em></span>
                  <span className="right">11m ago</span>
                </div>
                <div className="dp-row">
                  <span className="mono">AUR-1198-MN5567</span>
                  <span>São Paulo → Madrid</span>
                  <span><em className="dp-pill exception">Exception</em></span>
                  <span className="right">14m ago</span>
                </div>
              </div>
            </main>
          </div>

          {/* Floating event toast */}
          <div className="dp-toast">
            <div className="dp-toast-dot" />
            <div>
              <strong>Event received</strong>
              <span>AUR-2847-JK3921 · Departed SIN</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
