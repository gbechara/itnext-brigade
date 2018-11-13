# Azure Blackbelt voting app demo Helm chart (experimental)

Make sure you have your environment variables set

```
helm upgrade --install heroes . \
  --set registry.server=$ACR_NAME \
  --set registry.clientId=$ACR_USERNAME \
  --set registry.clientSecret=$ACR_PASSWORD \
  --set cosmosdb.database.uri=$MONGODB_URI \
  --set serviceweb.annotations".service\.beta\.kubernetes\.io/azure-dns-label-name"=hero \
  --set ratingweb.image.tag=v6
  ```


```
helm upgrade --install heroes .  --reuse-values   --set ratingweb.image.tag=v7
```
