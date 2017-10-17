# Docker-Dropbox-Uploader

Docker-Dropbox-Uploader is container that automatically scan for the content of a folder and upload the content to your Dropbox.

_Note:_ Files are uploaded and remove from local storage.

## Setup

Before using this project you have to customize 2 files:
* src/config/config-defaullt.json: You have to put your Dropbox token here. Other variables can also be customized
* docker-packaging-config/docker-compose.yml: You have to customize the volume in this file

## How to run it?

This repo has been packaged with [https://github.com/DidierHoarau/docker-packaging] so to run it you have to execute...

For Docker Engine:
* Create the Docker network webproxy-network
* npm run packaging:prepare
* npm run packaging:image-build
* npm run packaging:service-run

For Docker Swarm:
* Set the environment variable DOCKER_REGISTRY
* Create the Docker network webproxy-network
* npm run packaging:prepare
* npm run packaging:image-build swarm
* npm run packaging:image-push swarm
* npm run packaging:service-deploy swarm
