FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    nginx git curl libpng-dev libxml2-dev zip unzip \
    oniguruma-dev libzip-dev mysql-client supervisor

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .
RUN composer install --optimize-autoloader --no-dev

COPY ./docker/nginx.conf /etc/nginx/http.d/default.conf
COPY ./docker/supervisord.conf /etc/supervisord.conf

RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 10000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
