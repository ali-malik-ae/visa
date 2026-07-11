# Visati — Dubai Visas. Simplified.

UAE visa application platform: public marketing site + application flow, admin
dashboard for staff, Stripe checkout, Sanity-managed content.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Neon Postgres via Drizzle ORM
- **Auth**: BetterAuth (email/password, role-based: `consultant` / `admin`)
- **CMS**: Sanity (editorial content — visa descriptions, FAQs, homepage copy, blog)
- **Payments**: Stripe (hosted Checkout)
- **Email**: Resend
- **File storage**: Cloudflare R2 (applicant documents)
- **Deployment**: Docker (standalone output) → Dokploy on a VPS

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run db:push              # create tables from src/lib/db/schema.ts
npm run db:seed              # seed the visa-type catalog
npm run db:seed-admin -- <email> <password> "<name>"   # create the first admin
npm run dev
```

## Key architecture notes

- **Pricing source of truth**: `visa_types` in Postgres (what Stripe actually
  charges). Sanity's `visaTypeContent.price_aed`/`price_usd` is what's
  *displayed* on public pages — the two are independently editable, not
  auto-synced. Both are joined by `slug`, not by database id.
- **Currency display**: AED is always shown; an admin-controlled setting
  (`/admin/settings` → Currency Display, backed by the `site_settings` table)
  optionally shows an approximate USD figure alongside it. Checkout always
  charges AED regardless of this setting.
- **Admin auth**: `src/lib/admin-guard.ts` (`requireAdminSession`/
  `requireAdminRole`) gates every `/admin/*` page centrally via
  `src/app/(admin)/layout.tsx`; every `/api/admin/*` route calls
  `requireAdminApi()` independently. Staff use `@visati.ae` emails on signup
  and password-reset (see `src/lib/staff-email.ts`); the client's own
  non-`@visati.ae` account is allowlisted via `NEXT_PUBLIC_ADMIN_EMAIL`.
- **`NEXT_PUBLIC_APP_URL`** is baked into the build at compile time (Stripe
  redirect URLs, BetterAuth trusted origins, email links) — changing it after
  deploy requires a fresh build, not just an env var change.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:studio` | Drizzle Studio (DB browser) |
| `npm run db:seed` | Seed the visa-type catalog |
| `npm run db:seed-admin -- <email> <password> "<name>"` | Create an admin user |

## Deployment

Builds as a multi-stage Docker image (`Dockerfile`) with Next.js standalone
output. `.github/workflows/deploy.yml` builds and pushes to GHCR on every push
to `master`; Dokploy pulls the image and runs it behind Traefik, which
provisions its own Let's Encrypt certificate per domain.
