"use client";

import { ContainerClient } from "@azure/storage-blob";
import { FileManagerService } from "./filemanager";

/**
 * Azure Blob Storage implementation of ASBDatabaseService.
 * Data is stored as blobs in a container.
 */

export class ABSFileManagerImpl implements FileManagerService {
  private containerClient: ContainerClient;
  private containerName: string;
  private sasToken: string;
  private accountName: string;
  private baseUrl: string;

  constructor(containerName: string, accountName: string, sasToken: string) {
    this.containerName = containerName;
    this.accountName = accountName;
    this.sasToken = sasToken;
    this.baseUrl = `https://${this.accountName}.blob.core.windows.net/${this.containerName}/`;
    this.containerClient = new ContainerClient(
      `${this.baseUrl}?${this.sasToken}`
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
  async getFileUrl(name: string): Promise<string> {
    return `${this.baseUrl}${name}`;
  }

  async getFile(name: string): Promise<string> {
    const downloadUrl = `${this.baseUrl}${name}`;
    console.log("Download URL:", downloadUrl);
    return downloadUrl;
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
