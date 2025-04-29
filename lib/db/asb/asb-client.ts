import { ContainerClient } from "@azure/storage-blob";
import { createContainerSas } from "./asb-servererer";

async function listBlobs(sasToken: string): Promise<void> {
  // Get environment variables
  const accountName: string | undefined =
    process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const containerName: string | undefined =
    process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;

  // Create Url
  // SAS token is the query string with typical `?` delimiter
  const sasUrl: string = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
  console.log(`\nContainerUrl = ${sasUrl}\n`);

  // Create container client from SAS token url
  const containerClient: ContainerClient = new ContainerClient(sasUrl);

  let i: number = 1;

  // List blobs in container
  for await (const blob of containerClient.listBlobsFlat()) {
    console.log(`Blob ${i++}: ${blob.name}`);
  }
}

const sasToken = await createContainerSas();
console.log(`SAS Token: ${sasToken}`);
await listBlobs(sasToken);
console.log("Done");
