import { ContainerClient } from "@azure/storage-blob";
import { StorageService } from "./storage";

/**
 * Azure Storage Blob implementation of StorageService.
 */
export class AzureStorageBlobService implements StorageService {
  private containerClient: ContainerClient;
  private containerName: string;
  private accountName: string;
  private baseUrl: string;
  private connectionString: string;

  constructor(
    containerName: string,
    accountName: string,
    accountKey: string,
    baseUrl: string
  ) {
    this.containerName = containerName;
    this.accountName = accountName;
    this.baseUrl = `https://${this.accountName}.${baseUrl}/${this.containerName}/`;
    this.connectionString = `DefaultEndpointsProtocol=https;AccountName=${this.accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
    this.containerClient = new ContainerClient(
      this.connectionString,
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
  async saveFile(file: File): Promise<void> {
    const content = await file.arrayBuffer();
    const blobName = file.name;
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(content, content.byteLength);
  }

  getFile(id: string): string {
    return `${this.baseUrl}${id}`;
  }

  async deleteFile(id: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(id);
    await blockBlobClient.delete();
  }
}
