# Base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (for production, adjust if needed)
RUN npm install --production

# Copy rest of the app
COPY . .

# Build the app (if necessary)
RUN npm run build

# Expose the port the app runs on (default for most Node.js apps)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
