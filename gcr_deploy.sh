#!/bin/bash
# bash script for adding environment variables to Google Cloud Run deploy command
# command is stored in deploy_log.sh for debugging purposes

input=".env.local"
result="gcloud run deploy --project cometplanning --image gcr.io/cometplanning/comet-data-service "
while IFS= read -r line
do
  result="$result --set-env-vars $line"
done < "$input"
printf "%s" "$result" > "deploy_log.sh"

gcloud builds submit --tag gcr.io/cometplanning/comet-data-service --project cometplanning
eval $result