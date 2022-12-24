#!/bin/sh

# first param is tg bot token
# second param is webhook path

token=$1
basePath="https://api.telegram.org/bot"
apiPath="/setWebhook"
webhookPath=$2
param="?url="
secretToken=$3
param2="?secret_token="

postUrl="$basePath$token$apiPath$param$webhookPath$param2$secretToken"
echo "calling $postUrl..."
echo
curl -X POST "$postUrl"
echo
curl "$basePath$token/getWebhookInfo"
