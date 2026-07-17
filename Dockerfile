# ── STAGE 1: Build Aplikasi React dengan Node.js ──
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy seluruh source code dan lakukan build production
COPY . .
RUN npm run build

# ── STAGE 2: Serve dengan Nginx (Lightweight) ──
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Hapus config & aset default Nginx
RUN rm -rf ./*
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari STAGE 1
# Catatan: Jika kamu menggunakan Vite, folder hasilnya adalah '/dist'. 
# Jika menggunakan Create React App (CRA), ganti '/dist' menjadi '/build'.
COPY --from=build /app/dist .

# Buka port 80 di dalam container
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]