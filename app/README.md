##ACR build steps


ACR_NAME=theregistry

cd app/web
az acr build --registry $ACR_NAME  --image itnext/rating-web:v1 --build-arg IMAGE_TAG_REF=v1 --build-arg VCS_REF=`git rev-parse --short HEAD` --build-arg BUILD_DATE="`date -u +"%Y-%m-%dT%H%M%SZ"`" .

cd app/api
az acr build --registry $ACR_NAME --image itnext/rating-api:v1 .

