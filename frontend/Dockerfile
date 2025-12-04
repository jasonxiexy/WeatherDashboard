# frontend/Dockerfile

##############################
# 1 — Build stage (Vite)
##############################
FROM node:22-bullseye-slim AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# API base URL (can be overridden in docker-compose)
ARG API_BASE_URL=http://localhost:8080
ENV API_BASE_URL=${API_BASE_URL}

# Build the app
RUN npm run build


##############################
# 2 — Run stage (Nginx)
##############################
FROM nginx:1.27-alpine

# Copy built files into nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
