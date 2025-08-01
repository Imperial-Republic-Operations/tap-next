# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat openssl

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG BUILD_VERSION=unknown

# Set environment variables for build
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_VERSION=$BUILD_VERSION

# Build Next.js application
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Build arguments passed to runtime
ARG NODE_ENV=production
ARG BUILD_VERSION=unknown

# Install runtime dependencies and tools
RUN apk add --no-cache \
    curl \
    openssl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy built application from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma files and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/package*.json ./

# Install Prisma CLI and tsx for database operations
RUN npm install prisma@latest tsx@latest --production=false

# Set proper ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_VERSION=$BUILD_VERSION
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Create startup script that works for both stage and production
RUN cat > /app/start.sh << 'EOF'
#!/bin/sh
set -e

echo "🚀 Starting TAP Next.js application..."
echo "📦 Build version: ${BUILD_VERSION}"
echo "🌍 Environment: ${NODE_ENV}"

# Database setup if DATABASE_URL is available
if [ -n "$DATABASE_URL" ]; then
    echo "🗃️ Setting up database..."
    
    # Run Prisma migrations
    echo "📋 Running database migrations..."
    npx prisma migrate deploy
    echo "✅ Migrations completed"
    
    # Generate Prisma client (in case schema changed at runtime)
    echo "🔄 Generating Prisma client..."
    npx prisma generate
    echo "✅ Prisma client generated"
    
    # Seed database if seed file exists
    if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
        echo "🌱 Seeding database..."
        npx prisma db seed || {
            echo "⚠️ Database seeding failed, but continuing..."
        }
    fi
else
    echo "⚠️ No DATABASE_URL found, skipping database setup"
fi

echo "🏃 Starting application on port ${PORT}..."
exec node server.js
EOF

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]