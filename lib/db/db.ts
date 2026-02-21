import type { FooterData } from "@lib/config/footer.config";
import type { NavbarData } from "@lib/config/navbar.config";
import type { PageData } from "@lib/config/page.config";
import { env } from "@lib/env";
import type { SecurityConfig } from "@lib/security/security-config";
import type { Product, ProductInput, ShopSettings } from "@lib/shop/types";
import type { FileRecord, FileRecordInput } from "@lib/storage/file-record";
import type { Data } from "@puckeditor/core";
import { MockDatabaseService } from "./db-mock-impl";
import { MongoService } from "./db-mongo-impl";

export interface FileQueryOptions {
  folder?: string;
  search?: string;
  tags?: string[];
  limit?: number;
  cursor?: string; // _id of last item for cursor pagination
}

export interface FileQueryResult {
  files: FileRecord[];
  nextCursor: string | null;
  total: number;
}

export interface DatabaseService {
  savePage(path: string, data: Data): Promise<void>;
  deletePage(path: string): Promise<void>;
  getPage(path: string): Promise<PageData | undefined>;
  saveNavbar(data: NavbarData): Promise<void>;
  getNavbar(): Promise<NavbarData>;
  saveFooter(data: FooterData): Promise<void>;
  getFooter(): Promise<FooterData>;
  getAllPaths(): Promise<string[]>;
  getSecurityConfig(): Promise<SecurityConfig>;
  saveSecurityConfig(RoleConfig: SecurityConfig): Promise<void>;
  // File management
  saveFile(file: FileRecordInput): Promise<FileRecord>;
  getFile(id: string): Promise<FileRecord | null>;
  getAllFiles(): Promise<FileRecord[]>;
  queryFiles(options: FileQueryOptions): Promise<FileQueryResult>;
  countFiles(options: Omit<FileQueryOptions, "limit" | "cursor">): Promise<number>;
  deleteFile(id: string): Promise<void>;
  updateFile(
    id: string,
    updates: { folder?: string; tags?: string[] }
  ): Promise<FileRecord | null>;
  getAllFolders(): Promise<string[]>;
  // Shop
  getProducts(): Promise<Product[]>;
  getActiveProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  saveProduct(product: ProductInput): Promise<Product>;
  updateProduct(id: string, product: ProductInput): Promise<Product | null>;
  deleteProduct(id: string): Promise<void>;
  getShopSettings(): Promise<ShopSettings>;
  saveShopSettings(settings: ShopSettings): Promise<void>;
  decrementStock(
    productId: string,
    variantIndex: number,
    quantity: number
  ): Promise<boolean>;
  // Webhook idempotency
  isSessionProcessed(sessionId: string): Promise<boolean>;
  markSessionProcessed(sessionId: string): Promise<void>;
}

function getDatabaseService(): DatabaseService {
  const connectionString = env.MONGODB_CONNECTION_STRING;
  const dbName = env.MONGODB_DB_NAME;

  if (!connectionString) {
    if (process.env.SKIP_ENV_VALIDATION) {
      console.warn(
        "Missing MONGODB_CONNECTION_STRING, using MockDatabaseService (SKIP_ENV_VALIDATION is true)"
      );
      return new MockDatabaseService();
    }
  }

  if (!connectionString || !dbName) {
    console.warn("Missing MongoDB credentials, using MockDatabaseService");
    return new MockDatabaseService();
  }

  console.log("Using MongoDB storage");
  return new MongoService(connectionString, dbName);
}

/**
 * Internal Database Service.
 * DIRECT ACCESS - BYPASSES PERMISSION CHECKS.
 * Use only in trusted server contexts (e.g. API routes with their own auth).
 * For UI/Client access, use @lib/db/db-actions.ts instead.
 */
export const dbService = getDatabaseService();
