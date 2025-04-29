"use client";
/// Similar to the databasse.ts but for file management -> use sas token to determine if to youse asb or json

import { ABSFileManagerImpl } from "./asb";
import { FilemanagerJsonService } from "./json";
import { createAccountSas } from "./sas";

export interface FilemanagerService {
  deleteFile(name: string): Promise<void>;
  saveFile(file: File): Promise<void>;
  getFile(name: string): Promise<string>;
  getFileNames(): Promise<string[]>;
}

async function getDatabaseService(): Promise<FilemanagerService> {
  const accountSas = await createAccountSas();
  if (accountSas) {
    return new ABSFileManagerImpl(accountSas);
  }

  console.log("Using JSON storage");
  return new FilemanagerJsonService("abs_database.json");
}
const dbService = await getDatabaseService();

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
