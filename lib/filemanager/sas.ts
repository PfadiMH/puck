//functionn like getSasToken to get a sas token for a file and throw error if doent work

import {
  AccountSASPermissions,
  AccountSASResourceTypes,
  AccountSASServices,
  generateAccountSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export async function createAccountSas() {
  const constants = {
    accountName: process.env.AZURE_USERNAME,
    accountKey: process.env.ACCOUNT_KEY,
  };

  if (!constants.accountName || !constants.accountKey) {
    console.error(
      "AZURE_USERNAME and ACCOUNT_KEY environment variables must be set."
    );
    throw new Error(
      "AZURE_USERNAME and ACCOUNT_KEY environment variables must be set."
    );
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(
    constants.accountName,
    constants.accountKey
  );
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
