import { defaultNavbarData, NavbarData } from "@config/navbar.config";
import { DatabaseService } from "./database";
import fs from "fs/promises";
import { PageData } from "@config/page.config";
import { defaultFooterData, FooterData } from "@config/footer.config";

interface DatabaseData {
  navbar: NavbarData;
  page: Record<string, PageData>;
  footer: FooterData;
}

const defaultDatabaseData: DatabaseData = {
  navbar: defaultNavbarData,
  page: {},
  footer: defaultFooterData,
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
}
