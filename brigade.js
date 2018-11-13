const { events, Job, Group } = require('brigadier')

events.on("push", (brigadeEvent, project) => {
    //variables
    var acrServer = project.secrets.acrServer
    var acrName = project.secrets.acrName
    var azServicePrincipal = project.secrets.azServicePrincipal
    var azClientSecret = project.secrets.azClientSecret
    var azTenant = project.secrets.azTenant
    var gitPayload = JSON.parse(brigadeEvent.payload)
    var today = new Date()
    var image = "itnext/rating-web"
    var gitSHA = brigadeEvent.revision.commit.substr(0,7)
    var imageTag = "master-" + String(gitSHA)
    var acrImage = image + ":" + imageTag

    console.log("started")

    var acr = new Job("job-runner-acr-builder")
    acr.storage.enabled = false
    acr.image = "theregistry.azurecr.io/tools/az-cli-kubectl-helm:latest"
    acr.tasks = [
        `cd /src/app/web`,
        `az login --service-principal -u ${azServicePrincipal} -p ${azClientSecret} --tenant ${azTenant}`,
        `az acr build -t ${acrImage} --build-arg BUILD_DATE="${String(today)}" --build-arg VCS_REF=${gitSHA} --build-arg IMAGE_TAG_REF=${imageTag} -f ./Dockerfile --context . -r ${acrName}`
    ]

    var helm = new Job("job-runner-helm")
    helm.storage.enabled = false
    helm.image = "theregistry.azurecr.io/tools/az-cli-kubectl-helm:latest"
    helm.tasks = [
        `helm upgrade --install --reuse-values heroes  ./helm/itnext-heroes  --set ratingweb.image.tag=${imageTag}`
    ]

    var pipeline = new Group()
    pipeline.add(acr)
    pipeline.add(helm)
    pipeline.runEach()

})

events.on("after", (event, project) => {

    var slack = new Job("slack-notify", "technosophos/slack-notify:latest", ["/slack-notify"])
    slack.env = {
      SLACK_WEBHOOK: project.secrets.SLACK_WEBHOOK,
      SLACK_USERNAME: "Brigade",
      SLACK_TITLE: "Hello from Brigade",
      SLACK_MESSAGE: "This is a message from Brigade"
   }
    slack.run()
  }
)