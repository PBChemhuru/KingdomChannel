# STEP 1: Build Angular app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy source code into container
COPY . .

# Build the app in production mode
RUN npm run build -- --configuration=production

# STEP 2: Serve app with nginx
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output from step 1 to nginx folder
COPY --from=build /app/dist/kingdom-channel/browser /usr/share/nginx/html

# Expose port 80 to be accessible outside
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
