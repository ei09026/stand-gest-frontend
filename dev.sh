#!/bin/bash
#npm install

VERSION=$(date +%s)

if [ -f "./src/.env.js.bak" ]
then
    rm ./src/.env.js
    mv ./src/.env.js.bak ./src/.env.js
fi

echo -e "\n\r\e[93mOn error(s) run npm install first.\n\r\e[39m"
find ./node_modules/.cache/babel-loader/* -mtime +20 -exec rm {} \;
gulp set-build-version --build $VERSION
gulp generate-external-assets
npm run dev
