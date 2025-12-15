# Node.js versi LTS
FROM node:18-alpine

# working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy project
COPY . .

# Port
EXPOSE 3010

# Set environment
ENV NODE_ENV=production

# Command container
CMD ["node", "server.js"]
