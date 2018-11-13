# ITNext Summit 2018 Demo

This is the source for the session I delivered at ITNext Summit in Amsterdam. <https://www.itnextsummit.com/program-2018/>

## Demo time

### Brigade Project Definition

Sample `brig-proj-itnext.yaml` needed for demo. Ensure this file does not end up in GitHub!

```yaml
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

```bash
az aks create -g aks -c 2  -n brigade  -k 1.11.3
az aks get-credentials -g aks -n brigade
#Helm one liner 
kubectl create serviceaccount -n kube-system tiller; kubectl create clusterrolebinding tiller --clusterrole=cluster-admin --serviceaccount=kube-system:tiller; helm init --service-account tiller
```

### Install Brigade

```bash
helm repo add brigade https://azure.github.io/brigade
helm upgrade --install brigade brigade/brigade --set rbac.enabled=true --set vacuum.enabled=false --set api.service.type=LoadBalancer
# workaround for RBAC
kubectl create clusterrolebinding brigade-worker --clusterrole=cluster-admin --serviceaccount=default:brigade-worker
```

### Kashti

```bash
    helm upgrade --install kashti \
    https://raw.githubusercontent.com/ams0/itnext-brigade/master/helm/kashti/kashti-0.1.0.tgz \
    --set service.type=LoadBalancer \
    --set brigade.apiServer=http://brigade-brigade-api:7745
```

### Create Brigade project

```bash
helm upgrade --install  itnext-brigade brigade/brigade-project -f brig-proj-itnext.yaml
```

### Create Github webhook

```bash
export GH_WEBHOOK=http://$(kubectl get svc brigade-brigade-github-gw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'):7744/events/github
#make sure you have a GITHUB_AUTH_TOKEN env ~~variable~~
jthooks add ams0/itnext-brigade $GH_WEBHOOK GithubSecret
```

### Clean up jobs and workers

```bash
kubectl delete po -l component=job ; kubectl delete po -l component=build
```

### Draft

Avoid the [fear of empty source file](https://ayende.com/blog/184993-A/the-fear-of-an-empty-source-file) with [Draft](https://draft.sh/)

```bash
draft init
draft pack-repo add https://github.com/technosophos/draft-brigade
draft create -p brigade-gateway
draft config set registry theregistry.azurecr.io
draft up
```

### Demo flow

- [ ] Explain why in-cluster pipelines
- [ ] Use helm to deply brigade and kashti
- [ ] Update github webook
- [ ] Explain brigade.js steps
- [ ] Push changes
- [ ] Observe with `watch kubectl get pods`
- [ ] Observe with kashti
- [ ] Observe with `brigadeterm`
- [ ] Clean up
- [ ] Show the voting site, change the color, push
- [ ] Observe the change

### Useful links

[Brigade](https://brigade.sh/)
[Kashti](https://github.com/Azure/kashti)
[Brigadeterm](https://github.com/slok/brigadeterm/releases)
[jthooks](https://github.com/ceejbot/jthooks)
[Build a brigade gateway in 5 minutes](http://technosophos.com/2018/04/23/building-brigade-gateways-the-easy-way.html)

Heavily based on the great work from [chzbrgr71](https://github.com/chzbrgr71/kube-con-2018)
