#!/bin/sh

git pull

yarn

docker-compose build
docker-compose down
docker-compose up -d
