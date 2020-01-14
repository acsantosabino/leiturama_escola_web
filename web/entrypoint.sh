#!/bin/sh -l
cd /home/node/app

if [ "$1" = 'install' ]
then
    echo "Install"
elif [ "$1" = 'build' ]
then
    echo "Build"
    npm run build --if-present
elif [ "$1" = 'test' ]
then
    echo "Test"
    CI=true npm test
else
    echo "Start"
    npm start
fi
