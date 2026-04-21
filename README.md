# Aurea

Premium global shipment tracking. Marketing site + public tracking lookup + (coming) customer dashboard.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS 4** + hand-tuned editorial design system
- **Inter** + **Instrument Serif** (Google Fonts via `next/font`)
- **Lucide React** for icons
- Deploy: **Vercel** · Domain: Hostinger DNS

## Roadmap

| Phase | Status | Scope |
|---|---|---|
| 1 | ✅ | Landing + tracking lookup with demo data |
| 2 | ⬜ | Real carrier tracking via **EasyPost**, **Neon Postgres** + Prisma |
| 3 | ⬜ | **Clerk** auth + customer dashboard |
| 4 | ⬜ | GitHub → Vercel deploy · Hostinger DNS wired |

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try these tracking numbers:

- `AUR-2847-JK3921` — in transit, Singapore → Amsterdam
- `AUR-9931-LM7740` — out for delivery, Rotterdam → Berlin

## Structure

```
src/
├── app/
│   ├── page.tsx                  Landing page (server)
│   ├── track/[id]/page.tsx       Public tracking detail (server)
│   ├── track/[id]/not-found.tsx  404 for unknown IDs
│   ├── layout.tsx                Fonts + metadata
│   └── globals.css               Design system
├── components/
│   ├── ambient.tsx               Animated bg blobs
│   ├── nav.tsx                   Sticky glass nav
│   ├── hero.tsx                  Video hero
│   ├── tracking-form.tsx  [client]  Input with tabs + demo chips
│   ├── tracking-result.tsx       Full result view
│   ├── metrics.tsx               Stats strip
│   ├── counter.tsx        [client]  Animated count-up
│   ├── network.tsx               4 feature tiles
│   ├── quote.tsx                 Editorial quote
│   ├── cta.tsx                   Final CTA shell
│   ├── footer.tsx                Multi-column footer
│   └── scroll-reveal.tsx  [client]  IO-based reveal wrapper
├── content/shipments.ts          Demo shipments (replaced in Phase 2)
├── lib/types.ts                  Shipment / Event types
└── lib/utils.ts                  cn() + helpers
```

## Environment

Phase 2 will need `.env.local` — see `.env.example`.

## Build

```bash
npm run build
npm run start
npm run lint
```

## Deploy

```bash
git push origin main
```

Vercel auto-deploys. Connect `aurea.yourdomain.com` via Hostinger DNS → CNAME to `cname.vercel-dns.com`.
