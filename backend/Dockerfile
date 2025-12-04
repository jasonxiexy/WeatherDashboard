# backend/Dockerfile

# Use Debian-based Node image (Prisma-compatible)
FROM node:22-bullseye-slim

# Create app directory
WORKDIR /app

# Install dependencies (include devDeps so prisma CLI is available)
COPY package*.json ./
RUN npm install

# Copy Prisma schema & migrations
COPY prisma ./prisma

# Copy source files
COPY src ./src
COPY server.js ./

# Expose API port
EXPOSE 8080

# Environment
ENV NODE_ENV=production

# At container start:
# 1. Apply pending migrations (prod-style)
# 2. Generate Prisma Client
# 3. Start the server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node server.js"]
