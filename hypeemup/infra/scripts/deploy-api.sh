#!/usr/bin/env bash
set -euo pipefail

REPO_DIR=/var/www/hypeemup
cd "$REPO_DIR"

echo "Pulling latest changes..."
git pull --ff-only

cd apps/api

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Running prisma migrate..."
pnpm prisma migrate deploy

echo "Building API..."
pnpm build

echo "Restarting PM2..."
pm2 reload /var/www/hypeemup/infra/pm2/ecosystem.config.cjs --only hypeemup-api

echo "Deployment complete."
