#!/bin/bash

PROJECT="Backoffice.[PROJECT_NAME]"
VERSION=$(date +%s)

if [ -f "./package-lock.json" ]
then
    rm ./package-lock.json
fi

if [ -f "./src/.env.js.bak" ]
then
    rm ./src/.env.js
    mv ./src/.env.js.bak ./src/.env.js
fi

if [ -z "$*" ];
then
    echo -e "\n\r\e[93mMissing build environment!\n\r\e[39m"
    echo -e "\e[32mAvailable environments:\n\r\e[39m"

    for file in ./build/environments/.*.js;
    do
        IFS='.' eval 'array=($file##*)'

        echo ${array[3]}
    done

    exit;
fi

file=".env."
file+=$1
file+=.js

if [ -f "./build/environments/$file" ]
then
    echo -e "\n\r\e[32m$file configuration environment found.\n\r\e[39m"
    echo -e "\n\r\e[32mBuild started.\n\r\e[39m"
else
    echo -e "\n\r\e[93m$file configuration environment not found!.\n\r\e[39m"
    echo -e "\n\r\e[93mExecute ./build.sh to list available environments.\n\r\e[39m"
    echo -e "\n\r\e[93mBuild aborted!\n\r\e[39m"
    exit
fi

mv ./src/.env.js ./src/.env.js.bak
cp ./build/environments/"$file" ./src/.env.js

npm install
rm ./dist/app.external-assets.*
gulp set-build-version --build $VERSION
gulp generate-languages
gulp generate-external-assets

npm run build
gulp build-static-path

if [ -f "./build/environments/web.$1.config" ]
then
    yes | cp -i ./build/environments/web."$1".config ./dist/web.config
fi

if [ -f "./build/environments/company-logo.$1.png" ]
then
    yes | cp -i ./build/environments/company-logo."$1".png ./dist/static/assets/company-logo.png
fi

if [ -f "./build/environments/licensed-to-logo.$1.png" ]
then
    yes | cp -i ./build/environments/licensed-to-logo."$1".png ./dist/static/assets/licensed-to-logo.png
fi

yes | cp -i ./favicon.ico ./dist
rm ./src/.env.js
mv ./src/.env.js.bak ./src/.env.js

# Remove temporary files
rm -r dist/*.tar

cd  dist
#tar -cvf "Idt.$PROJECT.$(date '+%Y.%m.%d.%H%M%S').tar" .
tar -cvf "Idt.$PROJECT.$VERSION.tar" .
cd ..
