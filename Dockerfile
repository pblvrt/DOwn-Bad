FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Copy standalone server
COPY --from=builder /app/.next/standalone ./

# Copy static assets (these are NOT included in standalone by default)
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["node", "server.js"]
