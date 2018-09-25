FROM nginx:1.15-alpine
VOLUME /tmp
ADD ./ /usr/share/nginx/html
EXPOSE 80