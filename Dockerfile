# ── STAGE 1: Build Frontend Assets (Vite + React) ──
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# ── STAGE 2: Install Composer Dependencies ──
FROM composer:2 AS composer-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

# ── STAGE 3: Production Runtime (PHP 8.2-FPM + Nginx + SQLite) ──
FROM php:8.2-fpm-alpine AS production

# Install system dependencies (Nginx, Supervisor, SQLite, ICU, Zip)
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    sqlite \
    sqlite-dev \
    libzip-dev \
    icu-dev

# Install required PHP extensions
RUN docker-php-ext-install pdo_sqlite pcntl opcache zip intl

# Configure PHP for production
RUN { \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.interned_strings_buffer=8'; \
        echo 'opcache.max_accelerated_files=4000'; \
        echo 'opcache.revalidate_freq=0'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.fast_shutdown=1'; \
        echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini && \
    { \
        echo 'upload_max_filesize=25M'; \
        echo 'post_max_size=25M'; \
        echo 'memory_limit=256M'; \
    } > /usr/local/etc/php/conf.d/custom.ini

# Configure Nginx & Supervisord
RUN mkdir -p /etc/nginx/http.d /etc/nginx/conf.d /run/nginx
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

# Set workdir
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html

# Copy compiled vendor and frontend assets from previous stages
COPY --from=composer-builder /app/vendor /var/www/html/vendor
COPY --from=node-builder /app/public/build /var/www/html/public/build

# Setup entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Fix ownership
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]