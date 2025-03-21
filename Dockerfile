# Multi-stage build for PayPal MCP Server

# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/build ./build

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001 -G nodejs

# Set ownership
RUN chown -R mcp:nodejs /app

# Switch to non-root user
USER mcp

# Set executable permissions
RUN chmod +x /app/build/index.js

# Expose port if needed (for health checks, etc.)
# EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["node", "build/index.js"]
