# HypeEmUp Monorepo

HypeEmUp is a production-ready e-commerce and CMS platform for custom 3D-printed hype chains. The monorepo contains a Next.js storefront (static export for Bluehost) and an Express/Prisma API deployed to AWS behind Nginx + PM2.

## Repository Structure

```
hypeemup/
  apps/
    web/      # Next.js 14 App Router storefront and admin UI
    api/      # Express API with Prisma, Stripe, SES, S3
  packages/
    config/   # Shared ESLint, Prettier, tsconfig bases
  infra/     # Deployment configs (Nginx, PM2, scripts)
  templates/ # Email templates (chat escalation, order confirmation)
```

## Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+
- Stripe account (test + live keys)
- AWS (S3, SES, RDS) credentials

## Environment Variables

### Frontend (`apps/web/.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=https://api.hypeemup.com
NEXT_PUBLIC_ENV_MODE=test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### API (`apps/api/.env`)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASS@HOST:5432/hypeemup
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
AWS_REGION=us-east-1
S3_BUCKET_UPLOADS=hypeemup-uploads
SES_REGION=us-east-1
SES_FROM_EMAIL=no-reply@hypeemup.com
ESCALATION_TO_EMAIL=magnus@hypeemup.com
ESCALATION_CC_EMAIL=support@hypeemup.com
JWT_ACCESS_SECRET=change_me_to_32_chars_minimum
JWT_REFRESH_SECRET=change_me_to_32_chars_minimum
COOKIE_DOMAIN=.hypeemup.com
ALLOWED_ORIGINS=https://hypeemup.com,http://localhost:3000
RAG_TOP_K=6
```

## Installation

```bash
pnpm install
```

This installs dependencies for all workspaces.

## Local Development

### API

```bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

The API runs on `http://localhost:3000`. Stripe webhooks require exposing the endpoint with `stripe listen --forward-to localhost:3000/webhooks/stripe`.

### Web Storefront

```bash
cd apps/web
pnpm dev
```

The Next.js app runs on `http://localhost:3000`. Configure `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:3000` (or the tunnel URL) when developing locally alongside the API.

To build a static export for Bluehost:

```bash
pnpm build
```

The static output is emitted to `apps/web/out/` and can be uploaded via SFTP or the Bluehost file manager.

## Prisma

- Edit the schema at `apps/api/prisma/schema.prisma`.
- Generate the client: `pnpm prisma generate`.
- Run migrations:
  ```bash
  pnpm prisma migrate dev --name add_change
  pnpm prisma migrate deploy   # Production
  ```
- Seed data (admin/staff/customer users, sample products, pages):
  ```bash
  pnpm prisma db seed
  ```

## Testing

Run API unit tests with Vitest:

```bash
cd apps/api
pnpm test
```

This covers cart pricing validation and webhook handling (happy and fallback paths).

## Stripe Webhooks

1. Configure the webhook endpoint `https://api.hypeemup.com/webhooks/stripe` in the Stripe dashboard.
2. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
3. For local testing: `stripe listen --forward-to localhost:3000/webhooks/stripe`.

On `checkout.session.completed`, the API upserts the order, captures receipt URLs, and updates status to `paid`.

## Email (AWS SES)

1. Verify `hypeemup.com` in SES (domain verification + DKIM).
2. Add SPF (`v=spf1 include:amazonses.com ~all`) and DKIM TXT records.
3. In production, move the SES account out of the sandbox to send to unverified addresses.
4. Templates live in `templates/emails/`.

## S3 Signed Uploads

- Create the bucket `hypeemup-uploads` with CORS allowing `PUT` from `https://hypeemup.com`.
- Apply a bucket policy that permits `s3:PutObject` and `s3:GetObject` for the uploader IAM role.
- The API issues signed URLs via `POST /uploads/sign` (authenticated users only).

## AWS Deployment (API)

1. Provision an EC2 instance (Node 20, pnpm installed).
2. Clone the repo into `/var/www/hypeemup`.
3. Copy `apps/api/.env` with production secrets.
4. Install dependencies + build:
   ```bash
   pnpm install --frozen-lockfile
   pnpm --filter api build
   ```
5. Configure Nginx using `infra/nginx/api.hypeemup.com.conf` and request certificates with Certbot.
6. Start the API with PM2:
   ```bash
   pm2 start infra/pm2/ecosystem.config.cjs
   pm2 save
   ```
7. For deployments, run `infra/scripts/deploy-api.sh`.

## Bluehost Deployment (Web)

1. `cd apps/web && pnpm build` to generate `out/`.
2. Upload the contents of `out/` to the Bluehost hosting root (e.g., via SFTP or the File Manager).
3. Ensure `NEXT_PUBLIC_API_BASE_URL` points to `https://api.hypeemup.com` in production.

## Stripe Test vs Live

- Toggle `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` between `pk_test_` & `sk_test_` (test) and live keys when ready.
- Use environment-specific `.env` files to avoid mixing credentials.

## Admin Bootstrap

A default admin/staff/customer trio is seeded via `pnpm prisma db seed`. To promote another user:

```bash
pnpm prisma user.update --where email=\"you@hypeemup.com\" --data role=admin
```

## Chatbot + Admin Inbox

- `POST /chat/start` initializes a session (optionally tied to an authenticated user).
- Messages are classified with simple heuristics; low-confidence responses trigger an SES escalation using `templates/emails/hypeemup-chat-escalation.html`.
- Admins/staff can review and reply via `/admin/inbox` endpoints, which integrate with the floating widget on the storefront.

