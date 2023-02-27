az group create --name RSSHub --location "francecentral"
az deployment group create --resource-group RSSHub --template-file azure-setup.bicep