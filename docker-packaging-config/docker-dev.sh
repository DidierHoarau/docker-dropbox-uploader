#!/bin/bash

set -e

mkdir -p ./tmp/files/project1
mkdir -p ./tmp/files/project2
mkdir -p ./tmp/files/project3


npm run packaging:prepare
npm run packaging:image-build dev
npm run packaging:image-push dev
npm run packaging:service-deploy dev

sleep 15

DEV_CONTAINER=$(docker ps | grep docker-dropbox-uploader_app | cut -d" " -f1)
echo $DEV_CONTAINER
docker exec -ti $DEV_CONTAINER /opt/app/docker-dev-exec.sh
