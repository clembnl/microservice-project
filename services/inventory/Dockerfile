# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Install production dependencies
RUN npm install --only=production

# Expose port
EXPOSE 3003

# Start the application
CMD ["node", "dist/index.js"]