"use server";

import {
  AccountSASPermissions,
  AccountSASResourceTypes,
  AccountSASServices,
  generateAccountSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const constants = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
};

if (!constants.accountName || !constants.accountKey) {
  console.error(
    "AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY environment variables must be set."
  );
  throw new Error(
    "AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY environment variables must be set."
  );
}

const sharedKeyCredential = new StorageSharedKeyCredential(
  constants.accountName,
  constants.accountKey
);

export async function createAccountSas() {
  const sasOptions = {
    services: AccountSASServices.parse("btqf").toString(), // blobs, tables, queues, files
    resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
    permissions: AccountSASPermissions.parse("rwdlacupi"), // permissions
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
  };

  const sasToken = generateAccountSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();

  return sasToken;
}

type AccountInfos = {
  accountName: string;
  containerName: string;
};

export async function getAccountInfos(): Promise<AccountInfos> {
  return {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
    containerName: process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME || "",
  };
}
