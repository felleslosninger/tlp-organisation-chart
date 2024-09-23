# Node image
FROM node:20

# Install git
RUN apt-get update && apt-get install -y git

# Create folder and access
RUN mkdir -p /app && chown -R node:node /app

# Set working directory
WORKDIR /app

# Install PNPM
RUN npm install -g pnpm

# Install ROLLUP
RUN npm install -g rollup

# Set active user
USER node

# Copy files
COPY --chown=node:node . .

# Install and build
RUN pnpm install

# Build chart
RUN pnpm build:chart

# Launch app
CMD [ "pnpm", "start:react" ]
