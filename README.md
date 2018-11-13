# ITNext Summit 2018 Demo

This is the source for the session I delivered at ITNext Summit in Amsterdam. https://www.itnextsummit.com/program-2018/


### Brigade Project Definition

Sample `brig-proj-itnext.yaml` needed for demo. Ensure this file does not end up in GitHub!

```
project: "repo/itnext-brigade"
repository: "github.com/repo/itnext-2018"
cloneURL: "https://github.com/repo/itnext-2018"
sharedSecret: "password-replace"
github:
    token: ""
secrets:
    acrServer: 
    acrName: 
    azServicePrincipal: 
    azClientSecret: 
    azTenant: 
    SLACK_WEBHOOK:
```

### Create AKS cluster
```
az aks create -g aks -c 2  -n brigade  -k 1.11.3
az aks get-credentials -g aks -n brigade
```

### Install Brigade

```
helm repo add brigade https://azure.github.io/brigade
helm upgrade --install brigade brigade/brigade --set rbac.enabled=true --set vacuum.enabled=false --set api.service.type=LoadBalancer
```

### Kashti
```
helm upgrade --install kashti https://raw.githubusercontent.com/ams0/itnext-brigade/master/helm/kashti/kashti-0.1.0.tgz  --set service.type=LoadBalancer
```

### Create Brigade project

### Create Github webhook
```
export GH_WEBHOOK=http://$(kubectl get svc brigade-brigade-github-gw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'):7744/events/github
#make sure you have a GITHUB_AUTH_TOKEN env ~~variable~~
jthooks add ams0/itnext-brigade $GH_WEBHOOK GithubSecret
```



### Useful links

[Brigade](https://brigade.sh/)
[Kashti](https://github.com/Azure/kashti)
[Brigadeterm](https://github.com/slok/brigadeterm/releases)
[jthooks](https://github.com/ceejbot/jthooks)

Heavily based on the great work from [chzbrgr71](https://github.com/chzbrgr71/kube-con-2018)