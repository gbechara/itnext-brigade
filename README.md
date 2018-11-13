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
    OWNER: 
    CONSUMER_KEY: 
    CONSUMER_SECRET: 
    ACCESS_TOKEN: 
    ACCESS_SECRET: 
```

### Useful links

[Kashti](https://github.com/Azure/kashti)
[Brigadeterm](https://github.com/slok/brigadeterm/releases)


Heavily based on the great work from [chzbrgr71](https://github.com/chzbrgr71/kube-con-2018)