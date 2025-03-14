import { DatabaseService } from "./database";
import { Data } from "@measured/puck";
import fs from "fs/promises";

interface DatabaseData {
  navbar: Data;
  page: Record<string, Data>;
  footer: Data;
}

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
      await this.saveDatabase({ navbar: {}, page: {}, footer: {} });
    }
  }


  private async getDatabase(): Promise<DatabaseData> {
    const dbFile = await fs.readFile(this.dbPath, "utf-8");
    return JSON.parse(dbFile);
  }

  private async saveDatabase(db: DatabaseData): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(db));
  }

  async savePage(path: string, data: Data): Promise<void> {
    const db = await this.getDatabase();
    db.page[path] = data;
    await this.saveDatabase(db);
  }

  async deletePage(path: string): Promise<void> {
    const db = await this.getDatabase();
    delete db.page[path];
    await this.saveDatabase(db);
  }

  async getPage(path: string): Promise<Data | undefined> {
    const db = await this.getDatabase();
    return db.page[path];
  }

  async saveNavbar(data: Data): Promise<void> {
    const db = await this.getDatabase();
    db.navbar = data;
    await this.saveDatabase(db);
  }

  async getNavbar(): Promise<Data | undefined> {
    const db = await this.getDatabase();
    return db.navbar;
  }

  async saveFooter(data: Data): Promise<void> {
    const db = await this.getDatabase();
    db.footer = data;
    await this.saveDatabase(db);
  }

  async getFooter(): Promise<Data | undefined> {
    const db = await this.getDatabase();
    return db.footer;
  }

  async getAllPaths(): Promise<string[]> {
    const db = await this.getDatabase();
    return Object.keys(db.page);
  }
}
