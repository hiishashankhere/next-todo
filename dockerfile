# =========================
# Builder Stage
# =========================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files explicitly to avoid glob issues
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy rest of the project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# =========================
# Runner / Production Stage
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production --frozen-lockfile

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
