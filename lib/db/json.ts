import {
  defaultRoleConfig as defaultSecurityConfig,
  Permission,
  SecurityConfig,
} from "@lib/auth/permissions";
import { defaultFooterData, FooterData } from "@lib/config/footer.config";
import { defaultNavbarData, NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import fs from "fs/promises";
import { DatabaseService } from "./database";

interface DatabaseData {
  navbar: NavbarData;
  page: Record<string, PageData>;
  footer: FooterData;
  securityConfig: SecurityConfig;
}

const defaultDatabaseData: DatabaseData = {
  navbar: defaultNavbarData,
  page: {},
  footer: defaultFooterData,
  securityConfig: defaultSecurityConfig,
};

/**
 * JSON file implementation of DatabaseService
 * Data is stored in a single JSON file.
 */
export class JsonService implements DatabaseService {
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await fs.readFile(this.dbPath, "utf-8");
    } catch (error) {
      // If the file doesn't exist, create it with default data
      await this.saveDatabase(defaultDatabaseData);
    }
  }

  private async getDatabase(): Promise<DatabaseData> {
    const dbFile = await fs.readFile(this.dbPath, "utf-8");
    return JSON.parse(dbFile);
  }

  private async saveDatabase(db: DatabaseData): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(db));
  }

  async savePage(path: string, data: PageData): Promise<void> {
    const db = await this.getDatabase();
    db.page[path] = data;
    await this.saveDatabase(db);
  }

  async deletePage(path: string): Promise<void> {
    const db = await this.getDatabase();
    delete db.page[path];
    await this.saveDatabase(db);
  }

  async getPage(path: string): Promise<PageData | undefined> {
    const db = await this.getDatabase();
    return db.page[path];
  }

  async saveNavbar(data: NavbarData): Promise<void> {
    const db = await this.getDatabase();
    db.navbar = data;
    await this.saveDatabase(db);
  }

  async getNavbar(): Promise<NavbarData> {
    const db = await this.getDatabase();
    return db.navbar;
  }

  async saveFooter(data: FooterData): Promise<void> {
    const db = await this.getDatabase();
    db.footer = data;
    await this.saveDatabase(db);
  }

  async getFooter(): Promise<FooterData> {
    const db = await this.getDatabase();
    return db.footer;
  }

  async getAllPaths(): Promise<string[]> {
    const db = await this.getDatabase();
    return Object.keys(db.page);
  }

  async getPermissionsByRole(role: string): Promise<Permission[]> {
    const db = await this.getDatabase();
    if (db.securityConfig.roles[role]) {
      return db.securityConfig.roles[role].permissions;
    }
    return [];
  }

  async getPermissionsByRoles(roles: string[]): Promise<Permission[]> {
    const db = await this.getDatabase();
    const permissions: Permission[] = [];
    if (db.securityConfig && db.securityConfig.roles) {
      for (const role of roles) {
        if (db.securityConfig.roles[role]?.permissions) {
          permissions.push(...db.securityConfig.roles[role].permissions);
        }
      }
    }
    return [...new Set(permissions)];
  }

  async getRoleConfig(): Promise<SecurityConfig> {
    const db = await this.getDatabase();
    if (!db.securityConfig) {
      // If securityConfig is not defined, return the default
      return defaultSecurityConfig;
    }
    // If securityConfig is defined, return it
    return db.securityConfig;
  }
  async saveRoleConfig(roleConfig: SecurityConfig): Promise<void> {
    const db = await this.getDatabase();
    db.securityConfig = roleConfig;
    await this.saveDatabase(db);
  }
}
