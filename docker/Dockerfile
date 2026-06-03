# Build context is the ./login folder:
#   docker build -f docker/Dockerfile -t zitadel-login-ui ./login

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Placeholder values so the configuration schema passes at build time.
# Real values are provided at runtime via environment variables.
ENV SERVER=docker \
    APP_URL=http://localhost:3333 \
    ZITADEL_URL=http://zitadel:8080 \
    ZITADEL_SERVICE_USER_ID=build \
    ZITADEL_SERVICE_USER_TOKEN=build
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3333 \
    HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/locales ./locales
COPY --from=builder /app/i18n.js ./i18n.js
EXPOSE 3333
CMD ["node", "server.js"]
