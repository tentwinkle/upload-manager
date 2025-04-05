# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Copy built files from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "build"]