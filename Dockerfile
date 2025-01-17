# Use official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Ensure the docs directory exists before starting the app
RUN mkdir -p /app/src/docs

# Build the TypeScript application
RUN npm run build

# Change directory to `dist/src`
WORKDIR /app/dist/src

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["node", "main.js"]
