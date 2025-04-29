import {
  BlobServiceClient,
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

// Server creates User Delegation SAS Token for container
export async function createContainerSas() {
  // Get environment variables
  const accountName = process.env.AZURE_USERNAME;
  const containerName = process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;
  console.log(`accountName = ${accountName}, containerName = ${containerName}`);
  console.log("Creating SAS Token...");

  if (!accountName || !containerName) {
    console.error(
      "AZURE_USERNAME and AZURE_STORAGE_BLOB_CONTAINER_NAME environment variables must be set."
    );
    throw new Error(
      "AZURE_USERNAME and AZURE_STORAGE_BLOB_CONTAINER_NAME environment variables must be set."
    );
  }

  // Best practice: create time limits
  const TEN_MINUTES = 10 * 60 * 1000;
  const NOW = new Date();

  // Best practice: set start time a little before current time to
  // make sure any clock issues are avoided
  const TEN_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TEN_MINUTES);
  const TEN_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + TEN_MINUTES);

  const accountKey = process.env.ACCOUNT_KEY;

  if (!accountKey) {
    console.error(
      "Azure Storage account key must be set in environment variables."
    );
    throw new Error(
      "Azure Storage account key must be set in environment variables."
    );
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  // Best practice: use managed identity - DefaultAzureCredential (alternative to SharedKey)
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  console.log(
    `BlobServiceClient created with accountName: ${accountName}, containerName: ${containerName}`
  );
  // Best practice: delegation key is time-limited
  // When using a user delegation key, container must already exist
  const userDelegationKey = await blobServiceClient.getUserDelegationKey(
    TEN_MINUTES_BEFORE_NOW,
    TEN_MINUTES_AFTER_NOW
  );
  console.log(
    `User delegation key created with start time: ${TEN_MINUTES_BEFORE_NOW}, end time: ${TEN_MINUTES_AFTER_NOW}`
  );
  // Need only list permission to list blobs
  const containerPermissionsForAnonymousUser = "l";

  // Best practice: SAS options are time-limited
  const sasOptions = {
    containerName,
    permissions: ContainerSASPermissions.parse(
      containerPermissionsForAnonymousUser
    ),
    protocol: SASProtocol.HttpsAndHttp,
    startsOn: TEN_MINUTES_BEFORE_NOW,
    expiresOn: TEN_MINUTES_AFTER_NOW,
  };

  console.log(`SAS options: ${JSON.stringify(sasOptions, null, 2)}`);

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    userDelegationKey,
    accountName
  ).toString();
  console.log(`SAS Token: ${sasToken}`);
  return sasToken;
}
