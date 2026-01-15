import type { FooterData } from "@lib/config/footer.config";
import type { NavbarData } from "@lib/config/navbar.config";
import type { PageData } from "@lib/config/page.config";
import { env } from "@lib/env";
import type { SecurityConfig } from "@lib/security/security-config";
import type { Data } from "@measured/puck";
import { MockDatabaseService } from "./db-mock-impl";
import { MongoService } from "./db-mongo-impl";

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
}

/**
 * Selects and returns a DatabaseService implementation based on environment configuration.
 *
 * @returns A `DatabaseService` instance: a `MongoService` configured with `MONGODB_CONNECTION_STRING` and `MONGODB_DB_NAME` when both are present; otherwise a `MockDatabaseService`.
 */
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
 * For UI/Client access, use @lib/db/database.ts instead.
 */
export const dbService = getDatabaseService();