import { defaultFooterData, FooterData } from "@lib/config/footer.config";
import { defaultNavbarData, NavbarData } from "@lib/config/navbar.config";
import { PageData } from "@lib/config/page.config";
import { Data } from "@measured/puck";
import { Db, MongoClient } from "mongodb";
import { DatabaseService } from "./database";

/**
 * MongoDB implementation of DatabaseService.
 * Data is stored as documents in a single collection.
 * Each document has a type field to differentiate between navbar, footer, and page data.
 */
export class MongoService implements DatabaseService {
  private client: MongoClient;
  private db: Db;
  private collectionName = "puck-data";

  constructor(connectionString: string, dbName: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db(dbName);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Ensure collection exists
    const collections = await this.db
      .listCollections({ name: this.collectionName })
      .toArray();
    if (collections.length === 0) {
      await this.db.createCollection(this.collectionName);
      await this.db.collection(this.collectionName).createIndex({ path: 1 });
    }

    // Ensure navbar exists
    const navbar = await this.db
      .collection(this.collectionName)
      .findOne({ type: "navbar" });
    if (!navbar) {
      console.log("Navbar data not found, creating with default data");
      await this.saveNavbar(defaultNavbarData);
    }

    // Ensure footer exists
    const footer = await this.db
      .collection(this.collectionName)
      .findOne({ type: "footer" });
    if (!footer) {
      console.log("Footer data not found, creating with default data");
      await this.saveFooter(defaultFooterData);
    }
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async savePage(path: string, data: Data): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { type: "page", path: path },
        { $set: { data: data, type: "page", path: path } },
        { upsert: true }
      );
  }

  async deletePage(path: string): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .deleteOne({ type: "page", path: path });
  }

  async getPage(path: string): Promise<PageData | undefined> {
    const result = await this.db
      .collection(this.collectionName)
      .findOne({ type: "page", path: path });
    return result ? result.data : undefined;
  }

  async saveNavbar(data: NavbarData): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { type: "navbar" },
        { $set: { data: data, type: "navbar" } },
        { upsert: true }
      );
  }

  async getNavbar(): Promise<NavbarData> {
    const result = await this.db
      .collection(this.collectionName)
      .findOne({ type: "navbar" });
    if (!result) throw new Error("Navbar data not found");
    return result.data;
  }

  async saveFooter(data: FooterData): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { type: "footer" },
        { $set: { data: data, type: "footer" } },
        { upsert: true }
      );
  }

  async getFooter(): Promise<FooterData> {
    const result = await this.db
      .collection(this.collectionName)
      .findOne({ type: "footer" });
    if (!result) throw new Error("Footer data not found");
    return result.data;
  }

  async getAllPaths(): Promise<string[]> {
    const pages = await this.db
      .collection(this.collectionName)
      .find({ type: "page" })
      .toArray();
    return pages.map((page) => page.path);
  }
}
