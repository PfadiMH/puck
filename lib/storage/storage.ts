"use server";

import {
  deleteMetadata,
  getMetadata,
  MetadataProps,
  saveMetadata,
} from "@lib/db/database";
import { AzureStorageBlobService } from "./asb";

export interface StorageService {
  saveFile(file: File): Promise<void>;
  getFile(id: string): string;
  deleteFile(id: string): Promise<void>;
}

export interface FileProps extends MetadataProps {
  url: string;
}

function getStorageService(): StorageService {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  const baseUrl = process.env.AZURE_STORAGE_BASE_URL;

  if (!accountKey || !containerName || !accountName || !baseUrl) {
    console.warn(
      "AZURE_STORAGE_ACCOUNT_KEY or AZURE_STORAGE_CONTAINER_NAME or AZURE_STORAGE_ACCOUNT_NAME or AZURE_STORAGE_BASE_URL environment variables not set. Defaulting to JSON storage."
    );
    throw new Error(
      "Azure Storage configuration is incomplete. Please check your environment variables."
    );
  } else {
    console.log("Using Azure Blob storage");
    return new AzureStorageBlobService(
      containerName,
      accountName,
      accountKey,
      baseUrl
    );
  }
}

const storageService = getStorageService();

export async function deleteFile(id: string) {
  storageService.deleteFile(id);
  await deleteMetadata(id);
}

export async function getFile(id: string): Promise<FileProps> {
  const metadata = await getMetadata(id);
  const url = await storageService.getFile(id);

  return { ...metadata, url } as FileProps;
}

export async function saveFile(file: File, description: string) {
  const metadata: MetadataProps = {
    filename: file.name,
    size: file.size,
    createdAt: new Date(),
    updatedAt: new Date(),
    provider: storageService.constructor.name,
    contentType: file.type,
    description: description,
  };
  const id = await saveMetadata(metadata);
  const newFile = new File([file], id, { type: file.type });
  await storageService.saveFile(newFile);
  return id;
}
