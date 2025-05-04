import { defaultFooterData, FooterData } from "@lib/config/footer.config";
import { defaultNavbarData, NavbarData } from "@lib/config/navbar.config";
import { DocumentData, PageData } from "@lib/config/page.config";
import { FormResponseWithObject } from "@lib/form";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import { DatabaseService } from "./database";

interface DatabaseData {
  navbar: NavbarData;
  document: Record<string, DocumentData>;
  footer: FooterData;
  formResponses: Record<string, FormResponseWithObject>;
}

const defaultDatabaseData: DatabaseData = {
  navbar: defaultNavbarData,
  document: {},
  footer: defaultFooterData,
  formResponses: {},
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
    const id = uuid();
    const db = await this.getDatabase();
    db.document[path] = {
      ...data,
      id,
    };
    await this.saveDatabase(db);
  }

  async saveFormResponse(data: FormResponseWithObject): Promise<void> {
    const db = await this.getDatabase();
    const id = uuid();
    db.formResponses[id] = {
      componentId: data.componentId,
      pageId: data.pageId,
      formResponseObject: data.formResponseObject,
    };
    await this.saveDatabase(db);
  }

  async deletePage(path: string): Promise<void> {
    const db = await this.getDatabase();
    delete db.document[path];
    await this.saveDatabase(db);
  }

  async getDocument(path: string): Promise<DocumentData | undefined> {
    const db = await this.getDatabase();
    return db.document[path];
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
    return Object.keys(db.document);
  }

  async getDocumentComponent<T>(
    pageId: string,
    componentId: string
  ): Promise<T> {
    const db = await this.getDatabase();
    const document = Object.values(db.document).find(
      (doc) => doc.id === pageId
    );
    if (!document) {
      throw new Error(`Document with id ${pageId} not found`);
    }
    const comp = document.content.find((comp) => comp.props.id === componentId);
    if (!comp) {
      throw new Error(`Component with id ${componentId} not found`);
    }
    return comp.props as T;
  }
}
