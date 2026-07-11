# syntax=docker/dockerfile:1
ARG NODE_VERSION=22-slim

# ── deps ─────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# --legacy-peer-deps: sanity@3.x vs next-sanity@13's sanity@5/6 peer requirement
# is a pre-existing conflict that plain `npm install` already tolerates locally
# (npm ci is stricter and errors on it without this flag).
RUN npm ci --no-audit --no-fund --legacy-peer-deps

# ── builder ───────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# DOCKER_BUILD=1 → next.config.ts emits output: 'standalone'
ENV NODE_ENV=production DOCKER_BUILD=1

# NEXT_PUBLIC_* vars are inlined into the client bundle at BUILD TIME.
# Server-only secrets (DATABASE_URL, STRIPE_SECRET_KEY, etc.) are NOT here;
# they're set in Dokploy's env panel at runtime — never baked into the image.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET

RUN npm run build

# ── runner ────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

# HOSTNAME=0.0.0.0 makes node server.js bind outside the container
# (it defaults to localhost, which refuses external connections).
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
