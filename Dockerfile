# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json ./
# Install production dependencies
RUN yarn install --production --frozen-lockfile

# Copy the build output
COPY --from=build /app/build ./build

# Create uploads directory
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application - try different entry points
CMD ["node", "build"]