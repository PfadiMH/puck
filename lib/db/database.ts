"use server";

import { FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import { MongoService } from "./mongo";

export interface DatabaseService {
  savePage(path: string, data: PageData): Promise<void>;
  deletePage(path: string): Promise<void>;
  getPage(path: string): Promise<PageData | undefined>;
  saveNavbar(data: NavbarData): Promise<void>;
  getNavbar(): Promise<NavbarData>;
  saveFooter(data: FooterData): Promise<void>;
  getFooter(): Promise<FooterData>;
  getAllPaths(): Promise<string[]>;
}

function getDatabaseService(): DatabaseService {
  const connectionString = process.env.MONGODB_CONNECTION_STRING;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!connectionString || !dbName) {
    throw new Error(
      "MONGODB_CONNECTION_STRING and MONGODB_DB_NAME must be set in the environment variables"
    );
  } else {
    return new MongoService(connectionString, dbName);
  }
}

const dbService = getDatabaseService();

export async function savePage(path: string, data: PageData) {
  return dbService.savePage(path, data);
}

export async function deletePage(path: string) {
  return dbService.deletePage(path);
}

export async function getPage(path: string): Promise<PageData | undefined> {
  return dbService.getPage(path);
}

export async function saveNavbar(data: NavbarData) {
  return dbService.saveNavbar(data);
}

export async function getNavbar(): Promise<NavbarData> {
  return dbService.getNavbar();
}

export async function saveFooter(data: FooterData) {
  return dbService.saveFooter(data);
}

export async function getFooter(): Promise<FooterData> {
  return dbService.getFooter();
}

export async function getAllPaths() {
  return dbService.getAllPaths();
}
