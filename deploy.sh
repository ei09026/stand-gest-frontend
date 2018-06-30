#!/bin/bash

CONFIG_FILE="deploy.default.cfg"

function read-config(){
    if ! [ -f "./build/environments/$CONFIG_FILE" ]; then
		echo "Missing configuration file! Aborting."
		exit
	fi

	echo "Reading configuration..."
	source ./build/environments/$CONFIG_FILE

	if [ -z "$API_KEY" ]; then
		echo "Missing API_KEY setting. Aborting"
		exit
	else
        echo "APY_KEY: $API_KEY"
    fi
	if [ -z "$OCTOPUS_SERVER" ]; then
		echo "Missing OCTOPUS_SERVER setting. Aborting"
		exit
	else
        echo "OCTOPUS_SERVER: $OCTOPUS_SERVER"
    fi
	if [ -z "$OCTOPUS_NUGET_SERVER" ]; then
		echo "Missing OCTOPUS_NUGET_SERVER setting. Aborting"
		exit
	else
        echo "OCTOPUS_NUGET_SERVER: $OCTOPUS_NUGET_SERVER"
	fi
	if [ -z "$PROJECT" ]; then
		echo "Missing PROJECT setting. Aborting"
		exit
	else
        echo "PROJECT: $PROJECT"
	fi
	if [ -z "$DEPLOY_TO" ]; then
		echo "Missing DEPLOY_TO setting. Aborting"
		exit
	else
        echo "DEPLOY_TO: $DEPLOY_TO"
	fi
}

if ! [ -z "$*" ];
then
    # read specific config
    CONFIG_FILE=deploy.$1.cfg
fi

read-config

# cd  dist
# tar -cvf "Idt.$PROJECT.$(date '+%Y.%m.%d.%H%M%S').tar" .

# cd ..
# Push application to OctopusServer 
c:\\Octo.exe push --package dist/*.tar --apiKey $API_KEY --server $OCTOPUS_SERVER

# Deploy the new release to OctopusServer 
c:\\Octo.exe deploy-release --project $PROJECT --version latest --deployto $DEPLOY_TO --server $OCTOPUS_SERVER --apiKey $API_KEY

# Remove temporary files
rm -r dist/*.tar
