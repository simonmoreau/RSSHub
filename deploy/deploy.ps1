az group create --name RSSHub --location "francecentral"
az deployment group create --resource-group RSSHub --template-file azure-setup.bicep
az webapp config set --resource-group RSSHub --name wapp-rsshubx6ebf6c7sdxn2 --startup-file "package.json"


# az webapp deploy --resource-group RSSHub --name wapp-rsshubx6ebf6c7sdxn2 --src-path "C:\Users\smoreau\Github\Divers\RSSHub\RSSHub.zip"

# https://wapp-rsshubx6ebf6c7sdxn2.scm.azurewebsites.net/ZipDeployUI

