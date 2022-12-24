#!/bin/sh

# first param is tg bot token
# second param is webhook path

token=$1
basePath="https://api.telegram.org/bot"
apiPath="/setWebhook"
webhookPath=$2
param="?url="

postUrl="$basePath$token$apiPath$param$webhookPath"
curl -X POST "$postUrl"
echo
echo "$postUrl"