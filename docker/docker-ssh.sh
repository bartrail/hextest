#!/usr/bin/env bash

source docker.env

if [ ! -z "$1" ]; then
    USER=$1;
fi

docker exec -it -u $USER $CONTAINER_NAME bash