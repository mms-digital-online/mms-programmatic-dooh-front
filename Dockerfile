FROM node:14-alpine as builder

WORKDIR /usr/src/offliner-front
COPY . .
RUN set -eu; \
    apk add --no-cache git; \
    yarn; \
    API_ROOT='$API_ROOT' yarn build

FROM nginx
ENV API_ROOT https://api.offliner.bind.pw

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN set -eu; \
    rm /usr/share/nginx/html/index.html; \
    sed -i -e 's/^\s*worker_processes\s.*;/worker_processes auto;/g' /etc/nginx/nginx.conf; \
    sed -i -e 's/^\s*access_log\s.*;/access_log off;/g' /etc/nginx/nginx.conf; \
    sed -i -e '/^\s*http\s*{\s*$/a server_tokens off;' /etc/nginx/nginx.conf; \
    nginx -t

COPY --from=builder /usr/src/offliner-front/dist /usr/share/nginx/html
COPY genconfig.sh /docker-entrypoint.d/
