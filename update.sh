#!/bin/sh

cd /var/www/home/group

git pull

yarn

docker-compose build
docker-compose down
docker-compose up -d
