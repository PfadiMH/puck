import {
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { ASBDatabaseService } from "./database";

/**
 * Azure Blob Storage implementation of ASBDatabaseService.
 * Data is stored as blobs in a container.
 */

export class ASBAzureBlobStorageService implements ASBDatabaseService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private containerName: string;

  constructor(account: string, accountKey: string) {
    const containerName = process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;
    if (!containerName) {
      throw new Error(
        "Azure Storage Blob container name is not defined in environment variables (AZURE_STORAGE_BLOB_CONTAINER_NAME)."
      );
    }
    this.containerName = containerName;

    const sharedKeyCredential = new StorageSharedKeyCredential(
      account,
      accountKey
    );
    this.blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      sharedKeyCredential
    );
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    this.initialize();
  }

  private async initialize(): Promise<void> {
    const containerExists = await this.containerClient.exists();
    if (!containerExists) {
      console.log(`Container '${this.containerName}' not found, creating...`);
      await this.containerClient.create();
    }
  }

  private async uploadBlob(data: File): Promise<void> {
    const content = await data.arrayBuffer();
    const blobName = data.name;
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(content, content.byteLength);
  }

  private async downloadBlob(
    blobName: string
  ): Promise<Uint8Array | undefined> {
    if (!(await this.checkBlobExists(blobName))) {
      return undefined;
    }
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    const downloadBlockBlobResponse = await blockBlobClient.download();
    const downloadedStream = downloadBlockBlobResponse.readableStreamBody;
    if (!downloadedStream) {
      return undefined;
    }
    const downloadedBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      downloadedStream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      downloadedStream.on("end", () => resolve(Buffer.concat(chunks)));
      downloadedStream.on("error", reject);
    });
    return new Uint8Array(downloadedBuffer);
  }

  private async deleteBlob(blobName: string): Promise<void> {
    if (await this.checkBlobExists(blobName)) {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
    }
  }

  private async checkBlobExists(blobName: string): Promise<boolean> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    return await blockBlobClient.exists();
  }

  async saveFile(file: File): Promise<void> {
    await this.uploadBlob(file);
  }

  async getFile(name: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(name);

    const downloadUrl = blockBlobClient.url;
    console.log("Download URL:", downloadUrl);
    const blobSasUrl = blockBlobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
    });
    return blobSasUrl;
  }

  async getAllFiles(): Promise<File[]> {
    const blobs = this.containerClient.listBlobsFlat();
    const files: File[] = [];
    for await (const blob of blobs) {
      const blobName = blob.name;
      const content = await this.downloadBlob(blobName);
      if (content) {
        const buffer = content.buffer.slice(
          content.byteOffset,
          content.byteOffset + content.byteLength
        );
        const blob = new Blob([content]);
        const file = new File([blob], blobName);
        files.push(file);
      }
    }
    return files;
  }

  async getFileNames(): Promise<string[]> {
    const blobs = this.containerClient.listBlobsFlat();
    const fileNames: string[] = [];
    for await (const blob of blobs) {
      const blobName = blob.name;
      fileNames.push(blobName);
    }
    return fileNames;
  }

  async deleteFile(name: string): Promise<void> {
    const blobName = name;
    await this.deleteBlob(blobName);
  }
}
