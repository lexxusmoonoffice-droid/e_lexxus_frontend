# syntax=docker/dockerfile:1.6

# ── deps stage ───────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ── build stage ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Baked-in env values (override at `docker run` time if needed)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://localhost:5050/api
RUN npm run build

# ── runtime stage ────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN apk add --no-cache tini && addgroup -S lexx && adduser -S lexx -G lexx

COPY --from=build --chown=lexx:lexx /app/package.json ./package.json
COPY --from=build --chown=lexx:lexx /app/node_modules ./node_modules
COPY --from=build --chown=lexx:lexx /app/.next ./.next
COPY --from=build --chown=lexx:lexx /app/public ./public
COPY --from=build --chown=lexx:lexx /app/next.config.js ./next.config.js

USER lexx
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000 >/dev/null || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start"]
