#!/usr/bin/env bash

source docker.env

##Update Apache UID
uid=$(id -u)
#if [ $uid -gt 100000 ]; then
	#uid=1000
#fi

sed "s/\$USER_ID/$uid/g" ./node/Dockerfile.dist > ./node/Dockerfile

##build and launch containers
docker-compose build
docker-compose up -d

##setup ssh in container
docker cp --follow-link ~/.ssh/id_rsa $CONTAINER_NAME:$DIR/.ssh/id_rsa
docker cp --follow-link ~/.ssh/known_hosts $CONTAINER_NAME:$DIR/.ssh/known_hosts
docker exec -it -u root $CONTAINER_NAME chown -R $USER $DIR/docker/data
docker exec -it -u root $CONTAINER_NAME chown -R $USER $DIR/docker/data/.bash_history
docker exec -it -u root $CONTAINER_NAME chown -R $USER $DIR/.ssh

if [ $1 == "install" ]; then
    docker exec -it -u $USER $CONTAINER_NAME npm install
    docker exec -it -u $USER $CONTAINER_NAME_CAMERA npm install
fi

docker exec -it -u $USER $CONTAINER_NAME bash

#tear down everything on logout
docker-compose stop
docker-compose stop
docker stop $(docker ps -a -q)
docker rm -v $(docker ps -a -q)