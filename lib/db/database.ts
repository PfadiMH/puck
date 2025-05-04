"use server";

import { Permission, SecurityConfig } from "@lib/auth/permissions";
import { FooterData } from "@lib/config/footer.config";
import { NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import { JsonService } from "./json";
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
  getPermissionsByRole(role: string): Promise<Permission[]>;
  getPermissionsByRoles(roles: string[]): Promise<Permission[]>;
  getSecurityConfig(): Promise<SecurityConfig>;
  saveSecurityConfig(RoleConfig: SecurityConfig): Promise<void>;
}

function getDatabaseService(): DatabaseService {
  const databaseType = process.env.DATABASE_TYPE;

  if (databaseType === "mongodb") {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!connectionString || !dbName) {
      console.warn(
        "MONGODB_CONNECTION_STRING or MONGODB_DB_NAME environment variables not set. Defaulting to JSON storage."
      );
    } else {
      console.log("Using MongoDB storage");
      return new MongoService(connectionString, dbName);
    }
  }

  // Default to JSON storage
  console.log("Using JSON storage");
  return new JsonService("database.json");
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

export async function getPermissionsByRole(role: string) {
  return dbService.getPermissionsByRole(role);
}

export async function getPermissionsByRoles(roles: string[]) {
  return dbService.getPermissionsByRoles(roles);
}
export async function getSecurityConfig() {
  return dbService.getSecurityConfig();
}
export async function saveSecurityConfig(permissions: SecurityConfig) {
  return dbService.saveSecurityConfig(permissions);
}
