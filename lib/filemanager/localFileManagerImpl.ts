"use server";
import * as fs from "node:fs/promises";
import path from "path";

export async function initializeDirectory(dbPath: string): Promise<void> {
  try {
    await fs.mkdir(dbPath, { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error);
    throw error;
  }
}

export async function getFileUrl(
  dbPath: string,
  name: string
): Promise<string> {
  console.log("getFileUrl", dbPath, name);
  dbPath = dbPath.startsWith("./public")
    ? dbPath.replace("./public/", "/")
    : dbPath;
  console.log("dbPath", dbPath);
  console.log("name", name);
  const absolutePath = path.join(dbPath, name);
  const finalPath = absolutePath;
  return finalPath;
}
export async function getFile(dbPath: string, name: string): Promise<string> {
  const filePath = path.join(dbPath, name);
  return await fs.readFile(filePath, "utf-8");
}
export async function getFileNames(dbPath: string): Promise<string[]> {
  return await fs.readdir(dbPath);
}
export async function saveFile(dbPath: string, file: File): Promise<void> {
  const buffer = await file.arrayBuffer();
  const filePath = path.join(dbPath, file.name);
  await fs.writeFile(filePath, Buffer.from(buffer));
}
export async function readFile(
  dbPath: string,
  filePath: string
): Promise<ArrayBuffer> {
  const absolutePath = path.join(dbPath, filePath);
  const fileBuffer = await fs.readFile(absolutePath);
  return fileBuffer.buffer
    .slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength)
    .slice(0) as ArrayBuffer;
}
export async function deleteFile(
  dbPath: string,
  filePath: string
): Promise<void> {
  const absolutePath = path.join(dbPath, filePath);
  await fs.rm(absolutePath);
}
export async function fileExists(
  dbPath: string,
  filePath: string
): Promise<boolean> {
  const absolutePath = path.join(dbPath, filePath);
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}
