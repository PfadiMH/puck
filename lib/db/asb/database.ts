"use server";

import { ASBAzureBlobStorageService } from "./asb";
import { ASBJsonService } from "./json";

export interface ASBDatabaseService {
  deleteFile(name: string): Promise<void>;
  saveFile(file: File): Promise<void>;
  getFile(name: string): Promise<string>;
  getFileNames(): Promise<string[]>;
}

function getDatabaseService(): ASBDatabaseService {
  const databaseType = process.env.DATABASE_TYPE;

  if (databaseType === "asb") {
    return new ASBAzureBlobStorageService(
      process.env.AZURE_USERNAME as string,
      process.env.ACCOUNT_KEY as string
    );
  }

  // Default to JSON storage
  console.log("Using JSON storage");
  return new ASBJsonService("abs_database.json");
}
const dbService = getDatabaseService();

export async function deleteFile(name: string) {
  return dbService.deleteFile(name);
}

export async function saveFile(file: File) {
  return dbService.saveFile(file);
}

export async function getFile(name: string) {
  return dbService.getFile(name);
}

export async function getFileNames() {
  return dbService.getFileNames();
}
