FROM nginxinc/nginx-unprivileged:alpine

# nginx.conf is a server block, so it replaces the default site config.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.inc /etc/nginx/conf.d/security-headers.inc
COPY site/ /usr/share/nginx/html/

EXPOSE 8080
USER 101
