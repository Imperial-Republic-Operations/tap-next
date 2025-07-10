FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for staging
ARG NODE_ENV=development
ARG BUILD_VERSION=unknown
ARG DEBUG_MODE=true

# Set environment variables for build
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_VERSION=$BUILD_VERSION

# Generate Prisma client
RUN npx prisma generate

# Build Next.js application
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner

# Install debugging tools for staging
RUN apk add --no-cache \
    curl \
    htop \
    netcat-openbsd \
    procps \
    strace \
    openssl

WORKDIR /app

# Build arguments
ARG NODE_ENV=development
ARG DEBUG_MODE=true

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
ENV DEBUG_MODE=$DEBUG_MODE
ENV LOG_LEVEL=debug
ENV ENABLE_PROFILING=true

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy package.json for Prisma CLI access
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Install only Prisma CLI for migrations (staging needs this)
RUN npm install prisma --production=false

# Create directories and set permissions
RUN mkdir -p /app/logs /app/tmp && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Expose debugging port for Node.js inspector (staging only)
EXPOSE 9229

# Health check with more verbose output for staging
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=5 \
  CMD curl -f http://localhost:3000/api/health || curl -f http://localhost:3000/ || exit 1

# Create startup script for staging with Prisma migrations
RUN cat > /app/start-staging.sh << 'EOF'
#!/bin/sh
set -e

echo "🚀 Starting Next.js application in staging mode..."
echo "📦 Build version: $BUILD_VERSION"
echo "🐛 Debug mode: $DEBUG_MODE"
echo "📊 Log level: $LOG_LEVEL"

# Check if database is available
echo "🔍 Checking database connection..."
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Database URL configured"

    # Run Prisma migrations for staging
    echo "🗃️ Running Prisma migrations..."
    npx prisma migrate deploy || {
        echo "❌ Migration failed, but continuing (staging allows this)..."
    }

    # Generate Prisma client (in case schema changed)
    echo "🔄 Generating Prisma client..."
    npx prisma generate || {
        echo "❌ Prisma generate failed, but continuing..."
    }

    # Seed database if needed (staging only)
    if [ -f "prisma/seed.js" ] || [ -f "prisma/seed.ts" ]; then
        echo "🌱 Seeding database for staging..."
        npx prisma db seed || {
            echo "⚠️ Database seeding failed, but continuing..."
        }
    fi
else
    echo "⚠️ No DATABASE_URL found, skipping database setup"
fi

# Start the application
if [ "$DEBUG_MODE" = "true" ]; then
    echo "🐛 Starting with Node.js inspector enabled on port 9229..."
    exec node --inspect=0.0.0.0:9229 server.js
else
    echo "🏃 Starting application..."
    exec node server.js
fi
EOF

RUN chmod +x /app/start-staging.sh

# Start with our custom staging script
CMD ["/app/start-staging.sh"]