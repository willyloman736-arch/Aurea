import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy · USPS-S",
  description: "How USPS-S handles personal data, in plain language.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal · Privacy"
      title={
        <>
          Privacy, <em>plainly stated.</em>
        </>
      }
      lede="What we collect, why, where it lives, and what you can do about it. Last updated April 2026."
    >
      <div className="page-callout">
        <strong>The short version:</strong> We collect what we need to move your
        cargo and tell your recipient where it is. We don&rsquo;t sell your data.
        We don&rsquo;t train models on it. EU customers&rsquo; data stays in the EU.
      </div>

      <article className="page-section">
        <h2>What we collect</h2>
        <p>
          When you book a shipment, we collect the sender and recipient&rsquo;s name,
          email, phone, and address; the package description and value; and any
          internal notes you choose to add. When you visit our website we collect
          standard request logs (IP, user agent, page) for thirty days for security
          and debugging.
        </p>
      </article>

      <article className="page-section">
        <h2>Why we collect it</h2>
        <ul>
          <li>To move your cargo and prove it was delivered</li>
          <li>To notify recipients of pickup, transit, and delivery events</li>
          <li>To handle customs declarations on international shipments</li>
          <li>To investigate claims, lost cargo, or disputes</li>
          <li>To bill you and meet our tax obligations</li>
        </ul>
      </article>

      <article className="page-section">
        <h2>Where it lives</h2>
        <p>
          Production data lives in encrypted databases in the region of the
          shipment&rsquo;s origin. EU shipments stay in Frankfurt or Dublin and never
          leave the EU. US shipments live in Virginia. APAC shipments live in
          Singapore. Backups are encrypted at rest with AES-256 and stored in the
          same region.
        </p>
      </article>

      <article className="page-section">
        <h2>Who sees it</h2>
        <p>
          USPS-S staff who need it to do their jobs (couriers see destination
          addresses, finance sees billing). Last-mile carriers see the recipient
          name and address only. Customs brokers see what the destination customs
          authority requires. We don&rsquo;t share, sell, or rent your data to
          anyone else.
        </p>
      </article>

      <article className="page-section">
        <h2>What you can do</h2>
        <ul>
          <li>
            <strong>Access</strong> — request everything we have on you
          </li>
          <li>
            <strong>Correct</strong> — fix anything that&rsquo;s wrong
          </li>
          <li>
            <strong>Delete</strong> — close your account and remove personal data
            (we keep shipment records as long as legally required for tax/customs)
          </li>
          <li>
            <strong>Export</strong> — get a JSON dump of your account data
          </li>
        </ul>
        <p>
          Email <Link href="mailto:privacy@usps-s.com">privacy@usps-s.com</Link>{" "}
          — replies within fourteen days, usually faster.
        </p>
      </article>

      <article className="page-section">
        <h2>Cookies</h2>
        <p>
          The marketing site uses essential cookies for session and preference
          management. We don&rsquo;t use third-party advertising trackers. The
          dashboard uses an authentication session cookie that lasts thirty days.
        </p>
      </article>

      <article className="page-section">
        <h2>Changes</h2>
        <p>
          When this policy changes materially, we email everyone with an active
          account thirty days in advance. Minor wording fixes happen without
          notice but show up in the changelog.
        </p>
      </article>
    </PageShell>
  );
}
