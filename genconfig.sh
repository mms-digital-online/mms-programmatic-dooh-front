#!/bin/sh

envsubst < /usr/share/nginx/html/config.json > /usr/share/nginx/html/config.json.new
mv /usr/share/nginx/html/config.json.new /usr/share/nginx/html/config.json
