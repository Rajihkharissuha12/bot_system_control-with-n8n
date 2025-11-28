# Gunakan Node.js versi LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh project
COPY . .

# Expose port 3010
EXPOSE 3010

# Command saat container dijalankan
CMD ["npm", "start"]
