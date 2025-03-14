import { Data } from "@measured/puck";
import { JsonService } from "./json";
import { MongoService } from "./mongo";

export interface DatabaseService {
  savePage(path: string, data: Data): Promise<void>;
  deletePage(path: string): Promise<void>;
  getPage(path: string): Promise<Data | undefined>;
  saveNavbar(data: Data): Promise<void>;
  getNavbar(): Promise<Data | undefined>;
  saveFooter(data: Data): Promise<void>;
  getFooter(): Promise<Data | undefined>;
  getAllPaths(): Promise<string[]>;
}

export function getDatabaseService(): DatabaseService {
  const databaseType = process.env.DATABASE_TYPE;

  if (databaseType === "mongodb") {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!connectionString || !dbName) {
      console.warn(
        "MONGODB_CONNECTION_STRING or MONGODB_DB_NAME environment variables not set. Defaulting to JSON storage."
      );
    } else {
      return new MongoService(connectionString, dbName);
    }
  }

  // Default to JSON storage
  return new JsonService("database.json");
}

const dbService = getDatabaseService();

export async function savePage(path: string, data: Data) {
  return dbService.savePage(path, data);
}

export async function deletePage(path: string) {
  return dbService.deletePage(path);
}

export async function getPage(path: string): Promise<Data | undefined> {
  return dbService.getPage(path);
}

export async function saveNavbar(data: Data) {
  return dbService.saveNavbar(data);
}

export async function getNavbar(): Promise<Data | undefined> {
  return dbService.getNavbar();
}

export async function saveFooter(data: Data) {
  return dbService.saveFooter(data);
}

export async function getFooter(): Promise<Data | undefined> {
  return dbService.getFooter();
}

export async function getAllPaths() {
  return dbService.getAllPaths();
}
